const { createDfuseClient, waitFor, dynamicMessageDispatcher } = require("@dfuse/client")

if (process.env.DFUSE_API_KEY == null) {
    console.log("You must define an enviorment variable DFUSE_API_KEY containing your API key to run this sample.")
    process.exit(1)
}

global.fetch = require('node-fetch')
global.WebSocket = require('ws')

async function main() {
    const client = createDfuseClient({
        apiKey: process.env.DFUSE_API_KEY,
        network: 'mainnet'
    })

  const stream = await client.streamActionTraces(
    { accounts: "eosio.token", action_names: "transfer" },
    dynamicMessageDispatcher({
      action_trace: (message) => {
        const { from, to, quantity, memo } = message.data.trace.act.data
        console.log(`Transfer [${from} -> ${to}, ${quantity}] (${memo})`)
      }
    })
  )

  await waitFor(5000)
  await stream.close()
}

main().then(() => {
    console.log("Completed")
    process.exit(0)
}).catch((error) => {
    console.log("An error occurred", error)
    process.exit(1)
})
