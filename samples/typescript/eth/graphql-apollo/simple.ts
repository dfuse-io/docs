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
  network: "mainnet.eth.dfuse.io",
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
      searchTransactions(indexName: CALLS, query: "-value:0", limit: 10, sort: ASC) {
        node { hash from to value }
      }
    }
  `
}).subscribe({
  start: (subscription) => { console.log("Started to stream the next 10 transactions with non-zero value", subscription) },
  next: (res) => {
    const { hash, from, to, value} = res.data.searchTransactions.node;
      console.log(`Tranasction: ${hash} From: ${from} To: ${to} Value: ${value}`)
  },
  error: (error) => { console.log("Error", error) },
  complete: () => { console.log("Completed") },
});
