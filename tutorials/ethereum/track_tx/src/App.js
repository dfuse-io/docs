import React, { useState } from 'react';
import { createDfuseClient } from '@dfuse/client';
import './App.css';

function App() {
  const dfuseClient = createDfuseClient({
    /* Replace with your own dfuse API key */
    apiKey: 'web_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    network: 'mainnet.eth.dfuse.io'
  });

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

  const [transactionHash, setTransactionHash] = useState('');
  const [transitions, setTransitions] = useState([]);
  const [state, setState] = useState('initialize');
  const [error, setError] = useState('');

  async function fetchTransaction() {
    setState('streaming');
    setError('');
    setTransitions([]);
    var currentTransitions = [];
    var count = 0;

    const stream = await dfuseClient.graphql(
      streamTransactionQuery,
      message => {
        if (message.type === 'error') {
          setError(message.errors[0]['message']);
        }

        if (message.type === 'data') {
          var newTransition = {
            key: `transition-${count}`,
            transition:
              message['data']['transactionLifecycle']['transitionName'],
            from: message['data']['transactionLifecycle']['previousState'],
            to: message['data']['transactionLifecycle']['currentState'],
            data: message['data']
          };
          count++;
          currentTransitions = [...currentTransitions, newTransition];
          setTransitions(currentTransitions.reverse());
        }

        if (message.type === 'complete') {
          setState('completed');
        }
      },
      {
        variables: {
          hash: transactionHash
        }
      }
    );

    await stream.join(); // awaits stream completion, which is never for this operation
  }

  return (
    <div className='App'>
      <div className='form'>
        <p>Enter a transaction hash</p>
        <input
          type={'text'}
          value={transactionHash}
          onChange={e => setTransactionHash(e.target.value)}
          className={'trx-id'}
        />{' '}
        <br />
        <button className='submit' onClick={() => fetchTransaction()}>
          Search Transaction
        </button>
      </div>
      <div className='data'>
        {error !== '' && <div className='error'>{error}</div>}
        {error === '' && (state === 'streaming' || state === 'completed') && (
          <div>
            <label className='state'>{state}</label>
            <div>
              {transitions.map(transition => (
                <div className='transition' key={transition.key}>
                  <strong>Transition:</strong> {transition.transition} <br />
                  <strong>Previous State:</strong> {transition.from} <br />
                  <strong>Current State:</strong> {transition.to} <br />
                  <pre key={transition.key}>
                    {' '}
                    {JSON.stringify(transition.data, null, 1)}{' '}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}
        {state !== 'streaming' && <div>Enter a transaction hash to begin</div>}
      </div>
    </div>
  );
}

export default App;
