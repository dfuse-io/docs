import { createDfuseClient } from "@dfuse/client";
import { WebSocketLink } from "apollo-link-ws";
import ApolloClient from "apollo-client/ApolloClient";
import { InMemoryCache } from "apollo-cache-inmemory";
import nodeFetch from "node-fetch";
import ws from "ws";
import { getRexPoolQuery } from "./query";
import { getTypesFromAbi, createInitialTypes, hexToUint8Array, SerialBuffer, Type } from 'eosjs/dist/eosjs-serialize';
import { Api, JsonRpc } from 'eosjs';
import fetch from 'node-fetch'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';
import { TextEncoder, TextDecoder } from 'util';
import { SubscriptionClient } from "subscriptions-transport-ws";
import debugFactory from "debug"

(global as any).WebSocket = ws;
(global as any).fetch = nodeFetch;

if (process.env.DFUSE_API_KEY == null) {
  console.log("Missing DFUSE_API_KEY environment variable")
  process.exit(1)
}

const debug = debugFactory("dfuse:example")

async function main() {
  const signatureProvider = new JsSignatureProvider([]);
  const rpc = new JsonRpc('https://testnet.eos.dfuse.io', { fetch: fetch as any });
  const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder() as any, textEncoder: new TextEncoder() });

  const dfuseClient = createDfuseClient({
    apiKey: process.env.DFUSE_API_KEY!,
    network: "testnet",
  });

  const subscriptionClient = new SubscriptionClient(dfuseClient.endpoints.graphqlStreamUrl, {
    reconnect: true,
    lazy: true,
    connectionCallback: (error?: any) => {
      if (error) {
        console.log("Problem initializing re-connection", error)
      }
    },
    connectionParams: async () => {
      const { token } = await dfuseClient!.getTokenInfo();

      return {
        Authorization: `Bearer ${token}`
      }
    }
  }, ws);

  subscriptionClient.onConnecting(() => { debug("Connecting") })
  subscriptionClient.onConnected(() => { debug("Connected") })
  subscriptionClient.onReconnecting(() => { debug("Reconnecting") })
  subscriptionClient.onReconnected(() => { debug("Reconnected") })
  subscriptionClient.onDisconnected(() => { debug("Disconnected") })
  subscriptionClient.onError((error) => { debug("Error", error) })

  const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: new WebSocketLink(subscriptionClient),
  });

  // Would need to deal with the fact that this can be updated through
  // the lifecycle of the chain, so at various blocks. Best thing probably is
  // to first use dfuse SQE `action:setabi account:eosio data.account:eosio`
  // to track all changes and load the ABI for all these blocks through dfuse API.
  //
  // Then use the right ABI for the right block range.
  const abi = await api.getAbi("eosio")
  const builtinTypes = createInitialTypes()
  const types = getTypesFromAbi(builtinTypes, abi)

  const rexPoolType = types.get("rex_pool")
  if (rexPoolType === undefined) {
      console.log("Type 'rex_pool' does not exist on 'eosio' ABI")
      return
  }

  return new Promise((resolve, reject) => {
    debug("Subscribing to REX feed")

    let activeCursor = ""
    let currentBlock = 0

    apolloClient.subscribe({
      query: getRexPoolQuery,
      variables: {
        cursor: activeCursor,
        lowBlockNum: 61_500_000,
        highBlockNum: 0,
      }
    }).subscribe({
      start: (subscription) => { debug("Started", subscription) },
      next: (value) => {
        debug("Received message")
        const message = value.data.searchTransactionsForward;

        const trace = message.trace
        if (currentBlock < trace.block.num) {
          const matchingAction = trace.matchingActions[0]
          const rexPoolDbOp = matchingAction.dbOps.find(isRexpoolDbOp)
          const rexPoolRow = decodeRexpoolRow(rexPoolDbOp.newData, rexPoolType)

          console.log(rexPoolRowToPricePoint(rexPoolRow) + " @ " + trace.block.timestamp)

          currentBlock = trace.block.num
        }

        activeCursor = message.cursor
      },
      error: (error) => { reject(error) },
      complete: () => { resolve() },
    });
  })
}

function rexPoolRowToPricePoint(rexPoolRow: RexpoolRow) {
  if (rexPoolRow.version !== 0) {
    throw Error(
      `Expecting version 0 of rexpool object, got ${rexPoolRow.version}, code need to be adpated`
    )
  }

  // This might proves problematic because JavaScript has 53 bits precisions
  // so it might not be as accurate as possible. Hopefully, only the precision
  // is affected and not the overall number. More testing is required to ensure
  // we have the correct value.
  const totalEos = assetToQuantity(rexPoolRow.total_lendable)
  const totalRex = assetToQuantity(rexPoolRow.total_rex)

  return totalRex / totalEos
}

function isRexpoolDbOp(dbOp: any) {
  return dbOp.key.code === "eosio" && dbOp.key.scope === "eosio" && dbOp.key.table === "rexpool"
}

type RexpoolRow = {
  version: number
  total_lent: string
  total_unlent: string
  total_rent: string
  total_lendable: string
  total_rex: string
  namebid_proceeds: string
  loan_num: number
}

function decodeRexpoolRow(hexData: string, rexPoolType: Type): RexpoolRow {
  const data = hexToUint8Array(hexData);

  const buffer = new SerialBuffer({ textDecoder: new TextDecoder() as any, textEncoder: new TextEncoder() });
  buffer.pushArray(data);

  return rexPoolType.deserialize(buffer);
}

function assetToQuantity(asset: string) {
  return parseFloat(asset.split(" ")[0])
}

main().then(() => {
  console.log("Completed")
  process.exit(0)
}).catch((error) => {
  console.log("An error occurred", error)
  process.exit(1)
})
