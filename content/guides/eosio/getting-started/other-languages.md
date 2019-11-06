---
weight: 20
---

{{< row-wrapper >}}
{{< sub-section-title title="Getting Started with Other Languages" protocol="EOS" >}}

dfuse exposes its data through a GraphQL over gRPC interface. The protobuf files are {{< externalLink href="https://github.com/dfuse-io/graphql-over-grpc" title="in this github repository">}}.

The code from the examples on this page lives {{< externalLink href="https://github.com/dfuse-io/docs/tree/master/quickstarts" title="in the quickstarts folder of this docs GitHub repository">}}.

## 1. Get a dfuse API Key

{{< dfuse-account-creation >}}

## 2. Generate a JWT from your API key

The JWT is a token with a short expiration period, used to communicate with dfuse services. You will have to implement token caching and manage renewal upon expiration. See [Authentication]({{< relref "/guides/core-concepts/authentication" >}}) for details.

{{< tabs "generate-jwt">}}
{{< tab-code title="Go" filename="./quickstarts/go/main-eos.go" range="21:39" >}}
{{< tab-code title="Python" filename="./quickstarts/python/main.py" range="17:28" >}}
{{< tab title="Shell" lang="shell" >}}
curl https://auth.dfuse.io/v1/auth/issue -s \
  --data-binary '{"api_key":"server_abcdef12345678900000000000"}'
{{< /tab >}}
{{< /tabs >}}

## 3. Get the client stub and dependencies for your language

The protobuf files defining our graphql-over-grpc interface are available {{< externalLink href="https://github.com/dfuse-io/graphql-over-grpc" title="in this GitHub repository">}}.

A lot of languages provide tools to generate client stubs from protobuf files, as you can find {{< externalLink href="https://grpc.io/docs/quickstart/" title="in the official gRPC documentation">}}.

For your convenience, we also provide pre-generated client stubs for some languages The code from the examples on this page lives {{< externalLink href="https://github.com/dfuse-io/docs/tree/master/quickstarts" title="in the quickstarts folder of this docs GitHub repository">}}.

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
{{< tab-code title="Go" filename="./quickstarts/go/main-eos.go" range="41:59" >}}
{{< tab-code title="Python" filename="./quickstarts/python/main.py" range="30:41" >}}
{{< /tabs >}}

## 5. Stream your first results

Let's first define the GraphQL operation, as a string, that we will use to perform
GraphQL subscription. This element tells the backend server what fields to return
to you, you get to choose and pick only what you are interested in.

{{< note >}}
Want to inspect the full set of available fields you can retrieve?

* [GraphQL API Reference]({{< ref "/reference/eosio/graphql" >}})
* {{< externalLink href="https://mainnet.eos.dfuse.io/graphiql/?query=c3Vic2NyaXB0aW9uIHsKICBzZWFyY2hUcmFuc2FjdGlvbnNGb3J3YXJkKHF1ZXJ5OiJyZWNlaXZlcjplb3Npby50b2tlbiBhY3Rpb246dHJhbnNmZXIgLWRhdGEucXVhbnRpdHk6JzAuMDAwMSBFT1MnIikgewogICAgdW5kbyBjdXJzb3IKICAgIHRyYWNlIHsgaWQgbWF0Y2hpbmdBY3Rpb25zIHsganNvbiB9IH0KICB9Cn0=" title="GraphiQL, online query editor with completion and docs">}}
{{< /note >}}

{{< tabs "define-query">}}
{{< tab-code title="Go" filename="./quickstarts/go/main-eos.go" range="126:144" >}}
{{< tab-code title="Python" filename="./quickstarts/python/main.py" range="73:78" >}}
{{< /tabs >}}

And we can finally define the code needed to perform your first stream using
dfuse Search. The snippet initiate the connection with dfuse servers and start
streaming transfers forever.

{{< tabs "run-query">}}
{{< tab-code title="Go" filename="./quickstarts/go/main-eos.go" range="146:180" >}}
{{< tab-code title="Python" filename="./quickstarts/python/main.py" range="80:94" >}}
{{< /tabs >}}

And here a sample of the prints you can see from the standard output after running the example:

<!-- **Note** We use python for all languages for a nicer output rendering -->
{{< code-block lang="python" >}}
Transfer eosbetdice11 -> eosbetbank11 [0.0500 EOS]
Transfer newdexpublic -> gq4tcnrwhege [2.8604 EOS]
Transfer wpwpwp222222 -> eosioeosios3 [20.0000 EOS]
Transfer wallet.bg -> bulls.bg [0.9000 EOS]
Transfer bluebetproxy -> bluebetbulls [0.6000 EOS]
...
{{< /code-block >}}

## 6. Full working examples

Here the small glue code containing the `main` function, imports and other helper functions to run the example:

{{< tabs "support-code">}}
{{< tab-code title="Go" filename="./quickstarts/go/main-eos.go" range="1:19,182:201" >}}
{{< tab-code title="Python" filename="./quickstarts/python/main.py" range="1:15,96:104" >}}
{{< /tabs >}}

If you prefer, you can directly clone our ready-made repository with all the quick start
examples:

{{< tabs "full-working">}}

{{< tab title="Go" lang="shell" >}}
git clone https://github.com/dfuse-io/docs
cd docs/quickstarts/go

# Replace 'server_abcdef12345678900000000000' with your own API key!
DFUSE_API_KEY="server_abcdef12345678900000000000" go run main.go eosio
{{< /tab >}}

{{< tab title="Python" lang="shell" >}}
git clone https://github.com/dfuse-io/docs
cd docs/quickstarts/python
python -m pip install grpcio-tools --ignore-installed

# Replace 'server_abcdef12345678900000000000' with your own API key!
DFUSE_API_KEY="server_abcdef12345678900000000000" python main.py eosio
{{< /tab >}}
{{< /tabs >}}

## 7. What's next?

* [GraphQL API Reference]({{< ref "/reference/eosio/graphql" >}})
* {{< externalLink href="https://mainnet.eos.dfuse.io/graphiql/?query=c3Vic2NyaXB0aW9uIHsKICBzZWFyY2hUcmFuc2FjdGlvbnNGb3J3YXJkKHF1ZXJ5OiJyZWNlaXZlcjplb3Npby50b2tlbiBhY3Rpb246dHJhbnNmZXIgLWRhdGEucXVhbnRpdHk6JzAuMDAwMSBFT1MnIikgewogICAgdW5kbyBjdXJzb3IKICAgIHRyYWNlIHsgaWQgbWF0Y2hpbmdBY3Rpb25zIHsganNvbiB9IH0KICB9Cn0=" title="GraphiQL, online query editor with completion and docs">}}
* [Look at one of our tutorials]({{< ref "/guides/eosio/tutorials" >}})
* [Authentication]({{< relref "/guides/core-concepts/authentication" >}})
* [Cursors]({{< relref "/guides/core-concepts/cursors" >}})
* [GraphQL]({{< relref "/guides/core-concepts/graphql" >}})
* [Search Query Language]({{< relref "/guides/core-concepts/search-query-language" >}})

{{< row-wrapper-end >}}
