import { createDfuseClient } from "@dfuse/client";
import { WebSocketLink } from "apollo-link-ws";
import ApolloClient from "apollo-client/ApolloClient";
import { InMemoryCache } from "apollo-cache-inmemory";
import { gql } from "apollo-boost";
import nodeFetch from "node-fetch";
import * as ws from "ws";
import { SubscriptionClient } from "subscriptions-transport-ws";

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

const subscriptionClient = new SubscriptionClient(dfuseClient.endpoints.graphqlStreamUrl, {
  reconnect: true,
  connectionCallback: (error?: any) => {
    if (error) {
      console.log("Unable to correctly initialize connection", error)
      process.exit(1)
    }
  },
  connectionParams: async () => {
    const { token } = await this.dfuseClient!.getTokenInfo();

    return {
      Authorization: `Bearer ${token}`
    }
  }
}, ws);

subscriptionClient.onConnecting(() => { console.log("Connecting") })
subscriptionClient.onConnected(() => { console.log("Connected") })
subscriptionClient.onReconnecting(() => { console.log("Reconnecting") })
subscriptionClient.onReconnected(() => { console.log("Reconnected") })
subscriptionClient.onDisconnected(() => { console.log("Disconnected") })
subscriptionClient.onError((error) => { console.log("Error", error) })

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new WebSocketLink(subscriptionClient),
});

let activeCursor = ""

apolloClient.subscribe({
  query: gql`
    subscription($cursor: String!) {
      searchTransactionsForward(query: "account:eosio.token action:transfer", cursor: $cursor) {
        cursor
        trace { matchingActions {receiver account name json }}
      }
    }
  `,
  variables: {
    cursor: activeCursor,
  },
}).subscribe({
  start: (subscription) => { console.log("Started", subscription) },
  next: (value) => {
    const message = value.data.searchTransactionsForward
    message.trace.matchingActions.forEach((action: any) => {
      console.log(`Action ${action.receiver}/${action.account}:${action.name}`)
    });

    activeCursor = message.cursor
  },
  error: (error) => { console.log("Error", error) },
  complete: () => { console.log("Completed") },
});
