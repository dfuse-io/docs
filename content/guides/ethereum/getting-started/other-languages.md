---
weight: 20
---

{{< row-wrapper >}}
{{< sub-section-title title="Getting Started with Other Languages"  protocol="ETH" >}}

The code from the examples on this page lives {{< externalLink href="https://github.com/dfuse-io/docs/tree/master/quickstarts" title="in the quickstarts folder of this docs GitHub repository">}}.

## 1. Get a dfuse API Key

{{< dfuse-account-creation >}}

## Initiate your project
### Generate the client stub and dependencies for your language

dfuse exposes its data through a GraphQL over gRPC interface. The protobuf files are {{< externalLink href="https://github.com/dfuse-io/graphql-over-grpc" title="in this GitHub repository">}}.

A lot of languages provide tools to generate client stubs from protobuf files, as you can find {{< externalLink href="https://grpc.io/docs/quickstart/" title="in the official gRPC documentation">}}.

{{< tabs "get-client-stub">}}

{{< tab title="Go" lang="shell" >}}
git clone https://github.com/dfuse-io/graphql-over-grpc.git
mkdir my-project
cd my-project

# You can install protoc by following those instructions
# https://grpc.io/docs/quickstart/go.html#before-you-begin

protoc -I ../graphql-over-grpc ../graphql-over-grpc/graphql/graphql.proto --go_out=plugins=grpc:.

go mod init my-project
touch main.go

{{< /tab >}}

{{< tab title="Python" lang="shell" >}}
python -m pip install grpcio-tools --ignore-installed

git clone https://github.com/dfuse-io/graphql-over-grpc.git
mkdir my-project
cd my-project

python -m grpc_tools.protoc -I ../graphql-over-grpc --python_out=. --grpc_python_out=. graphql/graphql.proto

touch main.py

{{< /tab >}}

{{< tab title="Shell" lang="shell" >}}
# On MacOS
brew install grpcurl

# On Linux/Windows
go get github.com/fullstorydev/grpcurl
go install github.com/fullstorydev/grpcurl/cmd/grpcurl
{{< /tab >}}

{{< tab title="Others" lang="shell" >}}
# Download from Git
git clone https://github.com/dfuse-io/graphql-over-grpc

# Download from a Zip archive
curl -sLO https://github.com/dfuse-io/graphql-over-grpc/archive/master.zip
unzip -q master.zip

# Generate your code
cd graphql-over-grpc
protoc graphql/graphql.proto # add your language-specific flags here
{{< /tab >}}

{{< /tabs >}}

### Start by adding this code to your "main" 

{{< tabs "initial code">}}
    {{< tab-code title="Go" filename="./quickstarts/go/main-eth.go" range=1:40 >}}
    {{< tab-code title="Python" filename="./quickstarts/python/main-eth-inital.py" range=1:30 >}}
{{< /tabs >}}

The code from the examples on this page lives {{< externalLink href="https://github.com/dfuse-io/docs/tree/master/quickstarts" title="in the quickstarts folder of this docs GitHub repository">}}.

## 3. Generate a JWT from your API key

The JWT is a token with a short expiration period, used to communicate with dfuse services. You will have to implement token caching and manage renewal upon expiration. See [Authentication]({{< relref "/guides/core-concepts/authentication" >}}) for details.

{{< tabs "generate-jwt">}}
{{< tab-code title="Go" filename="./quickstarts/go/main-eth.go" range=42:60 >}}
{{< tab-code title="Python" filename="./quickstarts/python/main-eth.py" range=17:28 >}}
{{< tab title="Shell" lang="shell" >}}
curl https://auth.dfuse.io/v1/auth/issue -s \
  --data-binary '{"api_key":"server_abcdef12345678900000000000"}'
{{< /tab >}}
{{< /tabs >}}


## 4. Create the client

We can now define the client creation code. The client can be re-used across all the requests and streams you need to do, it should be properly cached at the appropriate level for your use case.

{{< tabs "create-client" >}}
{{< tab-code title="Go" filename="./quickstarts/go/main-eth.go" range=62:73 >}}
{{< tab-code title="Python" filename="./quickstarts/python/main-eth.py" range=30:37 >}}
{{< /tabs >}}

## 5. Stream your first results

Let's first define the GraphQL operation, as a string, that we will use to perform
GraphQL subscription. This element tells the backend server what fields to return
to you, you get to choose and pick only what you are interested in.

{{< note >}}
Want to inspect the full set of available fields you can retrieve?

* [GraphQL API Reference]({{< ref "/reference/ethereum/graphql" >}})
* {{< externalLink href="https://mainnet.eth.dfuse.io/graphiql/?query=c3Vic2NyaXB0aW9uIHsKICBzZWFyY2hUcmFuc2FjdGlvbnMocXVlcnk6ICItdmFsdWU6MCB0eXBlOmNhbGwiLCBsb3dCbG9ja051bTogLTEpIHsKICAgIHVuZG8gY3Vyc29yCiAgICBub2RlIHsgaGFzaCBtYXRjaGluZ0NhbGxzIHsgY2FsbGVyIGFkZHJlc3MgdmFsdWUoZW5jb2Rpbmc6RVRIRVIpIH0gfQogIH0KfQ==" title="GraphiQL, online query editor with completion and docs">}}
{{< /note >}}

{{< tabs "define-query">}}
{{< tab-code title="Go" filename="./quickstarts/go/main-eth.go" range=75:95 >}}
{{< tab-code title="Python" filename="./quickstarts/python/main-eth.py" range=39:44 >}}
{{< /tabs >}}

And we can finally define the code needed to perform your first stream using
dfuse Search. The snippet initiate the connection with dfuse servers and start
streaming transfers forever.

{{< tabs "run-query">}}
{{< tab-code title="Go" filename="./quickstarts/go/main-eth.go" range=97:129 >}}
{{< tab-code title="Python" filename="./quickstarts/python/main-eth.py" range=46:58 >}}
{{< /tabs >}}

## Run the code
{{< tabs "run-your-project">}}

{{< tab title="Go" lang="shell" >}}
    DFUSE_API_KEY="your dfuse api key here" go run main.go
{{< /tab >}}

{{< tab title="Python" lang="shell" >}}
    DFUSE_API_KEY="your dfuse api key here" python main.py
{{< /tab >}}

{{< /tabs >}}


# What to do next?

* [GraphQL API Reference]({{< ref "/reference/ethereum/graphql" >}})
* {{< externalLink href="https://mainnet.eth.dfuse.io/graphiql/?query=c3Vic2NyaXB0aW9uIHsKICBzZWFyY2hUcmFuc2FjdGlvbnMocXVlcnk6ICItdmFsdWU6MCB0eXBlOmNhbGwiLCBsb3dCbG9ja051bTogLTEpIHsKICAgIHVuZG8gY3Vyc29yCiAgICBub2RlIHsgaGFzaCBtYXRjaGluZ0NhbGxzIHsgY2FsbGVyIGFkZHJlc3MgdmFsdWUoZW5jb2Rpbmc6RVRIRVIpIH0gfQogIH0KfQ==" title="GraphiQL, online query editor with completion and docs">}}
* [Look at one of our tutorials]({{< ref "/guides/ethereum/tutorials" >}})
* [Authentication]({{< relref "/guides/core-concepts/authentication" >}})
* [Cursors]({{< relref "/guides/core-concepts/cursors" >}})
* [GraphQL]({{< relref "/guides/core-concepts/graphql" >}})
* [Search Features]({{< relref "/guides/core-concepts/search-features" >}})

{{< row-wrapper-end >}}