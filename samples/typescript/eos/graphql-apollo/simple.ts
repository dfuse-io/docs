import { createDfuseClient } from "@dfuse/client";
import { WebSocketLink } from "apollo-link-ws";
import ApolloClient from "apollo-client/ApolloClient";
import { InMemoryCache } from "apollo-cache-inmemory";
import { gql } from "apollo-boost";
import nodeFetch from "node-fetch";
import * as ws from "ws";

(global as any).WebSocket = ws;
(global as any).fetch = nodeFetch;

if (process.env.DFUSE_API_KEY == null) {
  console.log("Missing DFUSE_API_KEY environment variable")
  process.exit(1)
}

const dfuseClient = createDfuseClient({
  apiKey: process.env.DFUSE_API_KEY!,
  network: "mainnet",
});

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new WebSocketLink({
    uri: dfuseClient.endpoints.graphqlStreamUrl,
    options: {
      reconnect: true,
      connectionParams: async () => {
        const apiToken = await dfuseClient.getTokenInfo()

        return {
          Authorization: `Bearer ${apiToken.token}`
        };
      }
    },
    webSocketImpl: ws,
  }),
});

apolloClient.subscribe({
  query: gql`
    subscription {
      searchTransactionsForward(query: "action:transfer", limit:10) {
        trace { matchingActions {receiver account name json }}
      }
    }
  `
}).subscribe({
  start: (subscription) => { console.log("Started", subscription) },
  next: (value) => {
    const trace = value.data.searchTransactionsForward.trace;
    trace.matchingActions.forEach((action: any) => {
      console.log(`Action ${action.receiver}/${action.account}:${action.name}`)
    });
  },
  error: (error) => { console.log("Error", error) },
  complete: () => { console.log("Completed") },
});
