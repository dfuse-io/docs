import { WebSocketLink } from "apollo-link-ws";
import ApolloClient from "apollo-client/ApolloClient";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createDfuseClient } from "@dfuse/client";

const dfuseClient = createDfuseClient({
  network: "mainnet",
  apiKey: "web_ddaf4dcba8fd11d0f52566a27b4ffc1e"
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
