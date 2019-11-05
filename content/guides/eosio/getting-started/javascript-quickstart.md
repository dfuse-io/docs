---
weight: 1
---

# JavaScript Quickstart

In this guide we will show you how to create a basic setup so you can benefit from the dfuse GraphQL API under
on of supported JavaScript environment:

- Browser through a bundler like Webpack (includes Create React App projects) (`Bundler` code tab)
- Browser standalone (`Browser` code tab)
- Node.js server (`Node.js` code tab)

{{< note >}}
While not in the supported list (yet), you should in theory be able to use the example under a React Native environment.
{{< /note >}}

All examples uses ES6 syntax with `await/async` keywords, using `import` keywords on `Bundler` and `Browser`
environments while using the `require` syntax on Node.js environment. However,

{{< note >}}
The library compiles itself to down to ES5 features so we support older ES5 compliant browsers that are not compatible with ES6 features (IE 11 for example).
{{< /note >}}

We assume the commands below are performed in an empty project folder. To quickly
start an empty project:
{{< tabs "create-project-folder" >}}

{{< tab lang="shell" title="NPM" >}}
mkdir -p example-dfuse-javascript
cd example-dfuse-javascript
npm init -y
{{< /tab >}}

{{< tab lang="shell" title="Yarn" >}}
mkdir -p example-dfuse-javascript
cd example-dfuse-javascript
yarn init -y
{{< /tab >}}

{{< /tabs >}}

## 1. Get a dfuse API Key

* Create your account on {{< externalLink href="https://app.dfuse.io">}}
* Click "Create New Key" and give it a name, a category (and value of the "Origin" header in the case of a web key). See [Authentication]({{< relref "/guides/core-concepts/authentication" >}}) for details.

## 2. Adding the Client Library

