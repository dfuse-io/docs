---
weight: 3
title: Track transaction in real-time (React/TypeScript)
---
# Track transaction in Realtime (React/JavaScript)
In this guide we will create a simple React application that will use dfuse's Transaction State Tracker API to keep track of the state of an ethereum transaction in realtime. We will be using {{< externalLink href="https://reactjs.org/docs/hooks-intro.html" title="react hooks">}}. 

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

## 2. Sign up to dfuse and get your api key

{{< note >}}
1. Visit {{< externalLink href="https://app.dfuse.io">}} and signup
2. Create an API key
    - Api Key: `transaction-tracker`
    - Category: `Web (Browser)`
    - Origin: `http://localhost:3000`
{{< /note >}}

## 3. Add the dfuse client library

The simplest way to get started with dfuse and JavaScript/TypeScript development is to use the dfuse JS client library. 

{{< tabs "adding-dfuse-client-lib">}}
{{< tab title="NPM" lang="shell" >}}
# https://www.npmjs.com/package/@dfuse/client
npm install --save @dfuse/client
{{< /tab >}}
{{< /tabs >}}

## Setting up starter code

Lets modify the application to display a form to search for a transaction. Replace the contents of `App.js` with the follow javascript code:

{{< tabs "starter-code-app-js-1">}}
{{< tab title="src/App.js" lang="javascript" >}}
import React, { useState } from 'react';
import './App.css';

function App() {

  const [transactionHash, setTransactionHash] = useState('');
  const [transitions, setTransitions] = useState([]);
  const [state, setState] = useState("initialize");
  const [error, setError] = useState("");
  
  const dfuseClient = null // initialize your dfuse client 
  
  let streamTransactionQuery = `ENTER TRANSACTION TRACKER QUERY HERE`

  async function fetchTransaction() {
    return (state === "completed");
  }
  
  function isCompleted(){
    return (state === "streaming");
  }
  
  function isStreaming(){
    // complete function
  }
  
  function renderTransition(key, previousState, currentState, transition, data) {
    return (
      <div className={"transition"} key={key}>
        <strong>Transition:</strong> {transition} <br/>
        <strong>Previous State:</strong> {previousState} <br/>
        <strong>Current State:</strong> {currentState} <br/>
        <pre key={transition.key}>  { JSON.stringify(data, null, 1) } </pre>
      </div>
    )
  }
  
  function renderData() {
      if(error !== ""){
        return null
      }
  
      return (
        <div>
          <label className={"state"}>{state}</label>
          <div>
            {
              transitions.map((transition) => (
                renderTransition(transition.key, transition.from, transition.to, transition.transition, transition.data)
              ))
            }
          </div>
        </div>
      )
   }
  
  function renderInfo() {
    return (
        <div>
            Enter a transaction hash to begin
        </div>
    )
  }
  
  function renderError() {
    if(error === ""){
       return null
    }
  
    return (
      <div className='error'>{ error }</div>
    )
  }

  return (
    <div className="App">
      <div className="form">
        <p>Enter a transaction hash</p>
        <input type={"text"} value={transactionHash} onChange={(e) => setTransactionHash(e.target.value)} className={'trx-id'} /> <br/>
        <button className={'submit'} onClick={() => fetchTransaction()}>Search Transaction</button>
      </div>
      <div className={"data"}>
        { renderError() }
        { (isStreaming() || isCompleted()) && renderData() }
        { !isStreaming() && renderInfo() }
      </div>
    </div>
  );
}

export default App;

{{< /tab >}}
{{< /tabs >}}


Lets also add some styling. Replace the content of `App.css` with the following `css`

{{< tabs "starter-code-app-css">}}
{{< tab title="src/App.css" lang="css" >}}
.App {
  text-align: left;
  width:1080px;
  margin:auto auto;
  display: flex;
  flex-direction: row;
}

.App .form {
  padding-top:50px;

  text-align: center;
}

.App .data {
  padding:50px;
  width: 100%;
}

.App .data pre {
  padding:10px;
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
}


