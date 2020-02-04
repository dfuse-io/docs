package main

import (
	"context"
	"fmt"
	"log"
	pbgraphql "main/graphql"
	"os"

	"github.com/dfuse-io/eosws-go"
	"golang.org/x/oauth2"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
	"google.golang.org/grpc/credentials/oauth"
	"io"
)

func main() {
	token, _, err := eosws.Auth(os.Args[1])
	if err != nil {
		log.Fatalf("cannot get auth token: %s", err)
	}

	credential := oauth.NewOauthAccess(&oauth2.Token{AccessToken: token, TokenType: "Bearer"})
	connection, err := grpc.Dial("mainnet.eos.dfuse.io:443", grpc.WithPerRPCCredentials(credential), grpc.WithTransportCredentials(credentials.NewClientTLSFromCert(nil, "")))
	graphqlClient := pbgraphql.NewGraphQLClient(connection)

	q := `subscription  {
		  searchTransactionsForward(query: "action:transfer", limit:10) {
			trace { matchingActions {receiver account name json }}}}`

	executionClient, err := graphqlClient.Execute(context.Background(), &pbgraphql.Request{Query: q})
	if err != nil {
		log.Fatalf("execution error: %s", err)
	}

	for {
		response, err := executionClient.Recv()
		if err != nil {
			if err != io.EOF {
				log.Fatalf("reception error: %s", err)
			}
			fmt.Println("No more result available")
			break
		}
		fmt.Println("Received response:", response.Data)
	}
}
