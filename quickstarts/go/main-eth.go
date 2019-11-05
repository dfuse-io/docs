package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	pb "my-project/graphql"
	"net/http"
	"os"
	"time"

	"github.com/tidwall/gjson"
	"golang.org/x/oauth2"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
	"google.golang.org/grpc/credentials/oauth"
)

func getToken(apiKey string) (token string, expiration time.Time, err error) {
	reqBody := bytes.NewBuffer([]byte(fmt.Sprintf(`{"api_key":"%s"}`, apiKey)))
	resp, err := http.Post("https://auth.dfuse.io/v1/auth/issue", "application/json", reqBody)
	if err != nil {
		err = fmt.Errorf("unable to obtain token: %s", err)
		return
	}

	if resp.StatusCode != 200 {
		err = fmt.Errorf("unable to obtain token, status not 200, got %d: %s", resp.StatusCode, reqBody.String())
		return
	}

	if body, err := ioutil.ReadAll(resp.Body); err == nil {
		token = gjson.GetBytes(body, "token").String()
		expiration = time.Unix(gjson.GetBytes(body, "expires_at").Int(), 0)
	}
	return
}

func createClient(endpoint string, token string) pb.GraphQLClient {

	credential := oauth.NewOauthAccess(&oauth2.Token{AccessToken: token, TokenType: "Bearer"})
	transportCreds := credentials.NewClientTLSFromCert(nil, "")
	conn, err := grpc.Dial(endpoint,
		grpc.WithPerRPCCredentials(credential),
		grpc.WithTransportCredentials(transportCreds),
	)
	panicIfError(err)

	return pb.NewGraphQLClient(conn)
}

const operationETH = `subscription {
  searchTransactions(query: "-value:0 type:call", lowBlockNum: -1) {
    undo cursor
    node { hash matchingCalls { caller address value(encoding:ETHER) } }
  }
}`

type ethereumDocument struct {
	SearchTransactions struct {
		Cursor string
		Undo   bool
		Node   struct {
			Hash          string
			MatchingCalls []struct {
				Caller  string
				Address string
				Value   string
			}
		}
	}
}

func streamEthereum(ctx context.Context, token string) {
	/* The client can be re-used for all requests, cache it at the appropriate level */
	client := createClient("mainnet.eth.dfuse.io:443", token)

	executor, err := client.Execute(ctx, &pb.Request{Query: operationETH})
	panicIfError(err)

	for {
		resp, err := executor.Recv()
		panicIfError(err)

		if len(resp.Errors) > 0 {
			for _, err := range resp.Errors {
				fmt.Printf("Request failed: %s\n", err)
			}

			/* We continue here, but you could take another decision here, like exiting the process */
			continue
		}

		document := &ethereumDocument{}
		err = json.Unmarshal([]byte(resp.Data), document)
		panicIfError(err)

		result := document.SearchTransactions
		reverted := ""
		if result.Undo {
			reverted = " REVERTED"
		}

		for _, call := range result.Node.MatchingCalls {
			fmt.Printf("Transfer %s -> %s [%s Ether]%s\n", call.Caller, call.Address, call.Value, reverted)
		}
	}
}

/*
		To run this code execute these command

		go mod init my-project
	 	DFUSE_API_KEY="your dfuse api key here" go run main.go

*/

func main() {

	dfuseAPIKey := os.Getenv("DFUSE_API_KEY")
	if dfuseAPIKey == "" {
		panic("you must specify a DFUSE_API_KEY environment variable")
	}

	token, _, err := getToken(dfuseAPIKey)
	panicIfError(err)

	streamEthereum(context.Background(), token)
}

func panicIfError(err error) {
	if err != nil {
		panic(err)
	}
}
