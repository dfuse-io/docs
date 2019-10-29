---
weight: 4
---


# Getting Started with Other Languages

dfuse exposes its data through a GraphQL over gRPC interface. The protobuf files are {{< externalLink href="https://github.com/dfuse-io/graphql-over-grpc" title="in this github repository">}}
<p>
The code from the examples on this page lives {{< externalLink href="https://github.com/dfuse-io/quickstart-tutorials" title="in the quickstart-tutorials github repository">}}
</p>

## 1. Get a dfuse API Key

* Create your account on https://app.dfuse.io
* Click "Create New Key" and give it a name, a category (and value of the "Origin" header in the case of a web key). See [Authentication]({{< relref "/guides/core-concepts/authentication" >}}) for details.


## 2. Generate a JWT from your API key

The JWT is a token with a short expiration period, used to communicate with dfuse services. You will have to implement token caching and manage renewal upon expiration. See [Authentication]({{< relref "/guides/core-concepts/authentication" >}}) for details.
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
{{< tab title="Python" lang="python" >}}
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
{{< tab title="shell" lang="shell" >}}
curl https://auth.dfuse.io/v1/auth/issue -s \
  --data-binary '{"api_key":"web_abcdef12345678900000000000"}'
{{< /tab >}}
{{< /tabs >}}

## 3. Get the client stub and dependencies for your language

The protobuf files defining our graphql-over-grpc interface are available {{< externalLink href="https://github.com/dfuse-io/graphql-over-grpc" title="in this github repository">}}.

A lot of languages provide tools to generate client stubs from protobuf files, as you can find {{< externalLink href="https://grpc.io/docs/quickstart/" title="in the official gRPC documentation">}}.

For your convenience, we also provide pre-generated client stubs for some languages {{< externalLink href="https://github.com/dfuse-io/quickstart-tutorials" title="in the quickstart-tutorials repository">}}

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
{{< tab title="shell" lang="shell" >}}
# on mac
brew install grpcurl

# on linux
go get github.com/fullstorydev/grpcurl
go install github.com/fullstorydev/grpcurl/cmd/grpcurl
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
try:
    # python3
    from http.client import HTTPSConnection
except ImportError:
    # python2
    from httplib import HTTPSConnection

import json
import ssl
import sys
import grpc

from graphql import graphql_pb2_grpc    # generated from proto
from graphql.graphql_pb2 import Request # generated from proto

def client(endpoint):
    credentials = grpc.access_token_call_credentials(token_for_api_key(sys.argv[1]))
    channel = grpc.secure_channel(endpoint,
                                  credentials=grpc.composite_channel_credentials(grpc.ssl_channel_credentials(),
                                                                                 credentials))
    return graphql_pb2_grpc.GraphQLStub(channel)

query = """
subscription {
  searchTransactions(query: "method:\\"transfer(address,uint256)\\"", limit: 5, sort: DESC) {
     node{
       hash
     }
     block{
       number
     }
   }
}
"""
dfuse_graphql = client('mainnet.eth.dfuse.io:443')
stream = dfuse_graphql.Execute(Request(query=query))

for rawResult in stream:
    if rawResult.errors:
      print("An error occurred")
      print(rawResult.errors)
    else:
      result = json.loads(rawResult.data)
      print(result['searchTransactions'])
{{< /tab >}}
{{< tab title="shell" lang="shell" >}}
echo '{"query": "subscription { ' \
        'searchTransactions(query: ' \
          '\"method:\\\"transfer(address,uint256)\\\"\", '\
          'limit: 2,'\
          'sort: DESC)' \
       '{ node{ hash } block{ number } } }' \
     '"}' | 
   grpcurl -H "Authorization: Bearer $DFUSE_TOKEN" \
           -d @ \
           mainnet.eth.dfuse.io:443  \
           dfuse.graphql.v1.GraphQL/Execute

# output
#{
#  "data": "{\"searchTransactions\":{\"node\":{\"hash\":\"0xd84c56030aaa0f8dcfabc372c266e643f326ffedf7bd00a6c8207521a4cfff40\"},\"block\":{\"number\":\"8836162\"}}}"
#}
#{
#  "data": "{\"searchTransactions\":{\"node\":{\"hash\":\"0xb5bf8e337f538865e2d2d09470c1749c2171e2bf14a64955f1689e6df434a961\"},\"block\":{\"number\":\"8836162\"}}}"
#}


{{< /tab >}}
{{< /tabs >}}


# 5. Full working examples

{{< tabs "full-working">}}
{{< tab title="Go" lang="shell" >}}
git clone https://github.com/dfuse-io/quickstart-tutorials
cd quickstart-tutorials/go
export DFUSE_API_KEY={your_api_key}
export DFUSE_PROTO=eth
go run main.go

# output
# ETH Mainnet last transfer {"searchTransactions":{"node":{"hash":"0xaed445665e6ca4fd2c69027ac69b4e142a28fd03579c1e74a84a88410a249737"},"block":{"number":"8835342"}}}

{{< /tab >}}
{{< tab title="Python" lang="shell" >}}
git clone https://github.com/dfuse-io/quickstart-tutorials
cd quickstart-tutorials/python
python -m pip install grpcio --ignore-installed
python main.py {your_api_key} eth

# output
# == ETH results ==
# {u'node': {u'hash': u'0xc2d82d5c757660be58acff93142ccb1f1113a72c1e3e1ccb5d30b39bcf6dbb83'}, u'block': {u'number': u'8836092'}}
# {u'node': {u'hash': u'0x14d51676630beddefea2968534e0e2e9b5ef3dae611dab0053ad3b141246ac0e'}, u'block': {u'number': u'8836092'}}
# {u'node': {u'hash': u'0xf992d0efe83b0f327bd3c7423893406e6d4335c017c77b13966f2b3182b58531'}, u'block': {u'number': u'8836092'}}
# {u'node': {u'hash': u'0xee2ce097f8cc051f9c8e3b7d9abfafc21780415cc42439ff06d4df1303922b9a'}, u'block': {u'number': u'8836092'}}
# {u'node': {u'hash': u'0xe49ae868ed37ac03e77e25cebb3e84ee75edbf091a5a3be95e6b808920599dfc'}, u'block': {u'number': u'8836092'}}

{{< /tab >}}
{{< /tabs >}}
