// CODE:BEGIN:tutorials_eos_push-guaranteed_section1
import { Api, JsonRpc } from "eosjs"
import JsSignatureProvider from "eosjs/dist/eosjs-jssig"
import { TextDecoder, TextEncoder } from "text-encoding"
// CODE:END:tutorials_eos_push-guaranteed_section1

// CODE:BEGIN:tutorials_eos_push-guaranteed_section2
import fetch, { Request, RequestInit, Response } from "node-fetch"
// CODE:END:tutorials_eos_push-guaranteed_section2

// CODE:BEGIN:tutorials_eos_push-guaranteed_section3
import { createDfuseClient } from "@dfuse/client"
;(global as any).fetch = fetch
;(global as any).WebSocket = {}

const config = readConfig()
const client = createDfuseClient({ apiKey: config.dfuseApiKey, network: config.network })
// CODE:END:tutorials_eos_push-guaranteed_section3

console.log("Performing push transaction with the following config", prettyJson(config))
console.log()

/**
 * Here the actual difference to make our push guaranteed API to work. You need to customize
 * fetch so that custom headers are appended to the request performed.
 *
 * The headers that are required:
 *  - Authorization: Bearer <API Token>
 *  - X-Eos-Push-Guarantee: in-block | irreversible | handoff:1 | handoffs:2 | handoffs:3
 *
 * Those two headers needs to be present on your push transaction request otherwise, the
 * push guaranteed API will not kicked in and you will use the "normal endpoint" in
 * those situations.
 *
 * **Note** How the example is setup will route all `/v1/chain` call to dfuse endpoints.
 */
// CODE:BEGIN:tutorials_eos_push-guaranteed_section4
const customizedFetch = async (input: string | Request, init: RequestInit): Promise<Response> => {
  if (init.headers === undefined) {
    init.headers = {}
  }

  // This is highly optimized and cached, so while the token is fresh, this is very fast
  const apiTokenInfo = await client.getTokenInfo()

  const headers = init.headers as { [name: string]: string }
  headers["Authorization"] = `Bearer ${apiTokenInfo.token}`
  headers["X-Eos-Push-Guarantee"] = config.guaranteed

  return fetch(input, init)
}
// CODE:END:tutorials_eos_push-guaranteed_section4

/**
 * Demonstrates how to push a transaction with guaranteed using dfuse API endpoint.
 *
 * Requierements:
 *  - Have an environment variable named DFUSE_API_KEY containing your dfuse API key
 *  - Have an environment variable name SIGNING_PRIVATE_KEY containing the private key used to sign the trx
 *  - Have an environment variable name TRANSFER_FROM_ACCOUNT containing the account that will send token from
 */
 // CODE:BEGIN:tutorials_eos_push-guaranteed_section5
async function main() {
  const signatureProvider = new JsSignatureProvider([config.privateKey])
  const rpc = new JsonRpc(client.endpoints.restUrl, { fetch: customizedFetch })
  const api = new Api({
    rpc,
    signatureProvider,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder()
  })

  const transferAction = {
    account: "eosio.token",
    name: "transfer",
    authorization: [
      {
        actor: config.transferFrom,
        permission: "active"
      }
    ],
    data: {
      from: config.transferFrom,
      to: config.transferTo,
      quantity: config.transferQuantity,
      memo: `Transaction with push guaranteed '${
        config.guaranteed
      }' from dfuse (https://docs.dfuse.io/#rest-api-post-push_transaction)`
    }
  }

  console.log("Transfer action", prettyJson(transferAction))

  const startTime = new Date()
  const result = await api.transact(
    { actions: [transferAction] },
    {
      blocksBehind: 360,
      expireSeconds: 3600
    }
  )
  const endTime = new Date()

  printResult(result, startTime, endTime)
}
// CODE:END:tutorials_eos_push-guaranteed_section5

// CODE:BEGIN:tutorials_eos_push-guaranteed_section6
function readConfig() {
  const network = process.env.DFUSE_API_NETWORK || "jungle.eos.dfuse.io"
  const guaranteed = process.env.PUSH_GUARANTEED || "in-block" // Or "irreversible", "handoff:1", "handoffs:2", "handoffs:3"
  const transferTo = process.env.TRANSFER_TO_ACCOUNT || "junglefaucet"
  const transferQuantity = process.env.TRANSFER_QUANTITY || "0.0001 EOS"

  const dfuseApiKey = process.env.DFUSE_API_KEY
  if (dfuseApiKey === undefined) {
    console.log(
      "You must have a 'process.env.DFUSE_API_KEY' environment variable containing your dfuse API key."
    )
    process.exit(1)
  }

  const privateKey = process.env.SIGNING_PRIVATE_KEY
  if (privateKey === undefined) {
    console.log(
      "You must have a 'SIGNING_PRIVATE_KEY' environment variable containing private used to sign."
    )
    process.exit(1)
  }

  const transferFrom = process.env.TRANSFER_FROM_ACCOUNT
  if (transferFrom === undefined) {
    console.log(
      "You must have a 'TRANSFER_FROM_ACCOUNT' environment variable containing account that is going to send token."
    )
    process.exit(1)
  }

  return {
    network,
    guaranteed,
    dfuseApiKey: dfuseApiKey!,
    privateKey: privateKey!,
    transferFrom: transferFrom!,
    transferTo,
    transferQuantity
  }
}

function printResult(result: any, startTime: Date, endTime: Date) {
  console.log("Transaction push result", prettyJson(result))
  console.log()

  const elapsed = (endTime.getTime() - startTime.getTime()) / 1000.0
  console.log(`Pushed with guarenteed '${config.guaranteed}' in '${elapsed}' seconds`)

  const networkMatch = client.endpoints.restUrl.match(
    /https:\/\/(mainnet|jungle|kylin).eos.dfuse.io/
  )
  if (networkMatch !== null && networkMatch[1] != null) {
    let network = networkMatch[1] + "."
    if (network === "mainnet") {
      network = ""
    }

    console.log(` - https://${network}eosq.app/tx/${result.transaction_id}`)
  }
}

function prettyJson(input: any): string {
  return JSON.stringify(input, null, 2)
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.log("An error occurred.", prettyJson(error))
    process.exit(1)
  })
// CODE:END:tutorials_eos_push-guaranteed_section6
