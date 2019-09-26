---
weight: 1
---

# Getting Started with Javascript

This simple program demonstrates how easy it is to query our GraphQL API. Here is an overview of what it does.

1. Uses our [client-js library](https://github.com/dfuse-io/client-js) to handle API token management
1. Executes a simple GraphQL streaming search subscription
1. Prints out each message received

{{< tabs "getting-started-js" >}}
{{< tab lang="javascript" >}}
const { createDfuseClient } = require("@dfuse/client")

const client = createDfuseClient({
  apiKey: DFUSE_API_KEY,
  network: DFUSE_API_NETWORK
})

const stream = await client.graphql(`
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
`, (message) => {
  if (message.type === "data") {
    console.log(message.data);
  }
})
{{< /tab >}}
{{< /tabs >}}

## Running the Example

First of all, visit [https://app.dfuse.io](https://app.dfuse.io) to get `YOUR_API_KEY`.

{{< tabs "running-js-example" >}}
{{< tab lang="shell" >}}
git clone https://github.com/dfuse-io/example-graphql-apollo.git
cd example-graphql-apollo
yarn install
DFUSE_API_KEY=YOUR_API_KEY_HERE yarn start
{{< /tab >}}
{{< /tabs >}}

## Useful Links

- GitHub: [@dfuse/client](https://github.com/dfuse-io/client-js)
- Docs: [dfuse Search query language](#dfuse-query-language)
- On mainnet: [GraphiQL](https://mainnet.eos.dfuse.io/graphiql/) A graphic graphql editor and API documentation browser.
- GitHub: [Stream action rates example](https://github.com/dfuse-io/example-stream-action-rates) This example demonstrates how to use the dfuse GraphQL APIs in a React application to livestream the average rates from the top actions. A live demo is available [here](http://labs.dfuse.io/livesearch-example/)