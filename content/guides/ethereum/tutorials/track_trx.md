---
weight: 3
title: Track transaction in real-time (React/TypeScript) 
---

# Track transaction in Realtime (React/Javascript)

## Create React App
We will use the {{< externalLink href="https://github.com/facebook/create-react-app">}} to sets up your development environment so that you can use the latest JavaScript features. You’ll need to have Node >= 8.10 and npm >= 5.6 on your machine. To create a project, run:

{{< tabs "create-react-app">}}
{{< tab title="Shell" lang="shell" >}}
# get create-react-app: https://github.com/facebook/create-react-app
npx create-react-app track-trx
cd track-trx
npm start
{{< /tab >}}
{{< /tabs >}}

then open ({{< externalLink href="http://localhost:3000/">}})

## Sign up to dfuse and get your api key

{{< note >}}
1. Visit {{< externalLink href="https://app.dfuse.io">}} and signup
2. Create an API key
    - Api Key: `transaction-tracker`
    - Cateogry: `Web (Browser)`
    - Origin: `http://localhost:3000`
{{< /note >}}

## import the dfuse typescript client library

{{< tabs "create-react-app-import">}}
{{< tab title="Shell" lang="shell" >}}
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

  let streamTransactionQuer = `ENTER TRANSACTION TRACKER QUERY HERE`

  function fetchTransaction() {
    // complete function
  }

  return (
    <div className="App">
      <p>Enter a transaction hash</p>
      <input type={"text"} value={transactionHash} onChange={(e) => setTransactionHash(e.target.value)} className={'trx-id'} /> <br/>
      <button className={'submit'} onClick={() => fetchTransaction()}>Search Transaction</button>
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
  text-align: center;
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
{{< /tab >}}
{{< /tabs >}}

Refreshing your application should see:

SCREENSHOT HERE

## Setting up dfuse client

Let initialize the dfuse client. First lets import the necessary functions from `dfuse/client` a the top of `src/App.js`

{{< tabs "starter-code-app-js-import">}}
{{< tab title="src/App.js" lang="javascript" >}}
import React, { useState } from 'react';
import { createDfuseClient, waitFor } from "@dfuse/client"
import './App.css';
...

{{< /tab >}}
{{< /tabs >}}

. Replace the code: 

`const dfuseClient = null // initialize your dfuse client` 

with the following code and replacing `DFUSE_API_KEY` with the API key you got in the prior step 


{{< tabs "starter-code-app-js">}}
{{< tab title="src/App.js" lang="javascript" >}}
...
const dfuseClient = createDfuseClient({
apiKey: 'DFUSE_API_KEY',
        network: 'mainnet.eth.dfuse.io'
});
...
{{< /tab >}}
{{< /tabs >}}

const dfuseClient = null // initialize your dfuse client

## Write the transaction tracker query

To get a real-time feed of transaction state changes we need to craft a GraphQL subscription query.  A GraphQL subscription will continuously stream responses.

{{< note >}}
See {{< externalLink title="Graphql Concept" href="/guides/core-concepts/graphql/">}} for more information about GraphQL
{{< /note >}}

Our GraphQL query will use the `trackTransactionState` with a `hash` filter to retrieve the states changes of our specific transaction.

{{< tip >}}
Do not worry this query may see intimidating but we it breakdown in detail in  {{< externalLink title="Transaction State Tracker Concept" href="/guides/ethereum/concepts/trx_state_tracker/">}}
{{< /tip >}}


Lets replace:
 
 ```let streamTransactionQuery = `ENTER GRAPHQL QUERY`;```
 
with: 

{{< tabs "starter-code-graphql">}}
{{< tab title="GraphQL Query" lang="javascript" >}}
let streamTransactionQuery = `
  subscription{
    trackTransactionState(hash: "0x665095a3d745f7ef91f85b402bcb981d2b54fc8b3756544cb869227175fd2aa4"){
      previousState
      currentState
      transition{
        __typename

      ... on TrxTransitionInit {
          transaction {
          ...transactionFields
          }
          blockHeader {
          ...bloackHeaderFields
          }
          traces {
          ...transactionTraceFields
          }
          confirmations
          shadowedById
        }

      ...on TrxTransitionReceived {
          transaction {
          ...transactionFields
          }
        }

      ...on TrxTransitionMined {
          blockHeader {
          ...bloackHeaderFields
          }
          traces {
          ...transactionFields
          }
          confirmations
        }

      ...on TrxTransitionForked {
          transaction {
          ...transactionFields
          }
        }

      ...on TrxTransitionConfirmed {
          confirmations
        }

      ...on TrxTransitionReplaced {
          shadowedById
        }

      }
    }
  }

  fragment transactionFields on Transaction {
    hash
    from
    to
    nonce
    gasPrice
    gasLimit
    value
    inputData
    signature {
      v
      s
      r
    }
  }

  fragment transactionTraceFields on TransactionTrace {
    hash
    from
    to
    nonce
    gasPrice
    gasLimit
    value
    inputData
    signature {
      v
      s
      r
    }
    cumulativeGasUsed
    publicKey
    index
    create
    outcome
  }

  fragment bloackHeaderFields on BlockHeader {
    parentHash
    unclesHash
    coinbase
    stateRoot
    transactionsRoot
    receiptRoot
    logsBloom
    difficulty
    number
    gasLimit
    gasUsed
    timestamp
    extraData
    mixHash
    nonce
    hash
  }`;
{{< /tab >}}
{{< /tabs >}}



 