---
weight: 20

#TODO: Find a better title and rename file if needed
pageTitle: Streaming Transactions
pageTitleIcon: eth

sideNav: true
sideNavTitle: Public APIs
sideNavLinkRename: Streaming Transactions

BookToC: true
release: beta

aliases:
  - /guides/ethereum/tutorials/stream/
  - /ethereum/public-apis/tutorials/stream/
  
---

In this guide we will create a simple React application that will use dfuse's javascript client library and the stream API to easily stream all transfers happening on the Ethereum Mainnet. To do that, we will be using {{< external-link href="https://reactjs.org/docs/hooks-intro.html" title="react hooks">}}.

![Ethereum Stream Demo](/img/eth-stream.gif)

## 0. Completed Example

If you prefer to skip forward and run the completed project, run:

{{< tabs "clone-completed-example">}}
{{< tab title="Shell" lang="shell" >}}
# clone and install the example project
git clone github.com/dfuse-io/docs
cd docs/tutorials/stream
yarn install
yarn start
{{< /tab >}}
{{< /tabs >}}

{{< alert type="note" >}}
Installing the {{< external-link href="https://reactjs.org/tutorial/tutorial.html#developer-tools" title="React Dev Tools">}} plugin for your browser is optional, but is very useful for seeing what goes on in the application.
{{< /alert >}}

## 1. Create React App

Use the {{< external-link href="https://github.com/facebook/create-react-app">}} to set up your development environment so that you can use the latest JavaScript features. You’ll need to have Node >= 8.10 and npm >= 5.6 on your machine. To create a project, run:

{{< tabs "create-react-app">}}
{{< tab title="Shell" lang="shell" >}}
# get create-react-app: https://github.com/facebook/create-react-app
npx create-react-app stream
cd stream
npm start
{{< /tab >}}
{{< /tabs >}}

then open ({{< external-link href="http://localhost:3000/">}})

## 2. Get your API key

{{< dfuse-account-creation >}}

## 3. Add the dfuse Client Library

The simplest way to get started with dfuse and JavaScript/TypeScript development is to use the dfuse JS client library.

{{< tabs "adding-dfuse-client-lib">}}
{{< tab title="NPM" lang="shell" >}}
# https://www.npmjs.com/package/@dfuse/client
npm install --save @dfuse/client
{{< /tab >}}
{{< /tabs >}}

## 4. Setup dfuse Client

Import the necessary functions from `dfuse/client` at the top of `src/App.js`.

{{< tabs "setting-up-dfuse-client1-import">}}
{{< tab title="src/App.js" lang="javascript" >}}
{{< code-section "tutorials_eth_stream_js_section1">}}
{{< /tab >}}
{{< /tabs >}}

Initialize the dfuse client using the API key you created in the second step. Let's create the `dfuseClient` right after the `function App()` declaration.

{{< tabs "setting-up-dfuse-client1-initialize">}}
{{< tab title="src/App.js" lang="javascript" >}}
{{< code-section "tutorials_eth_stream_js_section2">}}
{{< /tab >}}
{{< /tabs >}}

## 5. Craft the GraphQL query
A GraphQL subscription will continuously stream responses from the API. We will use a GraphQL subscription to return the the latest transfers for up to 100 results.

{{< alert type="note" >}}
With GraphQL, you can choose to request as little or as much data as needed. Therefore you can shrink down the query to only 6 lines and only request the `transactionHash` if you prefer.

See [Getting Started with GraphQL](/notions/public-apis/graphql-semantics/) for more information.
{{< /alert >}}

We use the following parameters for the GraphQL query:

- `query`: query string to tell the API what you want to search for
- `indexName`: (CALLS | LOGS) type of data to search for
- `limit`: limit of results to return
- `sort`: (ASC | DESC) ascending or desending direction to search in
- `cursor`: chain-wide pointer to an exact location that allows you to resume your search at

The query string `-value:0` indicates that the results must have non-zero ether values within the transactions.

{{< alert type="tip" >}}
See [Search Query Language](/notions/public-apis/search-query-language/) to learn more about what you can search.
{{< /alert >}}

{{< tabs "stream-query">}}
{{< tab title="src/App.js" lang="javascript" >}}
{{< code-section "tutorials_eth_stream_js_section3">}}
{{< /tab >}}
{{< /tabs >}}

## 6. Setup our Hooks

Lets setup a few hooks that will help us keep track of our transaction states and render our component. We use {{< external-link title="react state hook" href="https://reactjs.org/docs/hooks-state.html">}} to accomplish this.

- `transfers`: array that stores all the received transactions
- `state`: stores the current state of the GraphQL subscription
- `error`: stores our errors
- `stream`: object to listen for events on

{{< tabs "setup-hooks">}}
{{< tab title="src/App.js" lang="javascript" >}}
{{< code-section "tutorials_eth_stream_js_section4">}}
{{< /tab >}}
{{< /tabs >}}

## 7. Stream Transfers Function

Create an `async` function `streamTransfers` that will use the dfuse JS client to execute the GraphQL subscription we crafted above and initialize a few state variables.

The message returned can have types of `error`, `data`, and `complete`.
We handle each case by setting the `errors`, `transfers`, or `state` hooks to tell our app what to display.

{{< tabs "fetch-transaction-init">}}
{{< tab title="src/App.js" lang="javascript" >}}
{{< code-section "tutorials_eth_stream_js_section5">}}
{{< /tab >}}
{{< /tabs >}}

## 8. Stopping Stream and Disconnects

Define functions to stop the stream, handle streaming client closing and error catching.

{{< tabs "fetch-transaction-func-setup">}}
{{< tab title="src/App.js" lang="javascript" >}}
{{< code-section "tutorials_eth_stream_js_section6">}}
{{< /tab >}}
{{< /tabs >}}

## 9. Render Function

Build the `render` method for this component. It includes a launch and stop button to trigger the functions we defined. It also renders the list of transfers stored in our react hook.

{{< tabs "fetch-transaction-render">}}
{{< tab title="src/App.js" lang="javascript" >}}
{{< code-section "tutorials_eth_stream_js_section7">}}
{{< /tab >}}
{{< /tabs >}}

## 10. Prettifying it with CSS

Add some CSS to style this HTML a bit. Replace the contents of `src/App.css` with the following:

{{< tabs "fetch-transaction-css">}}
{{< tab title="src/App.js" lang="css" >}}
{{< code-section "tutorials_eth_stream_css_section1">}}
{{< /tab >}}
{{< /tabs >}}

## 11. Full Working Example

The source code for this tutorial is available on {{< external-link href="https://github.com/dfuse-io/docs/tree/master/tutorials/eth/stream" title="GitHub" >}}. Below are the code files discussed on this page.

{{< tabs "fetch-transaction-full-app">}}
{{< tab title="src/App.js" lang="javascript" >}}
{{< code-section "tutorials_eth_stream_js_section8">}}
{{< /tab >}}
{{< tab title="src/App.js" lang="css" >}}
{{< code-section "tutorials_eth_stream_css_section1">}}
{{< /tab >}}
{{< /tabs >}}
