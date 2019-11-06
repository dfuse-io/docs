---
weight: 3
title: Track transaction in real-time
---
{{< row-wrapper >}}
{{< sub-section-title title="Track transaction in Real-time (React/JavaScript)" protocol="ETH" >}}

In this guide we will create a simple React application that will use dfuse's Transaction State Tracker API to keep track of the state of an ethereum transaction in real-time. We will be using {{< externalLink href="https://reactjs.org/docs/hooks-intro.html" title="react hooks">}}.

{{< note >}}
Installing {{< externalLink href="https://reactjs.org/tutorial/tutorial.html#developer-tools" title="React Dev Tools">}} for your browser is optional, but really useful for seeing what goes on in the application
{{< /note >}}


## 1. Create React App
Use the {{< externalLink href="https://github.com/facebook/create-react-app">}} to sets up your development environment so that you can use the latest JavaScript features. You’ll need to have Node >= 8.10 and npm >= 5.6 on your machine. To create a project, run:

{{< tabs "create-react-app">}}
{{< tab title="Shell" lang="shell" >}}
# get create-react-app: https://github.com/facebook/create-react-app
npx create-react-app track-trx
cd track-trx
npm start
{{< /tab >}}
{{< /tabs >}}

then open ({{< externalLink href="http://localhost:3000/">}})

## 2. Get your api key

{{< dfuse-account-creation >}}

## 3. Add the dfuse client library

The simplest way to get started with dfuse and JavaScript/TypeScript development is to use the dfuse JS client library.

{{< tabs "adding-dfuse-client-lib">}}
{{< tab title="NPM" lang="shell" >}}
# https://www.npmjs.com/package/@dfuse/client
npm install --save @dfuse/client
{{< /tab >}}
{{< /tabs >}}

## 4. Setup dfuse client

Import the necessary functions from `dfuse/client` a the top of `src/App.js`

{{< tabs "setting-up-dfuse-client1-import">}}
{{< tab-code title="src/App.js" filename="./tutorials/ethereum/track_tx/App.js" range="1:3" >}}
{{< /tabs >}}

Initialize the dfuse client using the API key you created in the first step. Lets create the `dfuseClient` right after the `function App()` declaration.

{{< tabs "setting-up-dfuse-client1-initialize">}}
{{< tab-code title="src/App.js" filename="./tutorials/ethereum/track_tx/App.js" range="6:10" >}}
{{< /tabs >}}

## 5. Craft the graphQL query

To get a real-time feed of transaction state changes we need to craft a GraphQL subscription query. A GraphQL subscription will continuously stream responses and allows you to pick and choose the fields you want to return in the messages.

{{< note >}}
See {{< externalLink title="Graphql Concept" href="/guides/core-concepts/graphql/">}} for more information about GraphQL
{{< /note >}}

Our GraphQL query will use the `trackTransactionState` with a `hash` filter to retrieve the state changes of the transaction.

{{< tip >}}
Do not worry this query may see intimidating but it is broken down in  {{< externalLink title="Transaction State Tracker Concept" href="/guides/ethereum/concepts/trx_state_tracker/">}}
{{< /tip >}}

{{< tabs "tracker-query">}}
{{< tab-code title="src/App.js" filename="./tutorials/ethereum/track_tx/App.js" range="11:121" >}}
{{< /tabs >}}

## 6. Setup Our Hooks

Lets setup a few hooks that will help us keep track of our transaction states and render our component. We use {{< externalLink title="react state hook" href="https://reactjs.org/docs/hooks-state.html">}} to accomplish this.

* `transactionHash`: keeps track of the transaction's hash
* `transitions`: array that stores all the received transaction transitions
* `state`: store the current state of the GraphQL subscription
* `error`: store our errors

{{< tabs "setup-hooks">}}
{{< tab-code title="src/App.js" filename="./tutorials/ethereum/track_tx/App.js" range="123:126" >}}
{{< /tabs >}}

## 7. Get a transaction state

Create an `async` function `fetchTransactionState` that will use dfuse JS client to execute the GraphQL query we crafted above.

{{< tabs "fetch-transaction-func">}}
{{< tab title="src/App.js" lang="javascript" >}}
    async function fetchTransaction() {
        ...
    }
{{< /tab >}}
{{< /tabs >}}

Initialize a few state variables.

{{< tabs "fetch-transaction-init">}}
{{< tab title="src/App.js" lang="javascript" >}}
    async function fetchTransaction() {
        setState("streaming");
        setError("");
        setTransitions([]);
        var currentTransitions = [];
        var count = 0;
        ...
    }
{{< /tab >}}
{{< /tabs >}}

Use the dfuse client with GraphQL query and set our transaction hash as a variable

{{< tabs "fetch-transaction-func-setup">}}
{{< tab title="src/App.js" lang="javascript" >}}
    async function fetchTransaction() {
        setState("streaming");          // sets the state of our query to "streaming"
        setError("");                   // clears any errors that may have been logged before
        setTransitions([]);             // clears the transitions when starting a new search
        var currentTransitions = [];    // local variable to store transition in callback function
        var count = 0;                  // reset transition count

        const stream = await dfuseClient.graphql(streamTransactionQuery, (message) => {
            ...
        },{
            variables: {
                hash:  transactionHash
            }
        });
        await stream.join();
    }
{{< /tab >}}
{{< /tabs >}}

The `message` returned from the GraphQL stream can have 3 different types that need to be handled in our code:

* `error`: This is an error return by the stream. We simply store it in our state.
* `data`: This contains the transition state tracker payload. We create a `newTransition` object and store in our transitions array.
* `complete`: This message occurs when the stream is closed. We update our stream state.

{{< tabs "fetch-transaction-func-handler">}}
{{< tab-code title="src/App.js" filename="./tutorials/ethereum/track_tx/App.js" range="128:164" >}}
{{< /tabs >}}

## 8. Render function

Build the `render` method for this component. It will include an input for the transaction hash, and handles the different possible states of our component.

{{< tabs "fetch-transaction-render">}}
{{< tab-code title="src/App.js" filename="./tutorials/ethereum/track_tx/App.js" range="166:202" >}}
{{< /tabs >}}

## 9. Prettifying it with CSS

Add some CSS to style this html a bit. Replace the contents of `src/App.css` with the following:

{{< tabs "fetch-transaction-css">}}
{{< tab-code title="src/App.css" filename="./tutorials/ethereum/track_tx/App.css" range="1:83" >}}
{{< /tabs >}}

## 10. Full Working Example

The source code for this tutorial is available on GitHub. Here are the code files discussed on this page.

{{< tabs "fetch-transaction-full-app">}}
{{< tab-code title="src/App.js" filename="./tutorials/ethereum/track_tx/App.js" range="1:206" >}}
{{< tab-code title="src/App.css" filename="./tutorials/ethereum/track_tx/App.css" range="1:83" >}}
{{< /tabs >}}

{{< row-wrapper-end >}}
