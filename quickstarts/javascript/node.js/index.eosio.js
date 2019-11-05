global.fetch = require('node-fetch')
global.WebSocket = require('ws')

const { createDfuseClient } = require("@dfuse/client")

const client = createDfuseClient({
  apiKey: process.env.DFUSE_API_KEY,
  network: "mainnet.eos.dfuse.io",
})

// You must use a `$cursor` variable so stream starts back at last marked cursor on reconnect!
const operation = `subscription($cursor: String!) {
  searchTransactionsForward(query:"receiver:eosio.token action:transfer -data.quantity:'0.0001 EOS'", cursor: $cursor) {
    undo cursor
    trace { id matchingActions { json } }
  }
}`

async function main() {
  const stream = await client.graphql(operation, (message) => {
    if (message.type === "data") {
      const { undo, cursor, trace: { id, matchingActions }} = message.data.searchTransactionsForward
      matchingActions.forEach(({ json: { from, to, quantity } }) => {
        console.log(`Transfer ${from} -> ${to} [${quantity}]${undo ? " REVERTED" : ""}`)
      })

      // Mark stream at cursor location, on re-connect, we will start back at cursor
      stream.mark({ cursor })
    }

    if (message.type === "error") {
      console.log("An error occurred", message.errors, message.terminal)
    }

    if (message.type === "complete") {
      console.log("Completed")
    }
  })

  // Waits until the stream completes, or forever
  await stream.join()
  await client.release()
}

main().catch((error) => console.log("Unexpected error", error))

