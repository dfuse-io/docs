---
weight: 4
---


# Getting Started with Other Languages

dfuse exposes its data through a GraphQL over gRPC interface defined in [protobuf files](https://github.com/dfuse-io/graphql-over-grpc)
The code from these examples lives [in this github repository](https://github.com/dfuse-io/quickstart-tutorials)

## 1. Get a dfuse API Key

* Create your account on https://app.dfuse.io
* Click "Create New Key" and give it a name, a category (and value of the "Origin" header for a web key, see [Authentication]({{< relref "/guides/core-concepts/authentication" >}})).


## 2. Generate a JWT from your API key

The JWT is a token with a short expiration period, used to communicate with dfuse services. A new JWT must be requested before expiration (see [Authentication]({{< relref "/guides/core-concepts/authentication" >}})).
{{< tabs "generate-jwt">}}
{{< tab title="Go" lang="go" >}}
func getToken(dfuseAPIKey string) (token string, expiration time.Time, err error) {
    reqBody := bytes.NewBuffer([]byte(fmt.Sprintf(`{"api_key":"%s"}`, dfuseAPIKey)))
    resp, err := http.Post("https://auth.dfuse.io/v1/auth/issue", "application/json", reqBody)
    if err != nil || resp.StatusCode != 200 {
        err = fmt.Errorf("status code: %d, error: %s", resp.StatusCode, err)
        return
    }
    if body, err := ioutil.ReadAll(resp.Body); err == nil {
        token = gjson.GetBytes(body, "token").String()
        expiration = time.Unix(gjson.GetBytes(body, "expires_at").Int(), 0)
    }
    return
}
{{< /tab >}}
{{< tab title="Python" lang="shell" >}}
def get_token(dfuse_api_key):
    connection = http.client.HTTPSConnection("auth.dfuse.io")
    connection.request('POST', '/v1/auth/issue', json.dumps({"api_key": apiKey}), {'Content-type': 'application/json'})
    response = connection.getresponse()
    if response.status != 200:
        raise Exception(" Status: {response.status} reason: {response.reason}")
    decoded = json.loads(response.read().decode())
    connection.close()
    return decoded['token'], decoded['expires_at']
{{< /tab >}}
{{< tab title="Shell" lang="shell" >}}
curl https://auth.dfuse.io/v1/auth/issue -s --data-binary '{"api_key":"web_abcdef12345678900000000000"}'
{{< /tab >}}
{{< /tabs >}}

## 3. Get the client stub and dependencies for your language

The protobuf files defining our graphql-over-grpc interface are defined available [in this github repository](https://github.com/dfuse-io/graphql-over-grpc)

A lot of languages provide tools to generate client stubs from protobuf files, presented [in this gRPC guide](https://grpc.io/docs/quickstart/).

For your convenience, we also provide pre-generated client stubs for some languages [in this github repository](https://github.com/dfuse-io/quickstart-tutorials)

{{< tabs "get-client-stub">}}
{{< tab title="Go" lang="shell" >}}
git clone https://github.com/dfuse-io/quickstart-tutorials
cd quickstart-tutorials/go
go test # gets dependencies
{{< /tab >}}
{{< tab title="Python" lang="shell" >}}
git clone https://github.com/dfuse-io/quickstart-tutorials
cd quickstart-tutorials/python
python -m pip install grpcio --ignore-installed
{{< /tab >}}
{{< /tabs >}}

## 4. Run your first query

{{< tabs "run-query">}}
{{< tab title="Go" lang="go" >}}
import (
      // ...

      // generated protobuf files
      pb "github.com/dfuse-io/quickstart-tutorials/pb"
      "golang.org/x/oauth2"
      "google.golang.org/grpc"
      "google.golang.org/grpc/credentials"
      "google.golang.org/grpc/credentials/oauth"
)

func main() {
    token := getToken(...) // JWT from earlier
    credential := oauth.NewOauthAccess(&oauth2.Token{AccessToken: token, TokenType: "Bearer"})
    transportCreds := credentials.NewClientTLSFromCert(nil, "")

    endpoint := "mainnet.eth.dfuse.io:443"
    conn, err := grpc.Dial(endpoint,
                           grpc.WithPerRPCCredentials(credential),
                           grpc.WithTransportCredentials(transportCreds))
    checkErr(err)

    req := &pb.Request{Query: `subscription {
         searchTransactions(query: "method:\"transfer(address,uint256)\"",
           sort:DESC, limit:1) {
           node{
             hash
           }
           block{
             number
           }
         }
       }`}
    client := pb.NewGraphQLClient(conn)
    executor, err := client.Execute(context.Background(), req)
    checkErr(err)

    resp, err := executor.Recv()
    checkErr(err)
    fmt.Println("ETH Mainnet last transfer", resp.Data)
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


# 5. Full working examples

{{< tabs "full-working">}}
{{< tab title="Go" lang="shell" >}}
git clone https://github.com/dfuse-io/quickstart-tutorials
cd quickstart-tutorials/go
export DFUSE_API_KEY={your_api_key}
go run -v
{{< /tab >}}
{{< tab title="Python" lang="shell" >}}
git clone https://github.com/dfuse-io/quickstart-tutorials
cd quickstart-tutorials/python
python -m pip install grpcio --ignore-installed
export DFUSE_API_KEY={your_api_key}
python main.py
{{< /tab >}}
{{< /tabs >}}



