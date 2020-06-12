// CODE:BEGIN:quickstarts_go_eos_section1
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

// CODE:END:quickstarts_go_eos_section1

// CODE:BEGIN:quickstarts_go_eos_section2
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

// CODE:END:quickstarts_go_eos_section2
// CODE:BEGIN:quickstarts_go_eos_section3
func createClient(endpoint string) pb.GraphQLClient {
	dfuseAPIKey := os.Getenv("DFUSE_API_KEY")
	if dfuseAPIKey == "" {
		panic("you must specify a DFUSE_API_KEY environment variable")
	}

	token, _, err := getToken(dfuseAPIKey)
	panicIfError(err)

	credential := oauth.NewOauthAccess(&oauth2.Token{AccessToken: token, TokenType: "Bearer"})
	transportCreds := credentials.NewClientTLSFromCert(nil, "")
	conn, err := grpc.Dial(endpoint,
		grpc.WithPerRPCCredentials(credential),
		grpc.WithTransportCredentials(transportCreds),
	)
	panicIfError(err)

	return pb.NewGraphQLClient(conn)
}

// CODE:END:quickstarts_go_eos_section3

//
/// Ethereum
//

const operationETH = `subscription {
  searchTransactions(indexName:CALLS query: "-value:0 type:call", lowBlockNum: -1) {
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

func streamEthereum(ctx context.Context) {
	/* The client can be re-used for all requests, cache it at the appropriate level */
	client := createClient("mainnet.eth.dfuse.io:443")
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

//
/// EOSIO
//
// CODE:BEGIN:quickstarts_go_eos_section4
const operationEOS = `subscription {
  searchTransactionsForward(query:"receiver:eosio.token action:transfer -data.quantity:'0.0001 EOS'") {
    undo cursor
    trace { id matchingActions { json } }
  }
}`

type eosioDocument struct {
	SearchTransactionsForward struct {
		Cursor string
		Undo   bool
		Trace  struct {
			ID              string
			MatchingActions []struct {
				JSON map[string]interface{}
			}
		}
	}
}

// CODE:END:quickstarts_go_eos_section4
// CODE:BEGIN:quickstarts_go_eos_section5
func streamEOSIO(ctx context.Context) {
	/* The client can be re-used for all requests, cache it at the appropriate level */
	client := createClient("mainnet.eos.dfuse.io:443")
	executor, err := client.Execute(ctx, &pb.Request{Query: operationEOS})
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

		document := &eosioDocument{}
		err = json.Unmarshal([]byte(resp.Data), document)
		panicIfError(err)

		result := document.SearchTransactionsForward
		reverted := ""
		if result.Undo {
			reverted = " REVERTED"
		}

		for _, action := range result.Trace.MatchingActions {
			data := action.JSON
			fmt.Printf("Transfer %s -> %s [%s]%s\n", data["from"], data["to"], data["quantity"], reverted)
		}
	}
}

// CODE:END:quickstarts_go_eos_section5
/* DFUSE_API_KEY="server_abcdef12345678900000000000" go run main.go eosio|ethereum */
// CODE:BEGIN:quickstarts_go_eos_section6
func main() {
	proto := ""
	if len(os.Args) >= 2 {
		proto = os.Args[1]
	}

	switch proto {
	case "ethereum", "ETH":
		streamEthereum(context.Background())
	default:
		streamEOSIO(context.Background())
	}
}

func panicIfError(err error) {
	if err != nil {
		panic(err)
	}
}

// CODE:END:quickstarts_go_eos_section6