The simplest way to get started with dfuse and JavaScript/TypeScript development is to use
the [dfuse JS client library](https://github.com/dfuse-io/client-js) (with TypeScript typings).

Here are a few of its key features:

* Handles API token issuance
* Refreshes your API token upon expiration
* Automatically reconnects if the connection closes
* Supports Browsers and Node.js environments

You can add it to your project using Yarn or NPM.

{{< tabs "install-npm" >}}
{{< tab lang="shell" title="NPM" >}}
npm install @dfuse/client
{{< /tab >}}
{{< tab lang="shell" title="Yarn" >}}
yarn add @dfuse/client
{{< /tab >}}
{{< /tabs >}}

#### Node.js Extra Steps

If you are targeting the Node.js environment, a few extra steps are required to be able to use
the @dfuse/client library. Indeed, the library relies on `node-fetch` package for HTTP requests
and on the `ws` package for `WebSocket` connection.

{{< tabs "install-dependencies" >}}
{{< tab lang="shell" title="NPM" >}}
npm install node-fetch ws
{{< /tab >}}
{{< tab lang="shell" title="Yarn" >}}
yarn add node-fetch ws
{{< /tab >}}
{{< /tabs >}}

Once installed, prior calling anything else, ensure that `global.fetch` and `global.WebSocket`
are set in the global scope.

{{< important >}}
This is required only in a Node.js environment. When targeting a Browser environment (in
standalone HTML or through a bundler, @dfuse/client library automatically uses `fetch`
and `WebSocket` objects provided by the browser).
{{< /important >}}

{{< tabs "configure-dependencies" >}}
{{< tab lang="javascript" title="Node.js" >}}
global.fetch = require('node-fetch')
global.WebSocket = require('ws')
{{< /tab >}}
{{< /tabs >}}

{{< note >}}
You prefer to not pollute the global scope? Check {{< externalLink title="Node.js Configuration Example" href="https://github.com/dfuse-io/client-js/blob/master/examples/advanced/nodejs-fetch-and-websocket-options.ts#L3">}} to see how you can pass the options directly when instantiating the client instead of polluting the global scope.
{{< /note >}}

## 3. Create the client

With the initial setup completed, you can start coding. The first thing we will do is initialize
the dfuse client using the API key you created in the first step and the network you want to
connect to.

Valid networks can be found at [EOSIO API Endpoints]({{< ref "reference/eosio/endpoints" >}})

{{< tabs "create-client" >}}
{{< tab-code title="Node.js" filename="./quickstarts/javascript/node.js/index.eosio.js" range=4:9 >}}
{{< tab-code title="Bundler" filename="./quickstarts/javascript/bundler/index.eosio.js" range=1:6 >}}
{{< tab-code title="Browser" filename="./quickstarts/javascript/browser/index.eosio.html" range=1:11 >}}
{{< /tabs >}}

## 4. Stream your first results

Let's first define the GraphQL operation, as a string, that we will use to perform
GraphQL subscription. This element tells the backend server what fields to return
to you, you get to choose and pick only what you are interested in.

{{< note >}}
Want to inspect the full set of available fields you can retrieve?

* [GraphQL API Reference]({{< ref "/reference/eosio/graphql" >}})
* {{< externalLink href="https://mainnet.eos.dfuse.io/graphiql/?query=c3Vic2NyaXB0aW9uIHsKICBzZWFyY2hUcmFuc2FjdGlvbnNGb3J3YXJkKHF1ZXJ5OiJyZWNlaXZlcjplb3Npby50b2tlbiBhY3Rpb246dHJhbnNmZXIgLWRhdGEucXVhbnRpdHk6JzAuMDAwMSBFT1MnIikgewogICAgdW5kbyBjdXJzb3IKICAgIHRyYWNlIHsgaWQgbWF0Y2hpbmdBY3Rpb25zIHsganNvbiB9IH0KICB9Cn0=" title="GraphiQL, online query editor with completion and docs">}}
{{< /note >}}

{{< tabs "define-query">}}
{{< tab-code title="Node.js" filename="./quickstarts/javascript/node.js/index.eosio.js" range=11:17 >}}
{{< tab-code title="Bundler" filename="./quickstarts/javascript/bundler/index.eosio.js" range=8:14 >}}
{{< tab-code title="Browser" filename="./quickstarts/javascript/browser/index.eosio.html" range=13:21 >}}
{{< /tabs >}}

Next, you create the GraphQL subscription to stream transfers as they come. You will use the `searchTransactionsForward` operation, with the `"receiver:eosio.token action:transfer -data.quantity:'0.0001 EOS'"` query (See the [Search Query Language reference here]({{< ref "/reference/eosio/search-terms" >}})). This basically means, give me all transactions containing one or more
action named `transfer` executed by `eosio.token` account for which the `quantity` field of the action is **not** `0.0001 EOS`.

You can combine the dfuse client instance we created in step 3 with the GraphQL document we defined above in
a `main` function:

{{< tabs "execute-query">}}
{{< tab-code title="Node.js" filename="./quickstarts/javascript/node.js/index.eosio.js" range=19:43 >}}
{{< tab-code title="Bundler" filename="./quickstarts/javascript/bundler/index.eosio.js" range=16:52 >}}
{{< tab-code title="Browser" filename="./quickstarts/javascript/browser/index.eosio.html" range=23:60 >}}
{{< /tabs >}}

The function passed as the 2nd parameter to `client.graphql()` will be called every time a new result is returned
by the API. And here a sample of the prints you can see from as a result of execution the streaming operation
above:

<!-- **Note** We use python for all languages for a nicer output rendering -->
{{< code-block lang="python" >}}
Transfer eosbetdice11 -> eosbetbank11 [0.0500 EOS]
Transfer newdexpublic -> gq4tcnrwhege [2.8604 EOS]
Transfer wpwpwp222222 -> eosioeosios3 [20.0000 EOS]
Transfer wallet.bg -> bulls.bg [0.9000 EOS]
Transfer bluebetproxy -> bluebetbulls [0.6000 EOS]
...
{{< /code-block >}}

# 6. Full Working Examples

Here the small glue code containing the `main` function, imports and other helper functions to run the example:

{{< tabs "support-code">}}
{{< tab-code title="Node.js" filename="./quickstarts/javascript/node.js/index.eosio.js" range=45:45 >}}
{{< tab-code title="Bundler" filename="./quickstarts/javascript/bundler/index.eosio.js" range=54:54 >}}
{{< tab-code title="Browser" filename="./quickstarts/javascript/browser/index.eosio.html" range=61:63 >}}
{{< /tabs >}}

{{< tabs "full-working">}}

{{< tab lang="shell" title="Node.js">}}
git clone https://github.com/dfuse-io/docs
cd docs/quickstarts/javascript/node.js
npm install

# Replace 'server_abcdef12345678900000000000' with your own API key!
DFUSE_API_KEY=server_abcdef12345678900000000000 node index.eosio.js
{{< /tab >}}

{{< tab lang="shell" title="Bundler">}}
git clone https://github.com/dfuse-io/docs
cd docs/quickstarts/javascript/bundler
npm install

# Replace 'web_abcdef12345678900000000000' with your own API key!
DFUSE_API_KEY=web_abcdef12345678900000000000 npm run build:eosio

# Open `index.eosio.html` directly in your favorite Browser
open index.eosio.html       # Mac
xdg-open index.eosio.html   # Ubuntu
start index.eosio.thml      # Windows
{{< /tab >}}

{{< tab lang="shell" title="Browser">}}
git clone https://github.com/dfuse-io/docs
cd docs/quickstarts/javascript/browser
# Manually edit index.eosio.html changing `web_abcdef12345678900000000000` with your own API key

# Open `index.eosio.html` directly in your favorite Browser
open index.eosio.html       # Mac
xdg-open index.eosio.html   # Ubuntu
start index.eosio.thml      # Windows
{{< /tab >}}

{{< /tabs >}}

# 7. What to do next ?

* [GraphQL API Reference]({{< ref "/reference/eosio/graphql" >}})
* [REST API Reference]({{< ref "/reference/eosio/rest" >}})
* [WebSocket API Reference]({{< ref "/reference/eosio/websocket" >}})
* [Check dfuse Core Concepts]({{< ref "/guides/core-concepts" >}})
* [Look at one of our tutorials]({{< ref "/guides/eosio/tutorials" >}})
* {{< externalLink title="The `@dfuse/client-js` overview document" href="https://github.com/dfuse-io/client-js/blob/master/README.md#dfuse-javascripttypescript-client-library" >}}
* {{< externalLink title="The `@dfuse/client-js` quick API reference" href="https://github.com/dfuse-io/client-js/blob/master/README.md#api" >}} ({{< externalLink title="Full API reference" href="https://dfuse-io.github.io/client-js/" >}})
* {{< externalLink title="GraphiQL, online query editor with completion and docs" href="https://mainnet.eos.dfuse.io/graphiql/?query=c3Vic2NyaXB0aW9uIHsKICBzZWFyY2hUcmFuc2FjdGlvbnNGb3J3YXJkKHF1ZXJ5OiJyZWNlaXZlcjplb3Npby50b2tlbiBhY3Rpb246dHJhbnNmZXIgLWRhdGEucXVhbnRpdHk6JzAuMDAwMSBFT1MnIikgewogICAgdW5kbyBjdXJzb3IKICAgIHRyYWNlIHsgaWQgbWF0Y2hpbmdBY3Rpb25zIHsganNvbiB9IH0KICB9Cn0=" >}}
