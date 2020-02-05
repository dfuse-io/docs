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

  const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: new WebSocketLink(subscriptionClient),
  });

  const startBlock = 66000000
  const stopBlock = 66007200

  let activeCursor = ""
  let actionCount = 0
  let notifCount = 0
  let transactionCount = 0
  let startTime = Date.now()
  let logInterval = 25000
  let lastBlockSeen = startBlock
  let lastConnectTime = Date.now()
  let lastReconnectingTime = Date.now()
  let lastDisconnectedTime = Date.now()
  let connectedOnce = false

  const logStats = () => {
    const elapsed = Date.now() - startTime
    const blockCount = lastBlockSeen - startBlock

    console.log(`[Block Count: ${blockCount}, Transaction: ${transactionCount}, Action: ${actionCount}, Notifications: ${notifCount}, Elapsed: ${humanizeDuration(elapsed)}, Block: ${lastBlockSeen}]`)
    console.log()
  }

  let activeResolve = undefined
  let activeReject = undefined
  let activeSubscription = undefined

  const promise = new Promise((resolve, reject) => {
    activeResolve = resolve
    activeReject = reject
  })

  subscriptionClient.onConnecting((...args: any) => { console.log("Connecting", ...args) })
  subscriptionClient.onConnected((...args) => {
    lastConnectTime = Date.now()

    if (!connectedOnce) {
      console.log("Connected", ...args)
      connectedOnce = true
    } else {
      console.log(`Reconnected at block ${lastBlockSeen} with ${activeCursor} (reconnection time ${humanizeDuration(Date.now() - lastReconnectingTime)})`, ...args)
    }
  })

  // subscriptionClient.onReconnecting((...args: any) => {
  //   console.log(`Reconnecting (disconnecting time ${humanizeDuration(Date.now() - lastDisconnectedTime)})`, ...args)
  //   lastReconnectingTime = Date.now()
  // })

  // subscriptionClient.onReconnected((...args: any) => {
  //   console.log(`Reconnected at block ${lastBlockSeen} with ${activeCursor} (reconnection time ${humanizeDuration(Date.now() - lastReconnectingTime)})`, ...args)
  //   lastConnectTime = Date.now()
  // })

  subscriptionClient.onDisconnected((...args: any) => {
    if (activeSubscription) {
      activeSubscription.unsubscribe()
    }

    console.log(`Disconnected (last session lasted ${humanizeDuration(Date.now() - lastConnectTime)}`, ...args)
    lastDisconnectedTime = Date.now()
    lastConnectTime = Date.now()

    setTimeout(() => {
      console.log(`Reconnecting (disconnecting time ${humanizeDuration(Date.now() - lastDisconnectedTime)})`, ...args)
      lastReconnectingTime = Date.now()
      subscribe()
    }, 500)
  })

  subscriptionClient.onError((error) => { console.log("Error", error.type, error.message) })

  const subscribe = () => {
    activeSubscription = apolloClient.subscribe({
      query: gql`
        subscription($startBlock: Int64!, $stopBlock: Int64!, $cursor: String!) {
          searchTransactionsForward(
            query: "(action:transfer OR action:close OR action:retire OR action:issue)",
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
      next: (value) => {
        const message = value.data.searchTransactionsForward
        const blockNum = message.block.num
        if (blockNum < lastBlockSeen) {
          console.log(`We have a big problem, ${blockNum} < ${lastBlockSeen}`)
        }

        lastBlockSeen = blockNum
        transactionCount++

        message.trace.matchingActions.forEach((action) => {
          const isNotif = action.receiver !== action.account
          if (isNotif) {
            notifCount++
          } else {
            actionCount++
          }
        })

        activeCursor = message.cursor

        if (transactionCount % logInterval === 0) {
          console.log(`Seen ${transactionCount} results yet (cursor ${activeCursor})...`)
          logStats()
        }
      },
      error: (error) => {
        activeReject(error)
      },
      complete: () => {
        console.log("Completed")
        console.log()

        console.log(`Token Transaction count: ${transactionCount}`)
        console.log(`Token Action count: ${actionCount}`)
        console.log(`Token Notification count: ${notifCount}`)

        console.log()

        const elapsedTime = Date.now() - startTime
        console.log(`Elapsed Time: ${humanizeDuration(elapsedTime)}`)

        activeResolve()
      },
    });
  }

  subscribe()
  return promise
}

main().then(() => process.exit(0)).catch((error) => {
  console.log("An unknown error occurred", error)
  process.exit(1)
})
