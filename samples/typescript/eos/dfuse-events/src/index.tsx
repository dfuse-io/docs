import * as React from "react"
import * as ReactDOM from "react-dom"
import { InMemoryCache } from "apollo-cache-inmemory"
import { ApolloClient } from "apollo-client"
import { WebSocketLink } from "apollo-link-ws"
import { ApolloProvider } from "react-apollo"
import { UALProvider, withUAL } from "ual-reactjs-renderer"
import { Scatter } from "ual-scatter"
import { createDfuseClient } from "@dfuse/client"

import App from "./App"
import { Config } from "./config"

import "./index.css"

// Make sure to get your own API key at https://dfuse.io -- this test key will only work for one hour
const dfuseClient = createDfuseClient({ network: "kylin", apiKey: "web_ddaf4dcba8fd11d0f52566a27b4ffc1e" })

const wsLink = new WebSocketLink({
  uri: `wss://kylin.eos.dfuse.io/graphql`,
  options: {
    reconnect: true,
    connectionParams: async () => {
      const token = await dfuseClient.getTokenInfo()
      return {
      Authorization: `Bearer ${token.token}`
      }
    }
  }
})

const blockchainConfig = {
  chainId: Config.chainId,
  rpcEndpoints: [
    {
      protocol: Config.chainApiProtocol,
      host: Config.chainApiHost,
      port: Number(Config.chainApiPort)
    }
  ]
}

const apolloClient = new ApolloClient({ link: wsLink, cache: new InMemoryCache() })
const scatter = new Scatter([blockchainConfig], { appName: "dfuse Events" })

const WrappedApp = withUAL(App)

ReactDOM.render(
  <ApolloProvider client={apolloClient}>
    <UALProvider chains={[blockchainConfig]} authenticators={[scatter]} appName={"dfuse Events"}>
      <WrappedApp />
    </UALProvider>
  </ApolloProvider>,
  document.getElementById("root") as HTMLElement
)
