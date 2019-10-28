---
weight: 2
title: "Javascript Quickstart"
---

# Javascript Quickstart

In this guide we will show you how to create a basic setup so that you can benefit from the dfuse GraphQL API with Javascript.

## 1. Getting an API Key

Start by obtaining an API key. You can get one [here](https://app.dfuse.io).

## 2. Adding the Client Library

The simplest way to query the dfuse GraphQL API is by using the [dfuse JS client library](https://github.com/dfuse-io/client-js).

Here are a few of its key features:

* Handles API token issuance
* Refreshes your API token upon expiration
* Automatically reconnects if the connection closes

You can add it to your project using Yarn or NPM.

{{< tabs "install-npm" >}}
{{< tab lang="shell" title="NPM" >}}
npm install @dfuse/client
{{< /tab >}}
{{< tab lang="shell" title="Yarn" >}}
yarn add @dfuse/client
{{< /tab >}}
{{< /tabs >}}

## 3. Initializing the dfuse Client

With the initial setup completed, you can start coding. The first thing we will do is initialize the dfuse client, using the API key you created in the first step and you'll now specify the [Ethereum API Endpoint]({{< ref "reference/ethereum/endpoints" >}}) or [EOSIO API Endpoint]({{< ref "reference/ethereum/endpoints" >}}) you want to connect to.

{{< tabs "getting-started-js-3" >}}
{{< tab lang="javascript" title="main.js" opts="linenos=table">}}
const { createDfuseClient } = require("@dfuse/client")

const client = createDfuseClient({
  apiKey: 'web_abcdef12345678900000000000', // Your API key goes here
  network: 'mainnet.eth.dfuse.io' // Specify the API endpoint you want to connect to here
})
{{< /tab >}}
{{< /tabs >}}

## 4. Crafting our GraphQL Query

Next, we you create our GraphQL query. Here, you will use a GraphQL subscription to stream results as they come. You will use the `searchTransactionsForward` operation, with the `"receiver:eosio.token action:transfer"` query (See the [Search Query Language reference here]({{< ref "/reference/eosio/search" >}})).

{{< tabs "getting-started-js-4" >}}
{{< tab lang="javascript" title="main.js" opts="linenos=table,linenostart=7">}}
const query = `
  subscription {
    searchTransactionsForward(query: "receiver:eosio.token action:transfer") {
      cursor
      trace {
        matchingActions {
          json
        }
      }
    }
  }
`
{{< /tab >}}
{{< /tabs >}}

## 5. Executing our Query

Finally, you can combine the dfuse client instance we created in step 3 with the GraphQL query you created in step 4 to start streaming the results of our query.

The function passed as the 2nd parameter to `client.graphql()` will be called every time a new result is returned by the API.

{{< tabs "getting-started-js-5" >}}
{{< tab lang="javascript" title="main.js" opts="linenos=table,linenostart=19">}}
client.graphql(query, (message) => {
  if (message.type === "data") {
    console.log(message.data);
  }
})
{{< /tab >}}
{{< /tabs >}}

<!-- Hiding these links for now, because they are all specific to EOSIO -->
<!-- ## Useful Links

- GitHub: [@dfuse/client](https://github.com/dfuse-io/client-js) -->
<!-- - Docs: [dfuse Search query language](#dfuse-query-language) -->
<!-- - On mainnet: [GraphiQL](https://mainnet.eos.dfuse.io/graphiql/) A graphic graphql editor and API documentation browser. -->
<!-- - GitHub: [Stream action rates example](https://github.com/dfuse-io/example-stream-action-rates) This example demonstrates how to use the dfuse GraphQL APIs in a React application to livestream the average rates from the top actions. A live demo is available [here](http://labs.dfuse.io/livesearch-example/) -->
