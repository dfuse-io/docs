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
{{< tab lang="javascript" title="Node.js" opts="linenos=table">}}
global.fetch = require('node-fetch')
global.WebSocket = require('ws')
{{< /tab >}}
{{< /tabs >}}

## 3. Initializing the dfuse Client using your API key

With the initial setup completed, you can start coding. The first thing we will do is initialize
the dfuse client using the API key you created in the first step and the network you want to
connect to.

Replace `web_abcdef12345678900000000000` by the API key you retrieved at step 1. Valid
networks can be found at [Ethereum API Endpoint]({{< ref "reference/ethereum/endpoints" >}})

{{< tabs "getting-started-js-3" >}}
{{< tab lang="javascript" title="Node.js" opts="linenos=table">}}
const { createDfuseClient } = require("@dfuse/client")

const client = createDfuseClient({
  apiKey: 'web_abcdef12345678900000000000',
  network: 'mainnet.eth.dfuse.io'
})
{{< /tab >}}

{{< tab lang="javascript" title="Bundler" opts="linenos=table">}}
import { createDfuseClient } from "@dfuse/client"

const client = createDfuseClient({
  apiKey: 'web_abcdef12345678900000000000',
  network: 'mainnet.eth.dfuse.io'
})
{{< /tab >}}

{{< tab lang="html" title="Browser" opts="linenos=table">}}
<head>
  <style> li { font-family: monospace; margin: 0.15; }</style>
  <script src="https://unpkg.com/@dfuse/client"></script>
  <script>
    const client = createDfuseClient({
      apiKey: 'web_abcdef12345678900000000000',
      network: 'mainnet.eth.dfuse.io'
    })
  </script>
</head>
{{< /tab >}}

{{< /tabs >}}

## 4. Crafting your GraphQL Query

Next, we you create our GraphQL query. Here, you will use a GraphQL subscription to stream results as they come. You will use the `searchTransactionsForward` operation, with the `"receiver:eosio.token action:transfer"` query (See the [Search Query Language reference here]({{< ref "/reference/eosio/search-terms" >}})).

{{< tabs "getting-started-js-4" >}}
{{< tab lang="javascript" title="Node.js" opts="linenos=table,linenostart=7">}}
async function main() {
  // You must use a `$cursor` variable so stream starts back at last marked cursor on reconnect
  const operation = `subscription($cursor: String!) {
    searchTransactions(query:"-value:0 type:call", lowBlockNum: -1, cursor: $cursor) {
      undo cursor
      node {
        hash matchingCalls { caller address value(encoding:ETHER) }
      }
    }
  }`
}

main().catch((error) => console.log("Unexpected error", error))
{{< /tab >}}

{{< tab lang="javascript" title="Bundler" opts="linenos=table,linenostart=7">}}
// You would normally use your framework entry point and render using components,
// we are using pure HTML manipulation for sake of example simplicity.

async function main() {
  // You must use a `$cursor` variable so stream starts back at last marked cursor on reconnect
  const operation = `subscription($cursor: String!) {
    searchTransactions(query:"-value:0 type:call", lowBlockNum: -1, cursor: $cursor) {
      undo cursor
      node {
        hash matchingCalls { caller address value(encoding:ETHER) }
      }
    }
  }`
}

main().catch((error) => document.body.innerHTML = `<p>${error}</p>`)
{{< /tab >}}

{{< tab lang="html" title="Browser" opts="linenos=table,linenostart=7">}}
<body>
<script>
async function main() {
  // You must use a `$cursor` variable so stream starts back at last marked cursor on reconnect
  const query = `subscription($cursor: String!) {
    searchTransactions(query:"-value:0 type:call", lowBlockNum: -1, cursor: $cursor) {
      undo cursor
      node {
        hash matchingCalls { caller address value(encoding:ETHER) }
      }
    }
  }`
}

main().catch((error) => document.body.innerHTML = `<p>${error}</p>`)
</script>
</body>
{{< /tab >}}
{{< /tabs >}}

## 5. Executing our Query

Finally, you can combine the dfuse client instance we created in step 3 with the GraphQL query you created in step 4 to start streaming the results of our query,
simply launch the wrapping function

The function passed as the 2nd parameter to `client.graphql()` will be called every time a new result is returned by the API.

