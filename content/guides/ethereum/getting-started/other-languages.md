---
weight: 4
---


# Getting Started with Other Languages

dfuse exposes its data through a GraphQL over gRPC interface defined in [protobuf files](https://github.com/dfuse-io/graphql-over-grpc/tree/master/pb) # FIXME repo structure

## Get the client stub for your language

For your convenience, we provide [client stubs for multiple languages](https://github.com/dfuse-io/graphql-over-grpc/tree/master/client-stubs) # FIXME write these stubs
If your language is not in this list, you can still [generate your own](https://grpc.io/docs/quickstart/).

{{< tabs "get-client-stub">}}
{{< tab title="Go" lang="shell" >}}
# requires go 1.12+

# get the client stub
git clone https://github.com/dfuse-io/graphql-over-grpc
cd graphql-over-grpc/go

# test your installation
export DFUSE_TOKEN={YOUR_DFUSE_TOKEN}
export DFUSE_CHAIN=eth-mainnet
go test
{{< /tab >}}
{{< tab title="Python" lang="shell" >}}
# requires Python2.7+ or Python3.4+

# get the client stub
git clone https://github.com/dfuse-io/graphql-over-grpc
cd graphql-over-grpc/python
python -m pip install grpcio --ignore-installed

# test your installation
python getblock.py eth-mainnet {YOUR_DFUSE_TOKEN} # FIXME write this code
{{< /tab >}}
{{< /tabs >}}

## Run your first query

{{< tabs "run-query">}}
{{< tab title="Go" lang="go" >}}
// FIXME remove EOS references
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
{{< /tab >}}
{{< tab title="Python" lang="python" >}}
# FIXME remove EOS references, only ETH
import http.client
import json
import ssl
import sys

import grpc

from graphql import graphql_pb2_grpc
from graphql.graphql_pb2 import Request

ssl._create_default_https_context = ssl._create_unverified_context


def token_for_api_key(apiKey):
    connection = http.client.HTTPSConnection("auth.dfuse.io")
    connection.request('POST', '/v1/auth/issue', json.dumps({"api_key": apiKey}), {'Content-type': 'application/json'})
    response = connection.getresponse()

    if response.status != 200:
        raise Exception(f" Status: {response.status} reason: {response.reason}")

    token = json.loads(response.read().decode())['token']
    connection.close()

    return token


def stub():
    credentials = grpc.access_token_call_credentials(token_for_api_key(sys.argv[1]))
    channel = grpc.secure_channel('mainnet.eos.dfuse.io:443',
                                  credentials=grpc.composite_channel_credentials(grpc.ssl_channel_credentials(),
                                                                                 credentials))
    return graphql_pb2_grpc.GraphQLStub(channel)


query = '''
subscription {
  searchTransactionsForward(query: "account:eosio.token receiver:eosio.token action:transfer", limit: 10) {
    trace {
      id
      matchingActions{
        account
        receiver
        name
        json
      }
    }
  }
}
'''

dfuse_graphql = stub()
stream = dfuse_graphql.Execute(Request(query=query))

for rawResult in stream:
    if rawResult.errors:
      print("An error occurred")
      print(rawResult.errors)
    else:
      result = json.loads(rawResult.data)
      print(result['searchTransactionsForward']['trace']['matchingActions'])
{{< /tab >}}
{{< /tabs >}}

