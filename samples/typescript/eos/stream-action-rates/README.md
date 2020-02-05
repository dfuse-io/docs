# Get started with dfuse.io GraphQL API using REACT

## Stream action rates example

This example demonstrates how to use the dfuse GraphQL APIs in a React application to livestream the
average execution rates for the top actions. A live demo is available [here](http://labs.dfuse.io/livesearch/).

### Quick Start

The following assumes you have yarn installed on your computer.

    git clone https://github.com/dfuse-io/example-stream-action-rates.git
    cd example-stream-action-rates
    yarn install
    yarn start
    # Automatically open ups a browser pointing to `localhost:3000`

### Walkthrough

First, head to the dfuse self-service API management portal (https://app.dfuse.io). After signing up, you
will be able to create long-term API keys.

We use the [Apollo Client](https://www.apollographql.com/docs/react/) as well as the
[@dfuse/client](https://github.com/dfuse-io/client-js)
library to connect to the GraphQL server. You can install the Apollo Client and other
required packages via:

```
yarn add @dfuse/client apollo-boost apollo-client apollo-link-ws graphql react-apollo subscriptions-transport-ws
```

The easiest way to talk to the dfuse API is to use the [@dfuse/client](https://github.com/dfuse-io/client-js)
library which handles all of the heavy work of retrieving an API token, persist it to disk to avoid hitting rate limits on
API token issuance, and ensures the token is always fresh.

In our example, we instantiate the Apollo Client to leverage the power of
[@dfuse/client](https://github.com/dfuse-io/client-js) library and let it handle API token management:

<small>See [src/client.ts](https://github.com/dfuse-io/example-stream-action-rates/tree/master/src/client.ts)</small>

```typescript
import { WebSocketLink } from "apollo-link-ws";
import ApolloClient from "apollo-client/ApolloClient";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createDfuseClient } from "@dfuse/client";

const dfuseClient = createDfuseClient({
  network: "mainnet",
  apiKey: "YOUR_API_KEY_HERE" // <--- Change this value for your own API Key!
})

const wsLink = new WebSocketLink({
  uri: dfuseClient.endpoints.graphqlStreamUrl,
  options: {
    lazy: true,
    reconnect: true,
    connectionParams: async () => {
      const apiToken = await dfuseClient.getTokenInfo()

      return {
        Authorization: `Bearer ${apiToken.token}`
      };
    }
  }
});

export const apolloClient = new ApolloClient({
  link: wsLink,
  cache: new InMemoryCache()
});
```

### GraphQL query

- The dfuse GraphQL documentation can be found [here](https://docs.dfuse.io/#graphql)
- If you are not familiar with GraphQL already, take a look at [Introduction to GraphQL](https://graphql.org/learn/)
- To help you construct your query and access our API documentation you can use [GraphiQL](https://mainnet.eos.dfuse.io/graphiql/) _"A graphical interactive in-browser GraphQL IDE."_
https://mainnet.eos.dfuse.io/graphiql/

### Build the GraphQL subscription

We use the [gql](https://www.apollographql.com/docs/react/essentials/queries) function to build our subscription query:

<small>See [src/graphql.ts](https://github.com/dfuse-io/example-stream-action-rates/tree/master/src/graphql.ts)</small>

```typescript
import { gql } from "apollo-boost";

export const subscribeTransactions = gql`
  fragment actionTracesFragment on ActionTrace {
    account
    receiver
    name
  }

  subscription subscribeTransactions($cursor: String, $lowBlockNum: Int64) {
    searchTransactionsForward(
      query: "action:transfer"
      lowBlockNum: $lowBlockNum
      cursor: $cursor
    ) {
      cursor
      undo
      trace {
        id
        status
        block {
          id
          num
          timestamp
        }
        executedActions {
          ...actionTracesFragment
        }
      }
    }
  }
`;
```

### Use in React application

Apollo provides an `ApolloProvider` component to link the Apollo Client to the React application. Using
the subscription query is as simple as passing it to the `Subscription` component (read
[Apollo documentation](https://www.apollographql.com/docs/react/advanced/subscriptions) for more details).

<small>See [src/App.tsx](https://github.com/dfuse-io/example-stream-action-rates/tree/master/src/App.tsx)</small>

```typescript
export class App extends Component {
  ...

  onSubscriptionData = ({ client, subscriptionData }: any) => {
    const result = (subscriptionData.data.searchTransactionsForward) as SearchResult;
    console.log(result)
  };

  render() {
    return (
      <ApolloProvider client={apolloClient}>
        <Subscription
          subscription={subscribeTransactions}
          variables={{ cursor: "", lowBlockNum: -100 }}
          onSubscriptionData={this.onSubscriptionData}
        />
      </ApolloProvider>
    )
  }
}

```

### Parsing server response

The response from the server is parsed and fed into an `actionsMap` hash to hold the rates for each action contract/name pair:

<small>See [src/models.ts](https://github.com/dfuse-io/example-stream-action-rates/tree/master/src/models.ts)</small>
<br>
<small>See [src/App.tsx#105](https://github.com/dfuse-io/example-stream-action-rates/tree/master/src/App.tsx#L105)</small>

```typescript
onSubscriptionData = ({ client, subscriptionData }: any) => {
  const { undo, trace } = (subscriptionData.data.searchTransactionsForward) as SearchResult;

  trace.executedActions.forEach((action) => {
    const key = `${action.account}:${action.name}`;
    const increment = undo ? -1 : 1;

    this.actionsMap[key] = (this.actionsMap[key] || 0) + increment;
  });
}
```

The snippet above contains an `undo` parameter (returned inside the payload of the subscription response),
that parameter handles micro-forks inside the chain and the counter is decremented if it is set to `true`.

You can read more about [navigating forks](https://docs.dfuse.io/#websocket-navigating-forks) in our documentation.
