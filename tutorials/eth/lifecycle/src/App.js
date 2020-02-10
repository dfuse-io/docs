// CODE:BEGIN:tutorials_eth_lifecycle_js_section1
// CODE:BEGIN:tutorials_eth_lifecycle_js_section2
import React, { useState } from 'react';
import { createDfuseClient } from "@dfuse/client"
import './App.css';
// CODE:END:tutorials_eth_lifecycle_js_section2

function App() {
// CODE:BEGIN:tutorials_eth_lifecycle_js_section3
    const dfuseClient = createDfuseClient({
        apiKey: "<YOUR_API_KEY_HERE>",
        network: "mainnet.eth.dfuse.io"
    });
// CODE:END:tutorials_eth_lifecycle_js_section3

// CODE:BEGIN:tutorials_eth_lifecycle_js_section4
    let streamTransactionQuery = `
     subscription($hash: String!){
      transactionLifecycle(hash: $hash){
        previousState
        currentState
        transitionName
        transition{
          __typename

        ... on TrxTransitionInit {
            transaction {
            ...TransactionFragment
            }
            blockHeader {
            ...BlockHeaderFragment
            }
            trace {
            ...TransactionTraceFragment
            }
            confirmations
            replacedById
          }

        ...on TrxTransitionPooled {
            transaction {
            ...TransactionFragment
            }
          }

        ...on TrxTransitionMined {
            blockHeader {
            ...BlockHeaderFragment
            }
            trace {
            ...TransactionTraceFragment
            }
            confirmations
          }

        ...on TrxTransitionForked {
            transaction {
            ...TransactionFragment
            }
          }

        ...on TrxTransitionConfirmed {
            confirmations
          }

        ...on TrxTransitionReplaced {
            replacedById
          }

        }
      }
    }

    fragment TransactionFragment on Transaction {
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

    fragment TransactionTraceFragment on TransactionTrace {
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

    fragment BlockHeaderFragment on BlockHeader {
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
// CODE:END:tutorials_eth_lifecycle_js_section4

// CODE:BEGIN:tutorials_eth_lifecycle_js_section5
    const [transactionHash, setTransactionHash] = useState('');
    const [transitions, setTransitions] = useState([]);
    const [state, setState] = useState("initialize");
    const [error, setError] = useState("");
// CODE:END:tutorials_eth_lifecycle_js_section5

// CODE:BEGIN:tutorials_eth_lifecycle_js_section6
    async function fetchTransaction() {
        setState("streaming");
        setError("");
        setTransitions([]);
        var currentTransitions = [];
        var count = 0;

        const stream = await dfuseClient.graphql(streamTransactionQuery, (message) => {

            if (message.type === "error") {
                setError(message.errors[0]['message'])
            }

            if (message.type === "data") {
                var newTransition = {
                    key: `transition-${count}`,
                    transition: message['data']['transactionLifecycle']['transitionName'],
                    from: message['data']['transactionLifecycle']['previousState'],
                    to: message['data']['transactionLifecycle']['currentState'],
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

        await stream.join() // awaits stream completion, which is never for this operation
    }
// CODE:END:tutorials_eth_lifecycle_js_section6

// CODE:BEGIN:tutorials_eth_lifecycle_js_section7
    return (
        <div className="App">
            <div className="form">
                <p>Enter a transaction hash</p>
                <input type={"text"} value={transactionHash} onChange={(e) => setTransactionHash(e.target.value)} className={'trx-id'} /> <br/>
                <button className="submit" onClick={() => fetchTransaction()}>Search Transaction</button>
            </div>
            <div className="data">
                {   (error !== "") && (<div className='error'>{ error }</div>) }
                {   (error === "") &&
                    ((state === "streaming") ||  (state === "completed")) &&
                    (
                        <div>
                            <label className="state">{state}</label>
                            <div>
                                {
                                    transitions.map((transition) => (
                                        <div className="transition" key={transition.key}>
                                            <strong>Transition:</strong> {transition.transition} <br/>
                                            <strong>Previous State:</strong> {transition.from} <br/>
                                            <strong>Current State:</strong> {transition.to} <br/>
                                            <pre key={transition.key}>  { JSON.stringify(transition.data, null, 1) } </pre>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    )
                }
                {   (state !== "streaming") &&
                    (
                        <div>Enter a transaction hash to begin</div>
                    )
                }
            </div>
        </div>
    );
}
// CODE:END:tutorials_eth_lifecycle_js_section7

export default App;
// CODE:END:tutorials_eth_lifecycle_js_section1