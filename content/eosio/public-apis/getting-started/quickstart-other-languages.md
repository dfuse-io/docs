---
weight: 40
title: "Quick Start: Other Languages"
aliases:
  - /guides/eosio/getting-started/other-languages/
---

dfuse exposes its data through a GraphQL-over-gRPC interface. The protobuf files are {{< external-link href="https://github.com/dfuse-io/graphql-over-grpc" title="in this GitHub repository">}}.

The code from the examples on this page can be found {{< external-link href="https://github.com/dfuse-io/docs/tree/master/quickstarts" title="in the quickstarts folder of this docs GitHub repository">}}.

## 1. Get a dfuse API Key

{{< dfuse-account-creation >}}

## 2. Generate a JWT from your API key

The JWT is a token with a short expiration period, used to communicate with dfuse services. You will have to implement token caching and manage renewal upon expiration. See [Authentication]({{< relref "/platform/dfuse-cloud/authentication" >}}) for more details.

{{< tabs "generate-jwt">}}
{{< tab title="Go" lang="go">}}
{{< code-section "quickstarts_go_eos_section2" >}}
{{< /tab >}}
{{< tab title="Python" lang="python">}}
{{< code-section "quickstarts_python_eos_section2" >}}
{{< /tab >}}
{{< tab title="Shell" lang="shell" >}}
curl https://auth.dfuse.io/v1/auth/issue -s \
  --data-binary '{"api_key":"server_abcdef12345678900000000000"}'
{{< /tab >}}
{{< /tabs >}}

## 3. Get the client stub and dependencies for your language

The protobuf files defining our GraphQL-over-gRPC interface are available {{< external-link href="https://github.com/dfuse-io/graphql-over-grpc" title="in this GitHub repository">}}.

A lot of languages provide tools to generate client stubs from protobuf files, as you can find {{< external-link href="https://grpc.io/docs/quickstart/" title="in the official gRPC documentation">}}.

For your convenience, we also provide pre-generated client stubs for some languages. The code from the examples on this page can be found {{< external-link href="https://github.com/dfuse-io/docs/tree/master/quickstarts" title="in the quickstarts folder of this docs GitHub repository">}}.

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
define the client creation code. The client can be re-used across all of the
requests and streams you need to do, it should be properly cached at the appropriate
level for your use case.

{{< tabs "create-client" >}}
{{< tab title="Go" lang="go">}}
{{< code-section "quickstarts_go_eos_section3" >}}
{{< /tab >}}
{{< tab title="Python" lang="python">}}
{{< code-section "quickstarts_python_eos_section3" >}}
{{< /tab >}}
{{< /tabs >}}

## 5. Stream your first results

Let's first define the GraphQL operation, as a string, that we will use to open a
GraphQL subscription. This element tells the backend server which fields to return
to you, as you get to pick and choose only what you are interested in.

{{< alert type="note" >}}
Want to inspect the full set of available fields you can retrieve?

* [GraphQL API Reference]({{< ref "/eosio/public-apis/reference/graphql-api" >}})
* {{< external-link href="https://testnet.eos.dfuse.io/graphiql/?query=c3Vic2NyaXB0aW9uIHsKICBzZWFyY2hUcmFuc2FjdGlvbnNGb3J3YXJkKHF1ZXJ5OiJyZWNlaXZlcjplb3Npby50b2tlbiBhY3Rpb246dHJhbnNmZXIgLWRhdGEucXVhbnRpdHk6JzAuMDAwMSBFT1MnIikgewogICAgdW5kbyBjdXJzb3IKICAgIHRyYWNlIHsgaWQgbWF0Y2hpbmdBY3Rpb25zIHsganNvbiB9IH0KICB9Cn0=" title="GraphiQL, online query editor with completion and docs">}}
{{< /alert >}}

{{< tabs "define-query">}}
{{< tab title="Go" lang="go">}}
{{< code-section "quickstarts_go_eos_section4" >}}
{{< /tab >}}
{{< tab title="Python" lang="python">}}
{{< code-section "quickstarts_python_eos_section4" >}}
{{< /tab >}}
{{< /tabs >}}

And we can finally define the code needed to perform your first stream using
dfuse Search. This snippet initiates the connection with dfuse servers and starts
streaming transfers forever.

{{< tabs "run-query">}}
{{< tab title="Go" lang="go">}}
{{< code-section "quickstarts_go_eos_section5" >}}
{{< /tab >}}
{{< tab title="Python" lang="python">}}
{{< code-section "quickstarts_python_eos_section5" >}}
{{< /tab >}}
{{< /tabs >}}

And here is a sample of the prints you will receive from the standard output after running the example above:

<!-- **Note** We use python for all languages for a nicer output rendering -->
{{< highlight "python" >}}
Transfer eosbetdice11 -> eosbetbank11 [0.0500 EOS]
Transfer newdexpublic -> gq4tcnrwhege [2.8604 EOS]
Transfer wpwpwp222222 -> eosioeosios3 [20.0000 EOS]
Transfer wallet.bg -> bulls.bg [0.9000 EOS]
Transfer bluebetproxy -> bluebetbulls [0.6000 EOS]
...
{{< /highlight >}}

## 6. Full working examples

Here is the small glue code containing the `main` function, imports and other helper functions to run the example:

{{< tabs "support-code">}}
{{< tab title="Go" lang="go">}}
{{< code-section "quickstarts_go_eos_section1" >}}
{{< code-section "quickstarts_go_eos_section6" >}}
{{< /tab >}}
{{< tab title="Python" lang="python">}}
{{< code-section "quickstarts_python_eos_section1" >}}
{{< code-section "quickstarts_python_eos_section6" >}}
{{< /tab >}}
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

### API References

- [GraphQL API]({{< ref "/eosio/public-apis/reference/graphql-api" >}})
- [REST API]({{< ref "/eosio/public-apis/reference/rest" >}})
- [WebSocket API]({{< ref "/eosio/public-apis/reference/websocket" >}})

### Other
- [Try one of our tutorials]({{< ref "/eosio/public-apis/tutorials" >}})
- {{< external-link title="The `@dfuse/client-js` overview document" href="https://github.com/dfuse-io/client-js/blob/master/README.md#dfuse-javascripttypescript-client-library" >}}
- {{< external-link title="The `@dfuse/client-js` quick API reference" href="https://github.com/dfuse-io/client-js/blob/master/README.md#api" >}} ({{< external-link title="Full API reference" href="https://dfuse-io.github.io/client-js/" >}})
- {{< external-link title="GraphiQL, online query editor with completion and docs" href="https://mainnet.eos.dfuse.io/graphiql/?query=c3Vic2NyaXB0aW9uIHsKICBzZWFyY2hUcmFuc2FjdGlvbnNGb3J3YXJkKHF1ZXJ5OiJyZWNlaXZlcjplb3Npby50b2tlbiBhY3Rpb246dHJhbnNmZXIgLWRhdGEucXVhbnRpdHk6JzAuMDAwMSBFT1MnIikgewogICAgdW5kbyBjdXJzb3IKICAgIHRyYWNlIHsgaWQgbWF0Y2hpbmdBY3Rpb25zIHsganNvbiB9IH0KICB9Cn0=" >}}
