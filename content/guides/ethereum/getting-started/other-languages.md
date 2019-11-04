---
weight: 4
---

# Getting Started with Other Languages

dfuse exposes its data through a GraphQL over gRPC interface. The protobuf files are {{< externalLink href="https://github.com/dfuse-io/graphql-over-grpc" title="in this GitHub repository">}}.

The code from the examples on this page lives {{< externalLink href="https://github.com/dfuse-io/docs/tree/master/quickstarts" title="in the quickstarts folder of this docs GitHub repository">}}.

## 1. Get a dfuse API Key

* Create your account on https://app.dfuse.io
* Click "Create New Key" and give it a name, a category (and value of the "Origin" header in the case of a web key). See [Authentication]({{< relref "/guides/core-concepts/authentication" >}}) for details.

## 2. Generate a JWT from your API key

The JWT is a token with a short expiration period, used to communicate with dfuse services. You will have to implement token caching and manage renewal upon expiration. See [Authentication]({{< relref "/guides/core-concepts/authentication" >}}) for details.

{{< tabs "generate-jwt">}}
{{< tab-code title="Go" filename="./quickstarts/go/main.go" range=21:39 >}}
{{< tab-code title="Python" filename="./quickstarts/python/main.py" range=17:28 >}}
{{< tab title="Shell" lang="shell" >}}
curl https://auth.dfuse.io/v1/auth/issue -s \
  --data-binary '{"api_key":"server_abcdef12345678900000000000"}'
{{< /tab >}}
{{< /tabs >}}

## 3. Get the client stub and dependencies for your language

The protobuf files defining our graphql-over-grpc interface are available {{< externalLink href="https://github.com/dfuse-io/graphql-over-grpc" title="in this GitHub repository">}}.

A lot of languages provide tools to generate client stubs from protobuf files, as you can find {{< externalLink href="https://grpc.io/docs/quickstart/" title="in the official gRPC documentation">}}.

For your convenience, we also provide pre-generated client stubs for some languages {{< externalLink href="https://github.com/dfuse-io/docs/tree/master/quickstarts" title="in the quickstarts folder of this docs GitHub repository">}}.

{{< tabs "get-client-stub">}}

{{< tab title="Go" lang="shell" >}}
git clone https://github.com/dfuse-io/docs
cd docs/quickstarts/go
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

## 4. Create the client

Now that you have generated the client stub (or picked the generated one), we can
now define the client creation code. The client can be re-used across all the
requests and streams you need to do, it should be properly cached at the appropriate
level for your use case.

{{< tabs "create-client" >}}
{{< tab-code title="Go" filename="./quickstarts/go/main.go" range=41:59 >}}
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
{{< tab-code title="Go" filename="./quickstarts/go/main.go" range=65:85 >}}
{{< tab-code title="Python" filename="./quickstarts/python/main.py" range=47:52 >}}
{{< /tabs >}}

And we can finally define the code needed to perform your first stream using
dfuse Search. The snippet initiate the connection with dfuse servers and start
streaming transfers forever.

{{< tabs "run-query">}}
{{< tab-code title="Go" filename="./quickstarts/go/main.go" range=87:120 >}}
{{< tab-code title="Python" filename="./quickstarts/python/main.py" range=54:68 >}}
{{< /tabs >}}

And here a sample of the prints you can see from the standard output after running the example:

<!-- **Note** We use python for all languages for a nicer output rendering -->
{{< code-block lang="python" >}}
Transfer 0xd7afbf5141a7f1d6b0473175f7a6b0a7954ed3d2 -> 0x43d2b8827218752ffe5a35cefc3bbe50ca79af47 [0.000497522732 Ether]
Transfer 0x43d2b8827218752ffe5a35cefc3bbe50ca79af47 -> 0xd7e2cfd68a66b0f085d6b011df17ce03230278b7 [0.001180743062 Ether]
Transfer 0x81c5cc877b61fa836bd3ffe83ab4659868183492 -> 0xb3199b592b4e6841839d1c83a0719d2f2a5db2a8 [0.19705971 Ether]
Transfer 0x3fee97826b2630d1fed97a35d4559937a5d183c3 -> 0xbea4e9f3a7752a5b44b13aaee4aaba2505cc60a6 [0.061404268 Ether]
Transfer 0x1c22fa9495d1d65df8e48d61d217732eb5b06b23 -> 0x298aca39f7bc65f9c7537c790b81968220bc1fc7 [0.00335537974 Ether]
...
{{< /code-block >}}

# 6. Full working examples

Here the small glue code containing the `main` function, imports and other helper functions to run the example:

{{< tabs "support-code">}}
{{< tab-code title="Go" filename="./quickstarts/go/main.go" range=1:19,182:201 >}}
{{< tab-code title="Python" filename="./quickstarts/python/main.py" range=1:15,96:104 >}}
{{< /tabs >}}

If you prefer, you can directly clone our ready-made repository with all the quick start
examples:

{{< tabs "full-working">}}

{{< tab title="Go" lang="shell" >}}
git clone https://github.com/dfuse-io/docs
cd docs/quickstarts/go

# Replace 'server_abcdef12345678900000000000' with your own API key!
DFUSE_API_KEY="server_abcdef12345678900000000000" go run main.go ethereum
{{< /tab >}}

{{< tab title="Python" lang="shell" >}}
git clone https://github.com/dfuse-io/docs
cd docs/quickstarts/python
python -m pip install grpcio-tools --ignore-installed

# Replace 'server_abcdef12345678900000000000' with your own API key!
DFUSE_API_KEY="server_abcdef12345678900000000000" python main.py ethereum
{{< /tab >}}
{{< /tabs >}}

# 6. What to do next ?

* [GraphQL API Reference]({{< ref "/reference/ethereum/graphql" >}})
* {{< externalLink href="https://mainnet.eth.dfuse.io/graphiql/?query=c3Vic2NyaXB0aW9uIHsKICBzZWFyY2hUcmFuc2FjdGlvbnMocXVlcnk6ICItdmFsdWU6MCB0eXBlOmNhbGwiLCBsb3dCbG9ja051bTogLTEpIHsKICAgIHVuZG8gY3Vyc29yCiAgICBub2RlIHsgaGFzaCBtYXRjaGluZ0NhbGxzIHsgY2FsbGVyIGFkZHJlc3MgdmFsdWUoZW5jb2Rpbmc6RVRIRVIpIH0gfQogIH0KfQ==" title="GraphiQL, online query editor with completion and docs">}}
* [Look at one of our tutorials]({{< ref "/guides/ethereum/tutorials" >}})
* [Authentication]({{< relref "/guides/core-concepts/authentication" >}})
* [Cursors]({{< relref "/guides/core-concepts/cursors" >}})
* [GraphQL]({{< relref "/guides/core-concepts/graphql" >}})
* [Search Features]({{< relref "/guides/core-concepts/search-features" >}})

