import { createDfuseClient } from "@dfuse/client";
import { WebSocketLink } from "apollo-link-ws";
import ApolloClient from "apollo-client/ApolloClient";
import { InMemoryCache } from "apollo-cache-inmemory";
import { gql } from "apollo-boost";
import nodeFetch from "node-fetch";
import * as ws from "ws";
import { SubscriptionClient } from "subscriptions-transport-ws";
import * as humanizeDuration from 'humanize-duration'

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

async function main() {
  await dfuseClient.getTokenInfo();

  const subscriptionClient = new SubscriptionClient(dfuseClient.endpoints.graphqlStreamUrl, {
    reconnect: true,
    lazy: true,
    connectionCallback: (error?: any) => {
      if (error) {
        console.log("Unable to correctly initialize connection", error)
        process.exit(1)
      }
    },
    connectionParams: async () => {
      const { token } = await dfuseClient.getTokenInfo();

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

  const startBlock = 66327634
  const stopBlock = 71675425

  let activeCursor = ""
  let actionCount = 0
  let transactionCount = 0
  let startTime = Date.now()
  let logInterval = 1000

  return new Promise((resolve, reject) => {
    apolloClient.subscribe({
      query: gql`
        subscription($startBlock: Int64!, $stopBlock: Int64!, $cursor: String!) {
          searchTransactionsForward(
            query: "receiver:eosio account:eosio action:newaccount",
            cursor: $cursor,
            lowBlockNum: $startBlock,
            highBlockNum: $stopBlock
          ) {
            undo
            cursor
            block {
              num
            }
            trace {
              id
              matchingActions {
                receiver
                account
                name
                json
              }
            }
          }
        }
      `,
      variables: {
        startBlock,
        stopBlock,
        cursor: activeCursor,
      },
    }).subscribe({
      start: (subscription) => {
        console.log("Started", subscription)
        startTime = Date.now()
      },
      next: (value) => {
        const message = value.data.searchTransactionsForward

        transactionCount++
        actionCount += message.trace.matchingActions.length
        activeCursor = message.cursor

        if (transactionCount % logInterval === 0) {
          console.log(`Seen ${transactionCount} results yet (at block ${message.block.num}, cursor ${activeCursor})...`)
        }
      },
      error: (error) => {
        reject(error)
      },
      complete: () => {
        console.log("Completed")
        console.log()

        console.log(`Account Creation Transaction count: ${transactionCount}`)
        console.log(`Account Creation Action count: ${actionCount}`)
        console.log()

        const elapsedTime = Date.now() - startTime
        console.log(`Elapsed Time: ${humanizeDuration(elapsedTime)}`)

        resolve()
      },
    });
  })
}

main().then(() => process.exit(0)).catch((error) => {
  console.log("An unknown error occurred", error)
  process.exit(1)
})