{{< tabs "getting-started-js-5" >}}
{{< tab lang="javascript" title="Node.js" opts="linenos=table,linenostart=19">}}
  // Goes inside `main` function
  const stream = await client.graphql(operation, (message) => {
    if (message.type === "data") {
      const { undo, cursor, node: { hash, value, matchingCalls }} = message.data.searchTransactions
      matchingCalls.forEach(({ caller, address, value }) => {
        // Ensure you correctly with the `undo` field
        console.log(`Transfer ${caller} -> ${address} [${value} Ether]${undo ? " REVERTED" : ""}`)
      })

      // Mark stream at cursor location, on re-connect, we will start back at cursor
      stream.mark({ cursor })
    }

    if (message.type === "error") {
      console.log("An error occurred", message.errors, message.terminal)
    }

    if (message.type === "complete") {
      console.log("Completed")
    }
  })

  // Waits until the stream completes, or forever
  await stream.join()
  await client.release()
{{< /tab >}}

{{< tab lang="javascript" title="Bundler" opts="linenos=table,linenostart=19">}}
  // Goes inside `main` function
  const stream = await client.graphql(operation, (message) => {
    if (message.type === "data") {
      const { undo, cursor, node: { hash, value, matchingCalls }} = message.data.searchTransactions
      matchingCalls.forEach(({ caller, address, value }) => {
        const paragraphNode = document.createElement("li")
        // Ensure you correctly with the `undo` field
        paragraphNode.innerText = `Transfer ${caller} -> ${address} [${value} Ether]${undo ? " REVERTED" : ""}`

        document.body.prepend(paragraphNode)
      })

      // Mark stream at cursor location, on re-connect, we will start back at cursor
      stream.mark({ cursor })
    }

    if (message.type === "error") {
      const { errors, terminal } = message
      const paragraphNode = document.createElement("li")
      paragraphNode.innerText = `An error occurred ${JSON.stringify({ errors, terminal })}`

      document.body.prepend(paragraphNode)
    }

    if (message.type === "complete") {
        const paragraphNode = document.createElement("li")
        paragraphNode.innerText = "Completed"

        document.body.prepend(paragraphNode)
    }
  })

  // Waits until the stream completes, or forever
  await stream.join()
  await client.release()
{{< /tab >}}

{{< tab lang="javascript" title="Browser" opts="linenos=table,linenostart=19">}}
  // Goes inside `main` function
  const stream = await client.graphql(operation, (message) => {
    if (message.type === "data") {
      const { undo, cursor, node: { hash, value, matchingCalls }} = message.data.searchTransactions
      matchingCalls.forEach(({ caller, address, value }) => {
        const paragraphNode = document.createElement("li")
        // Ensure you correctly with the `undo` field
        paragraphNode.innerText = `Transfer ${caller} -> ${address} [${value} Ether]${undo ? " REVERTED" : ""}`

        document.body.prepend(paragraphNode)
      })

      // Mark stream at cursor location, on re-connect, we will start back at cursor
      stream.mark({ cursor })
    }

    if (message.type === "error") {
      const { errors, terminal } = message
      const paragraphNode = document.createElement("li")
      paragraphNode.innerText = `An error occurred ${JSON.stringify({ errors, terminal })}`

      document.body.prepend(paragraphNode)
    }

    if (message.type === "complete") {
        const paragraphNode = document.createElement("li")
        paragraphNode.innerText = "Completed"

        document.body.prepend(paragraphNode)
    }
  })

  // Waits until the stream completes, or forever
  await stream.join()
  await client.release()
{{< /tab >}}
{{< /tabs >}}

# 6. Full Working Examples

{{< tabs "full-working">}}
{{< tab lang="shell" title="Node.js" opts="linenos=table">}}
git clone https://github.com/dfuse-io/quickstart-tutorials
cd quickstart-tutorials/javascript/node.js
npm install

export DFUSE_API_KEY=web_abcdef12345678900000000000
node index.ethereum.js
{{< /tab >}}

{{< tab lang="shell" title="Bundler" opts="linenos=table">}}
git clone https://github.com/dfuse-io/quickstart-tutorials
cd quickstart-tutorials/javascript/bundler
npm install

export DFUSE_API_KEY=web_abcdef12345678900000000000
npm run build:ethereum

# Open `index.ethereum.html` directly in your favorite Browser
open index.ethereum.html       # Mac
xdg-open index.ethereum.html   # Ubuntu
start index.ethereum.thml      # Windows
{{< /tab >}}

{{< tab lang="shell" title="Browser" opts="linenos=table">}}
git clone https://github.com/dfuse-io/quickstart-tutorials
cd quickstart-tutorials/javascript/browser
# Manually edit index.ethereum.html changing `web_abcdef12345678900000000000` with your own API key

# Open `index.ethereum.html` directly in your favorite Browser
open index.ethereum.html       # Mac
xdg-open index.ethereum.html   # Ubuntu
start index.ethereum.thml      # Windows
{{< /tab >}}
{{< /tabs >}}