.trx-id {
  padding: 18.5px 14px;
  height: 1.1875em;
  background: none;
  box-sizing: content-box;
  border:thin #878787 solid;
  width:300px;
  margin-bottom:10px;
}

.submit {
  color: #fff;
  height: 40px;
  font-size: 16px;
  box-shadow: none;
  line-height: 16px;
  padding-top: 10px;
  padding-left: 40px;
  border-radius: 20px;
  padding-right: 40px;
  padding-bottom: 10px;
  text-transform: none;
  background-color: #ff4660;
}

.transition {
  padding:7px;
  border-radius: 2px;
  background: #f8f8fa;
  border: thin solid #f8f9fa;
  margin-top: 10px;
  margin-bottom: 10px;

}
.error {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
  padding:20px;
  width: 100%;
}

.state {
  color: #fff;
  background-color: #17a2b8;
  display: inline-block;
  padding: .25em .4em;
  font-size: 75%;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: .25rem;
}
{{< /tab >}}
{{< /tabs >}}

Refreshing your application should see:

SCREENSHOT HERE

Import the necessary functions from `dfuse/client` a the top of `src/App.js`

{{< tabs "setting-up-dfuse-client1-import">}}
{{< tab-code title="src/App.js" filename="./tutorials/eth/track_tx/App.js" range=1:3 >}}
{{< /tabs >}}

Initialize the dfuse client using the API key you created in the first step. Lets create the `dfuseClient` right after the `function App()` declaration.   

{{< tabs "setting-up-dfuse-client1-initialize">}}
{{< tab-code title="src/App.js" filename="./tutorials/eth/track_tx/App.js" range=6:10 >}}
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
{{< tab-code title="src/App.js" filename="./tutorials/eth/track_tx/App.js" range=11:121 >}}
{{< /tabs >}}

## 6. Setup Our Hooks

Lets setup a few hooks that will help us keep track of our transaction states and render our component. We use {{< externalLink title="react state hook" href="https://reactjs.org/docs/hooks-state.html">}} to accomplish this.

* `transactionHash`: keeps track of the transaction's hash
* `transitions`: array that stores all the received transaction transitions
* `state`: store the current state of the graphql subscription
* `error`: store our errors
   
{{< tabs "setup-hooks">}}
{{< tab-code title="src/App.js" filename="./tutorials/eth/track_tx/App.js" range=123:126 >}}
{{< /tabs >}}

## 7. Get a transaction state

Lets create the `fetchTransaction` function that will use dfuse's JS client to execute the Graphql query we have crafted above. 

{{< tabs "fetch-transaction-func">}}
{{< tab title="src/App.js" lang="javascript" >}}
  ...
  async function fetchTransaction() {
    setState("streaming");          // sets the state of our query to "streaming"
    setError("");                   // clears any errors that may have been logged before
    setTransitions([]);             // clears the transitions when starting a new search
    var currentTransitions = [];    // local variable to store transition in callback function
    var count = 0;                  // reset transition count
  
   ...
  }
  ...
}
{{< /tab >}}
{{< /tabs >}}

Initialize a few state variables.

{{< tabs "fetch-transaction-init">}}
{{< tab title="src/App.js" lang="javascript" >}}
  ...
  async function fetchTransaction() {
    setState("streaming");          // sets the state of our query to "streaming"
    setError("");                   // clears any errors that may have been logged before
    setTransitions([]);             // clears the transitions when starting a new search
    var currentTransitions = [];    // local variable to store transition in callback function
    var count = 0;                  // reset transition count
    
    const stream = await client.graphql(streamTransactionQuery, (message) => {
        ...
    },{
     variables: {
        hash:  transactionHash
     }
   });
   
   await stream.join() // continues untils graphql subscription disconnects and/or completes
  }
  ...
}
{{< /tab >}}
{{< /tabs >}}

