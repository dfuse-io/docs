import React, { useState } from 'react';
import { createDfuseClient } from '@dfuse/client';
import './App.css';

function App() {
  const dfuseClient = createDfuseClient({
    apiKey: '<YOUR API KEY HERE>',
    network: 'mainnet.eth.dfuse.io'
  });

  const searchTransactionsQuery = `subscription ($query: String!, $indexName: TRANSACTIONS_INDEX_NAME! $cursor: String!, $lowBlockNum: Int64!, $highBlockNum: Int64!, $limit: Int64!, $sort: SORT!) {
    searchTransactions(indexName: $indexName, query: $query, lowBlockNum: $lowBlockNum, highBlockNum: $highBlockNum, cursor: $cursor, limit: $limit, sort: $sort) {
      cursor
      undo
      node {
        value(encoding:WEI)
        hash
        nonce
        gasLimit
        gasUsed
        gasPrice(encoding:WEI)
        to
        block {
          number
          hash
          header {
            timestamp
          }
        }
        flatCalls {
          ...FlatCallFragment
        }
      }
    }
  }
  
  fragment FlatCallFragment on Call {
    index
    depth
    parentIndex
    callType
    from
    to
    value(encoding:WEI)
    gasConsumed
    inputData
    returnData
    logs {
      address
      topics
      data
    }
    balanceChanges{
      reason
      address
      oldValue(encoding:WEI)
      newValue(encoding:WEI)
    }
    storageChanges{
      key
      address
      oldValue
      newValue
    }
  }`;

  const [query, setQuery] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [state, setState] = useState('initialize');
  const [error, setError] = useState('');

  function parseSQE(input) {
    return {
      query: input.trim()
    };
  }

  async function searchTransactions() {
    setState('searching');
    setError('');
    setTransactions([]);
    let currentResults = [];
    const parsedSQE = parseSQE(query);

    const stream = await dfuseClient.graphql(
      searchTransactionsQuery,
      message => {
        if (message.type === 'error') {
          setError(message.errors[0]['message']);
        }

        if (message.type === 'data') {
          currentResults = [
            message.data.searchTransactions.node,
            ...currentResults
          ];
          setTransactions(currentResults);
        }

        if (message.type === 'complete') {
          setState('completed');
        }
      },
      {
        variables: {
          query: parsedSQE.query,
          indexName: 'CALLS',
          lowBlockNum: 0,
          highBlockNum: -1,
          sort: 'ASC',
          limit: 25,
          cursor: ''
        }
      }
    );

    await stream.join();
  }

  return (
    <div className='App'>
      <div className='form'>
        <p>Search Ethereum Data</p>
        <input
          type={'text'}
          value={query}
          onChange={e => setQuery(e.target.value)}
          className={'trx-id'}
          placeholder='Enter search query'
        />{' '}
        <br />
        <button className='submit' onClick={() => searchTransactions()}>
          Run search
        </button>
        <hr />
        <a
          href='https://docs.dfuse.io/guides/core-concepts/search-query-language/'
          target='_blank'
        >
          Search Language Reference
        </a>
        <br />
        <a
          href='https://docs.dfuse.io/reference/ethereum/search-terms/'
          target='_blank'
        >
          Ethereum Search Terms
        </a>
      </div>
      <div className='data'>
        {state !== 'searching' && <p>Enter a search query to begin</p>}
        {error !== '' && <div className='error'>{error}</div>}
        <br />
        {error === '' && (state === 'searching' || state === 'completed') && (
          <div>
            <label className='state'>{state}</label>
            <div>
              {transactions.map((transaction, index) => (
                <div className='transaction' key={index}>
                  <pre key={index}>{JSON.stringify(transaction, null, 1)}</pre>
                  <hr />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
