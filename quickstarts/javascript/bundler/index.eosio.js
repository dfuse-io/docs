// CODE:BEGIN:quickstarts_javascript_bundler_eos_section1
import { createDfuseClient } from "@dfuse/client"

const client = createDfuseClient({
  apiKey: process.env.DFUSE_API_KEY,
  network: "mainnet.eos.dfuse.io",
})
// CODE:END:quickstarts_javascript_bundler_eos_section1
// CODE:BEGIN:quickstarts_javascript_bundler_eos_section2
// You must use a `$cursor` variable so stream starts back at last marked cursor on reconnect!
const operation = `subscription($cursor: String!) {
  searchTransactionsForward(query:"receiver:eosio.token action:transfer -data.quantity:'0.0001 EOS'", cursor: $cursor) {
    undo cursor
    trace { id matchingActions { json } }
  }
}`
// CODE:END:quickstarts_javascript_bundler_eos_section2
// CODE:BEGIN:quickstarts_javascript_bundler_eos_section3
// You would normally use your framework entry point and render using components,
// we are using pure HTML manipulation for sake of example simplicity.
async function main() {
  const stream = await client.graphql(operation, (message) => {
    if (message.type === "data") {
      const { undo, cursor, trace: { id, matchingActions }} = message.data.searchTransactionsForward
      matchingActions.forEach(({ json: { from, to, quantity } }) => {
        const paragraphNode = document.createElement("li")
        paragraphNode.innerText = `Transfer ${from} -> ${to} [${quantity}]${undo ? " REVERTED" : ""}`

        document.body.prepend(paragraphNode)
      })

      // Mark stream at cursor location, on re-connect, we will start back at cursor
      stream.mark({ cursor })
    }

    if (message.type === "error") {
      const { errors, terminal } = message
      const paragraphNode = document.createElement("li")
      paragraphNode.innerText = `An error occurred ${JSON.stringify({ errors, terminal })}`

      document.body.prepend(paragraphNode)
    }

    if (message.type === "complete") {
        const paragraphNode = document.createElement("li")
        paragraphNode.innerText = "Completed"

        document.body.prepend(paragraphNode)
    }
  })

  // Waits until the stream completes, or forever
  await stream.join()
  await client.release()
}
// CODE:END:quickstarts_javascript_bundler_eos_section3
// CODE:BEGIN:quickstarts_javascript_bundler_eos_section4
main().catch((error) => document.body.innerHTML = `<p>${error}</p>`)
// CODE:END:quickstarts_javascript_bundler_eos_section4