3. Let's create the handler that will process each transition. 
    - First we need to handle the case where graphql return an error in this case we simply store it in our `error` state variable:
    
    {{< code-block title="foo" lang="javascript" >}}
    if (message.type === "error") {
        setError(message.errors[0]['message'])
    }
    {{< /code-block >}}
    
    - If we get a message type `data` we create a `newTransition` object that will contain the relevant information that will be used for rendering. We increment our transition account, append the `newTransition` to our `currentTransitions` array and use that to update our `transitions` state variable.
    {{< code-block title="foo" lang="javascript" >}}var newTransition = {
        key: `transition-${count}`,
        transition: message['data']['trackTransactionState']['transition']['__typename'],
        from: message['data']['trackTransactionState']['previousState'],
        to: message['data']['trackTransactionState']['currentState'],
        data: message['data']
    };
    count++;
    currentTransitions = [...currentTransitions, newTransition]
    setTransitions(currentTransitions.reverse());{{< /code-block >}}
    
    - Finally we handle the complete message type
    {{< code-block title="foo" lang="javascript" >}}if (message.type === "complete") {
        setState("completed");
    }{{< /code-block >}}

Putting all this together we get the following functions
    
{{< tabs "fetch-transaction-3">}}
{{< tab title="src/App.js" lang="javascript" >}}
  ...
  async function fetchTransaction() {
    setState("streaming");          // sets the state of our query to "streaming"
    setError("");                   // clears any errors that may have been logged before
    setTransitions([]);             // clears the transitions when starting a new search
    var currentTransitions = [];    // local variable to store transition in callback function
    var count = 0;                  // reset transition count
    
    const stream = await client.graphql(streamTransactionQuery, (message) => {
   
     if (message.type === "error") {
       setError(message.errors[0]['message'])
     }
    
     if (message.type === "data") {
       var newTransition = {
         key: `transition-${count}`,
         transition: message['data']['trackTransactionState']['transition']['__typename'],
         from: message['data']['trackTransactionState']['previousState'],
         to: message['data']['trackTransactionState']['currentState'],
         data: message['data']
       };
       count++;
       currentTransitions = [...currentTransitions, newTransition]
       setTransitions(currentTransitions.reverse());
     }
    
     if (message.type === "complete") {
       setState("completed");
     }

    },{
     variables: {
        hash:  transactionHash
     }
   });
   
   await stream.join() // continues until graphql subscription disconnects and/or completes
  }
  ...
{{< /tab >}}
{{< /tabs >}}

The `message` returned from the graphql stream can have 3 different types that need to be handled in our code:

* `error`: This is an error return by the stream. We simply store it in our state.
* `data`: This contains the transition state tracker payload. We create a `newTransition` object and store in our transitions array.  
* `complete`: This message occurs when the stream is closed. We update our stream state.

{{< tabs "fetch-transaction-func-handler">}}
{{< tab-code title="src/App.js" filename="./tutorials/eth/track_tx/App.js" range=128:164 >}}
{{< /tabs >}}

## 8. Render function

Build the `render` method for this component. It will include an input for the transaction hash, and handles the different possible states of our component.

{{< tabs "fetch-transaction-render">}}
{{< tab-code title="src/App.js" filename="./tutorials/eth/track_tx/App.js" range=166:202 >}}
{{< /tabs >}}

- `function isCompleted()`: This returns `true` when the state of our GraphQL subscription is completed 
- `function isStreaming()`: This returns `true` when the state of our GraphQL subscription is streaming, a.k.a we are receiving messages. 
- `renderTransition(key, previousState, currentState, transition, data)`: This function renders a given transition
- `renderData()`: This function renders the wrapper and the transitions
- `renderInfo()`: This function renders a small information wrapper to initiate our UI
- `renderError()`: This is a helper function to render our errors

Add some CSS to style this html a bit. Replace the contents of `src/App.css` with the following:

{{< tabs "fetch-transaction-css">}}
{{< tab-code title="src/App.css" filename="./tutorials/eth/track_tx/App.css" range=1:83 >}}
{{< /tabs >}}

## 10. Full Working Example

The source code for this tutorial is available on github. Here are the code files discussed on this page.

{{< tabs "fetch-transaction-full-app">}}
{{< tab-code title="src/App.js" filename="./tutorials/eth/track_tx/App.js" range=1:206 >}}
{{< tab-code title="src/App.css" filename="./tutorials/eth/track_tx/App.css" range=1:83 >}}
{{< /tabs >}}
