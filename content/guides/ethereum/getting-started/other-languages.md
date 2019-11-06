---
weight: 4
---

# Getting Started with Other Languages

The code from the examples on this page lives {{< externalLink href="https://github.com/dfuse-io/docs/tree/master/quickstarts" title="in the quickstarts folder of this docs GitHub repository">}}.

## 1. Get a dfuse API Key

{{< dfuse-account-creation >}}

## 2. Generate the client stub and dependencies for your language

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

touch main.go

...

{{< /tab >}}

{{< tab title="Python" lang="shell" >}}
git clone https://github.com/dfuse-io/docs
cd docs/quickstarts/python
python -m pip install grpcio-tools --ignore-installed
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


## 3. Generate a JWT from your API key

The JWT is a token with a short expiration period, used to communicate with dfuse services. You will have to implement token caching and manage renewal upon expiration. See [Authentication]({{< relref "/guides/core-concepts/authentication" >}}) for details.

{{< tabs "generate-jwt">}}
{{< tab-code title="Go" filename="./quickstarts/go/main-eth.go" range=21:39 >}}
{{< tab-code title="Python" filename="./quickstarts/python/main.py" range=17:28 >}}
{{< tab title="Shell" lang="shell" >}}
curl https://auth.dfuse.io/v1/auth/issue -s \
  --data-binary '{"api_key":"server_abcdef12345678900000000000"}'
{{< /tab >}}
{{< /tabs >}}


## 4. Create the client

Now that you have generated the client stub (or picked the generated one), we can
now define the client creation code. The client can be re-used across all the
requests and streams you need to do, it should be properly cached at the appropriate
level for your use case.

{{< tabs "create-client" >}}
{{< tab-code title="Go" filename="./quickstarts/go/main-eth.go" range=41:59 >}}
{{< tab-code title="Python" filename="./quickstarts/python/main.py" range=30:41 >}}
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
{{< tab-code title="Go" filename="./quickstarts/go/main-eth.go" range=54:74 >}}
{{< tab-code title="Python" filename="./quickstarts/python/main.py" range=47:52 >}}
{{< /tabs >}}

And we can finally define the code needed to perform your first stream using
dfuse Search. The snippet initiate the connection with dfuse servers and start
streaming transfers forever.

{{< tabs "run-query">}}
{{< tab-code title="Go" filename="./quickstarts/go/main-eth.go" range=76:109 >}}
{{< tab-code title="Python" filename="./quickstarts/python/main.py" range=54:68 >}}
{{< /tabs >}}

## 6. Full working examples

The code from the examples on this page lives {{< externalLink href="https://github.com/dfuse-io/docs/tree/master/quickstarts" title="in the quickstarts folder of this docs GitHub repository">}}.

{{< tabs "full-working">}}
{{< tab-code title="Go" filename="./quickstarts/go/main-eth.go" range=1:163 >}}
{{< tab-code title="Python" filename="./quickstarts/python/main.py" range=1:109 >}}
{{< /tabs >}}

## 7. What's next?

* [GraphQL API Reference]({{< ref "/reference/ethereum/graphql" >}})
* {{< externalLink href="https://mainnet.eth.dfuse.io/graphiql/?query=c3Vic2NyaXB0aW9uIHsKICBzZWFyY2hUcmFuc2FjdGlvbnMocXVlcnk6ICItdmFsdWU6MCB0eXBlOmNhbGwiLCBsb3dCbG9ja051bTogLTEpIHsKICAgIHVuZG8gY3Vyc29yCiAgICBub2RlIHsgaGFzaCBtYXRjaGluZ0NhbGxzIHsgY2FsbGVyIGFkZHJlc3MgdmFsdWUoZW5jb2Rpbmc6RVRIRVIpIH0gfQogIH0KfQ==" title="GraphiQL, online query editor with completion and docs">}}
* [Look at one of our tutorials]({{< ref "/guides/ethereum/tutorials" >}})
* [Authentication]({{< relref "/guides/core-concepts/authentication" >}})
* [Cursors]({{< relref "/guides/core-concepts/cursors" >}})
* [GraphQL]({{< relref "/guides/core-concepts/graphql" >}})
* [Search Features]({{< relref "/guides/core-concepts/search-features" >}})

