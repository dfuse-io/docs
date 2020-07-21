---
weight: 20

pageTitle: "Quick Start: Other Languages"
pageTitleIcon: eth

sideNav: true
sideNavTitle: Public APIs
sideNavLinkRename: "Quick Start: Other Languages"

BookToC: true
#release: stable

aliases:
  - /guides/ethereum/getting-started/other-languages/

---

The code from the examples on this page lives {{< external-link href="https://github.com/dfuse-io/docs/tree/master/quickstarts" title="in the quickstarts folder of this docs GitHub repository">}}.

## 1. Get a dfuse API Key

{{< dfuse-account-creation >}}

## Initiate your project
### Generate the client stub and dependencies for your language

dfuse exposes its data through a GraphQL over gRPC interface. The protobuf files are {{< external-link href="https://github.com/dfuse-io/graphql-over-grpc" title="in this GitHub repository">}}.

A lot of languages provide tools to generate client stubs from protobuf files, as you can find {{< external-link href="https://grpc.io/docs/quickstart/" title="in the official gRPC documentation">}}.

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
  {{< tab title="Go" lang="go">}}
    {{< code-section "quickstarts_go_ethereum_section1" >}}
  {{< /tab >}}6
  {{< tab title="Python" lang="python">}}
    {{< code-section "quickstarts_python_ethereum_section1" >}}
    #
    # Code from getting started will go here ...
    #
    {{< code-section "quickstarts_python_ethereum_section6" >}}
  {{< /tab >}}
{{< /tabs >}}

The code from the examples on this page lives {{< external-link href="https://github.com/dfuse-io/docs/tree/master/quickstarts" title="in the quickstarts folder of this docs GitHub repository">}}.

## Generate a JWT from your API key

The JWT is a token with a short expiration period, used to communicate with dfuse services. You will have to implement token caching and manage renewal upon expiration. See [Authentication]({{< relref "/notions/dfuse-cloud/authentication" >}}) for details.

{{< tabs "generate-jwt">}}
  {{< tab title="Go" lang="go">}}
    {{< code-section "quickstarts_go_ethereum_section2" >}}
  {{< /tab >}}
  {{< tab title="Python" lang="python">}}
    {{< code-section "quickstarts_python_ethereum_section2" >}}
  {{< /tab >}}
{{< tab title="Shell" lang="shell" >}}
curl https://auth.dfuse.io/v1/auth/issue -s \
  --data-binary '{"api_key":"server_abcdef12345678900000000000"}'
{{< /tab >}}
{{< /tabs >}}


## Create the client

We can now define the client creation code. The client can be re-used across all the requests and streams you need to do, it should be properly cached at the appropriate level for your use case.

{{< tabs "create-client" >}}
  {{< tab title="Go" lang="go">}}
    {{< code-section "quickstarts_go_ethereum_section3" >}}
  {{< /tab >}}
  {{< tab title="Python" lang="python">}}
    {{< code-section "quickstarts_python_ethereum_section3" >}}
  {{< /tab >}}
{{< /tabs >}}

## Stream your first results

Let's first define the GraphQL operation, as a string, that we will use to perform
GraphQL subscription. This element tells the backend server what fields to return
to you, you get to choose and pick only what you are interested in.

{{< alert type="note" >}}
Want to inspect the full set of available fields you can retrieve?

* [GraphQL API Reference]({{< ref "/ethereum/public-apis/reference/graphql-api" >}})
* {{< external-link href="https://mainnet.eth.dfuse.io/graphiql/?query=c3Vic2NyaXB0aW9uIHsKICBzZWFyY2hUcmFuc2FjdGlvbnMocXVlcnk6ICItdmFsdWU6MCB0eXBlOmNhbGwiLCBsb3dCbG9ja051bTogLTEpIHsKICAgIHVuZG8gY3Vyc29yCiAgICBub2RlIHsgaGFzaCBtYXRjaGluZ0NhbGxzIHsgY2FsbGVyIGFkZHJlc3MgdmFsdWUoZW5jb2Rpbmc6RVRIRVIpIH0gfQogIH0KfQ==" title="GraphiQL, online query editor with completion and docs">}}
{{< /alert >}}

{{< tabs "define-query">}}
  {{< tab title="Go" lang="go">}}
    {{< code-section "quickstarts_go_ethereum_section4" >}}
  {{< /tab >}}
  {{< tab title="Python" lang="python">}}
    {{< code-section "quickstarts_python_ethereum_section4" >}}
  {{< /tab >}}
{{< /tabs >}}

And we can finally define the code needed to perform your first stream using
dfuse Search. The snippet initiate the connection with dfuse servers and start
streaming transfers forever.

{{< tabs "run-query">}}
  {{< tab title="Go" lang="go">}}
    {{< code-section "quickstarts_go_ethereum_section5" >}}
  {{< /tab >}}
  {{< tab title="Python" lang="python">}}
    {{< code-section "quickstarts_python_ethereum_section5" >}}
  {{< /tab >}}
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


## What's next?

### API References

- [GraphQL API]({{< ref "/ethereum/public-apis/reference/graphql-api" >}})

### Other
- [Try one of our tutorials]({{< ref "/ethereum/public-apis/tutorials" >}})
- {{< external-link title="The `@dfuse/client-js` overview document" href="https://github.com/dfuse-io/client-js/blob/master/README.md#dfuse-javascripttypescript-client-library" >}}
- {{< external-link title="The `@dfuse/client-js` quick API reference" href="https://github.com/dfuse-io/client-js/blob/master/README.md#api" >}} ({{< external-link title="Full API reference" href="https://dfuse-io.github.io/client-js/" >}})
- {{< external-link href="https://mainnet.eth.dfuse.io/graphiql/?query=c3Vic2NyaXB0aW9uIHsKICBzZWFyY2hUcmFuc2FjdGlvbnMocXVlcnk6ICItdmFsdWU6MCB0eXBlOmNhbGwiLCBsb3dCbG9ja051bTogLTEpIHsKICAgIHVuZG8gY3Vyc29yCiAgICBub2RlIHsgaGFzaCBtYXRjaGluZ0NhbGxzIHsgY2FsbGVyIGFkZHJlc3MgdmFsdWUoZW5jb2Rpbmc6RVRIRVIpIH0gfQogIH0KfQ==" title="GraphiQL, online query editor with completion and docs" >}}
