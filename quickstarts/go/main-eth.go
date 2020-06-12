// CODE:BEGIN:quickstarts_go_ethereum_section1
package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"time"

	pb "github.com/dfuse-io/docs/quickstarts/go/pb"

	"github.com/tidwall/gjson"
	"golang.org/x/oauth2"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
	"google.golang.org/grpc/credentials/oauth"
)

func main() {

	dfuseAPIKey := os.Getenv("DFUSE_API_KEY")
	if dfuseAPIKey == "" || dfuseAPIKey == "your dfuse api key here" {
		panic("you must specify a DFUSE_API_KEY environment variable")
	}

	token, _, err := getToken(dfuseAPIKey)
	panicIfError(err)

	client := createClient("mainnet.eth.dfuse.io:443", token)

	streamEthereum(context.Background(), client)
}

func panicIfError(err error) {
	if err != nil {
		panic(err)
	}
}

// CODE:END:quickstarts_go_ethereum_section1

// CODE:BEGIN:quickstarts_go_ethereum_section2
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

// CODE:END:quickstarts_go_ethereum_section2

// CODE:BEGIN:quickstarts_go_ethereum_section3
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

// CODE:END:quickstarts_go_ethereum_section3

// CODE:BEGIN:quickstarts_go_ethereum_section4
const operationETH = `subscription {
  searchTransactions(indexName:CALLS, query:"-value:0 type:call", lowBlockNum: -1) {
    undo cursor
    node { hash matchingCalls { from to value(encoding:ETHER) } }
  }
}`

type ethereumDocument struct {
	SearchTransactions struct {
		Cursor string
		Undo   bool
		Node   struct {
			Hash          string
			MatchingCalls []struct {
				From  string
				To    string
				Value string
			}
		}
	}
}

// CODE:END:quickstarts_go_ethereum_section4

// CODE:BEGIN:quickstarts_go_ethereum_section5
func streamEthereum(ctx context.Context, client pb.GraphQLClient) {

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
			fmt.Printf("Transfer %s -> %s [%s Ether]%s\n", call.From, call.To, call.Value, reverted)
		}
	}
}

// CODE:END:quickstarts_go_ethereum_section5
