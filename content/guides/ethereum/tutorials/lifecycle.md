---
weight: 3
menuTitle: Track transaction lifecycle in real-time
title: Track transaction lifecycle real-time
release: beta
---

In this guide we will create a simple React application that will use dfuse's Transaction State Tracker API to keep track of the state of an Ethereum transaction in real time. To do that, we will be using {{< external-link href="https://reactjs.org/docs/hooks-intro.html" title="react hooks">}}.

## 0. Completed Example

If you prefer to skip forward and run the completed project, run:

{{< tabs "clone-completed-example">}}
{{< tab title="Shell" lang="shell" >}}

# clone and install the example project

git clone github.com/dfuse-io/docs
cd docs/tutorials/eth/lifecycle
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

npx create-react-app lifecycle
cd lifecycle
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
{{< tab title="src/App.js" lang="javascript">}}
{{< code-section "tutorials_eth_lifecycle_js_section2">}}
{{< /tab >}}
{{< /tabs >}}

Initialize the dfuse client using the API key you created in the second step. Let's create the `dfuseClient` right after the `function App()` declaration.

{{< tabs "setting-up-dfuse-client1-initialize">}}
{{< tab title="src/App.js" lang="javascript">}}
{{< code-section "tutorials_eth_lifecycle_js_section3">}}
{{< /tab >}}
{{< /tabs >}}

## 5. Craft the GraphQL query

To get a real-time feed of transaction state changes, we need to craft a GraphQL subscription query. A GraphQL subscription will continuously stream responses and allows you to pick and choose the fields you want to return in the messages.

{{< alert type="note" >}}
See [Getting Started with GraphQL](/guides/core-concepts/graphql/) for more information about GraphQL.
{{< /alert >}}

Our GraphQL query will use the `transactionLifecycle` with a `hash` filter to retrieve the state changes of the transaction.

{{< alert type="tip" >}}
Do not worry! This query may seem intimidating, but it is broken down using the [Transaction State Tracker Concept](/guides/ethereum/concepts/trx_lifecycle/).
{{< /alert >}}

{{< tabs "tracker-query">}}
{{< tab title="src/App.js" lang="javascript">}}
{{< code-section "tutorials_eth_lifecycle_js_section4">}}
{{< /tab >}}
{{< /tabs >}}

## 6. Setup our Hooks

Lets setup a few hooks that will help us keep track of our transaction states and render our component. We use {{< external-link title="react state hook" href="https://reactjs.org/docs/hooks-state.html">}} to accomplish this.

- `transactionHash`: keeps track of the transaction's hash
- `transitions`: array that stores all the received transaction transitions
- `state`: stores the current state of the GraphQL subscription
- `error`: stores our errors

{{< tabs "setup-hooks">}}
{{< tab title="src/App.js" lang="javascript">}}
{{< code-section "tutorials_eth_lifecycle_js_section5">}}
{{< /tab >}}
{{< /tabs >}}

## 7. Get a Transaction State

Create an `async` function `fetchTransaction` that will use the dfuse JS client to execute the GraphQL query we crafted above and initialize a few state variables.

{{< tabs "fetch-transaction-init">}}
{{< tab title="src/App.js" lang="javascript" >}}
async function fetchTransaction() {
setState("streaming"); // sets the state of our query to "streaming"
setError(""); // clears any errors that may have been logged before
setTransitions([]); // clears the transitions when starting a new search
var currentTransitions = []; // local variable to store transition in callback function
var count = 0; // reset transition count
...
}
{{< /tab >}}
{{< /tabs >}}

Use the dfuse client with the GraphQL query and set our transaction hash as a variable.

{{< tabs "fetch-transaction-func-setup">}}
{{< tab title="src/App.js" lang="javascript" >}}
async function fetchTransaction() {
setState("streaming"); // sets the state of our query to "streaming"
setError(""); // clears any errors that may have been logged before
setTransitions([]); // clears the transitions when starting a new search
var currentTransitions = []; // local variable to store transition in callback function
var count = 0; // reset transition count

    const stream = await dfuseClient.graphql(streamTransactionQuery, (message) => {
        ...
    },{
        variables: {
            hash:  transactionHash
        }
    });
    await stream.join();  // awaits stream completion, which is never for this operation

}
{{< /tab >}}
{{< /tabs >}}

The `message` returned from the GraphQL stream can have 3 different types that need to be handled in our code:

- `error`: This is an error returned by the stream. We simply store it in our state.
- `data`: This contains the transition state tracker payload. We create a `newTransition` object and store that in our transitions array.
- `complete`: This message occurs when the stream is closed. We update our stream state.

{{< tabs "fetch-transaction-func-handler">}}
{{< tab title="src/App.js" lang="javascript">}}
{{< code-section "tutorials_eth_lifecycle_js_section6">}}
{{< /tab >}}
{{< /tabs >}}

## 8. Render Function

Build the `render` method for this component. It will include an input for the transaction hash, and handles the different possible states of our component.

{{< tabs "fetch-transaction-render">}}
{{< tab title="src/App.js" lang="javascript">}}
{{< code-section "tutorials_eth_lifecycle_js_section7">}}
{{< /tab >}}
{{< /tabs >}}

## 9. Prettifying it with CSS

Add some CSS to style this HTML a bit. Replace the contents of `src/App.css` with the following:

{{< tabs "fetch-transaction-css">}}
{{< tab title="src/App.css" lang="css">}}
{{< code-section "tutorials_eth_lifecycle_css_section1">}}
{{< /tab >}}
{{< /tabs >}}

## 10. Full Working Example

The source code for this tutorial is available on {{< external-link href="https://github.com/dfuse-io/docs/tree/master/tutorials/eth/lifecycle" title="GitHub" >}}. Below are the code files discussed on this page.

{{< tabs "fetch-transaction-full-app">}}

{{< tab title="src/App.js" lang="javascript">}}
{{< code-section "tutorials_eth_lifecycle_js_section1">}}
{{< /tab >}}
{{< tab title="src/App.css" lang="css">}}
{{< code-section "tutorials_eth_lifecycle_css_section1">}}
{{< /tab >}}
{{< /tabs >}}
