// CODE:BEGIN:tutorials_eth_search_js_section1
// CODE:BEGIN:tutorials_eth_search_js_section2
import React, { useState } from 'react';
import { createDfuseClient } from '@dfuse/client';
import './App.css';
// CODE:END:tutorials_eth_search_js_section2

function App() {
// CODE:BEGIN:tutorials_eth_search_js_section3
  const dfuseClient = createDfuseClient({
    apiKey: '<YOUR API KEY HERE>',
    network: 'mainnet.eth.dfuse.io'
  });
// CODE:END:tutorials_eth_search_js_section3

// CODE:BEGIN:tutorials_eth_search_js_section4
  const FlatCallFragment = `fragment FlatCallFragment on Call {
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
  }
  `;

  const searchTransactionsQuery = `query ($query: String!, $indexName:TRANSACTIONS_INDEX_NAME!, $lowBlockNum: Int64, $highBlockNum: Int64, $sort: SORT!, $cursor: String!, $limit: Int64!){
    searchTransactions(query: $query, indexName: $indexName, lowBlockNum: $lowBlockNum, highBlockNum: $highBlockNum, sort: $sort,  cursor: $cursor, limit: $limit) {
      pageInfo {
        startCursor
        endCursor
      }
      edges {
        undo
        cursor
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
  }
  
  ${FlatCallFragment}`;
// CODE:END:tutorials_eth_search_js_section4

// CODE:BEGIN:tutorials_eth_search_js_section5
  const [query, setQuery] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [state, setState] = useState('initialize');
  const [error, setError] = useState('');
// CODE:END:tutorials_eth_search_js_section5

  function parseSQE(input) {
    return {
      query: input.trim()
    };
  }

// CODE:BEGIN:tutorials_eth_search_js_section6
  async function searchTransactions() {
    setTransactions([]);
    setState('searching');
    setError('');
    const parsedSQE = parseSQE(query);
    try {
      const response = await dfuseClient.graphql(searchTransactionsQuery, {
        variables: {
          query: parsedSQE.query,
          indexName: 'CALLS',
          lowBlockNum: '0',
          highBlockNum: '-1',
          sort: 'DESC',
          limit: '10',
          cursor: ''
        }
      });

      if (response.errors) {
        throw response.errors;
      }

      const edges = response.data.searchTransactions.edges || [];
      if (edges.length <= 0) {
        setError('Oops nothing found');
        return;
      }
      setTransactions(edges.map(edge => edge.node));
      setState('completed');
    } catch (errors) {
      setError(JSON.stringify(errors));
      setState('completed');
    }

    dfuseClient.release();
  }
// CODE:END:tutorials_eth_search_js_section6

// CODE:BEGIN:tutorials_eth_search_js_section7
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
// CODE:END:tutorials_eth_search_js_section7

export default App;
// CODE:END:tutorials_eth_search_js_section1