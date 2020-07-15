---
weight: 2
sideNavTitle: Search with query language
pageTitle: Search with query language
release: beta
---

In this guide we will create a simple React application that will use dfuse's Search API and query language to find specific Ethereum transactions. To do that, we will be using {{< external-link href="https://reactjs.org/docs/hooks-intro.html" title="react hooks">}}.

![Ethereum Search Demo](/img/eth-search.gif)

## 0. Completed Example

If you prefer to skip forward and run the completed project, run:

{{< tabs "clone-completed-example">}}
{{< tab title="Shell" lang="shell" >}}
# clone and install the example project
git clone github.com/dfuse-io/docs
cd docs/tutorials/search
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
npx create-react-app search
cd search
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
{{< code-section "tutorials_eth_search_js_section2">}}
{{< /tab >}}
{{< /tabs >}}

Initialize the dfuse client using the API key you created in the second step. Let's create the `dfuseClient` right after the `function App()` declaration.

{{< tabs "setting-up-dfuse-client1-initialize">}}
{{< tab title="src/App.js" lang="javascript" >}}
{{< code-section "tutorials_eth_search_js_section3">}}
{{< /tab >}}
{{< /tabs >}}

## 5. Craft the GraphQL query

To show multiple search results, we can either use a GraphQL query or subscription query. A GraphQL subscription will continuously stream responses while a GraphQL query allows for pagination. We will use a GraphQL query to return the first 10 results of our search.

{{< alert type="note" >}}
We are using a long query to request all the available data.

With GraphQL, you can choose to request as little or as much data as needed. Therefore you can shrink down the query to only 6 lines and only request the `transactionHash` if you prefer.

See [Getting Started with GraphQL](../concepts/graphql/) for more information.
{{< /alert >}}

{{< alert type="tip" >}}
See [Query Langauge](../concepts/search-query-language/) to learn more about what you can search.
{{< /alert >}}

{{< tabs "tracker-query">}}
{{< tab title="src/App.js" lang="javascript" >}}
{{< code-section "tutorials_eth_search_js_section4">}}
{{< /tab >}}
{{< /tabs >}}

## 6. Setup our Hooks

Lets setup a few hooks that will help us keep track of our transaction states and render our component. We use {{< external-link title="react state hook" href="https://reactjs.org/docs/hooks-state.html">}} to accomplish this.

- `query`: keeps track of the search query
- `transactions`: array that stores all the received transactions
- `state`: stores the current state of the GraphQL subscription
- `error`: stores our errors

{{< tabs "setup-hooks">}}
{{< tab title="src/App.js" lang="javascript" >}}
{{< code-section "tutorials_eth_search_js_section5">}}
{{< /tab >}}
{{< /tabs >}}

## 7. Search Transactions Function

Create an `async` function `searchTransactions` that will use the dfuse JS client to execute the GraphQL query we crafted above and initialize a few state variables.

{{< tabs "fetch-transaction-init">}}
{{< tab title="src/App.js" lang="javascript" >}}
async function searchTransactions() {
  setState('searching'); // sets the state of our query to "searching"
  setError(""); // clears any errors that may have been logged before
  setTransactions([]); // clears the transactions when starting a new search
  var currentResults = []; // local variable to store transactions in callback function
  ...
}
{{< /tab >}}
{{< /tabs >}}

Use dfuse client with the GraphQL query and set the following variables:

- `query`: query string to tell the API what you want to search for
- `indexName`: (CALLS | LOGS) type of data to search for
- `lowBlockNum`: lower range of block number to search within
- `highBlockNum`: higher range of block number to search within
- `limit`: limit of results to return
- `sort`: (ASC | DESC) ascending or desending direction to search in
- `cursor`: chain-wide pointer to an exact location that allows you to resume your search at

{{< tabs "fetch-transaction-func-setup">}}
{{< tab title="src/App.js" lang="javascript" >}}
{{< code-section "tutorials_eth_search_js_section6">}}
{{< /tab >}}
{{< /tabs >}}

## 8. Render Function

Build the `render` method for this component. It includes an input for the search query string, and handles the different possible states of our component.

{{< tabs "fetch-transaction-render">}}
{{< tab title="src/App.js" lang="javascript" >}}
{{< code-section "tutorials_eth_search_js_section7">}}
{{< /tab >}}
{{< /tabs >}}

## 9. Prettifying it with CSS

Add some CSS to style this HTML a bit. Replace the contents of `src/App.css` with the following:

{{< tabs "fetch-transaction-css">}}
{{< tab title="src/App.css" lang="css" >}}
{{< code-section "tutorials_eth_search_css_section1">}}
{{< /tab >}}
{{< /tabs >}}

## 10. Full Working Example

The source code for this tutorial is available on {{< external-link href="https://github.com/dfuse-io/docs/tree/master/tutorials/eth/search" title="GitHub" >}}. Below are the code files discussed on this page.

{{< tabs "fetch-transaction-full-app">}}
{{< tab title="src/App.js" lang="javascript" >}}
{{< code-section "tutorials_eth_search_js_section1">}}
{{< /tab >}}
{{< tab title="src/App.css" lang="css" >}}
{{< code-section "tutorials_eth_search_css_section1">}}
{{< /tab >}}
{{< /tabs >}}
