// CODE:BEGIN:tutorials_eth_stream_js_section8
// CODE:BEGIN:tutorials_eth_stream_js_section1
import React, { useState } from 'react';
import { createDfuseClient } from '@dfuse/client';
import './App.css';
// CODE:END:tutorials_eth_stream_js_section1

const apiKey = process.env.REACT_APP_DFUSE_API_KEY;
const network = process.env.REACT_APP_DFUSE_NETWORK || 'mainnet.eth.dfuse.io';

function App() {
  // CODE:BEGIN:tutorials_eth_stream_js_section2
  const dfuseClient = createDfuseClient({
    apiKey,
    network,
    streamClientOptions: {
      socketOptions: {
        onClose: onClose,
        onError: onError
      }
    }
  });
  // CODE:END:tutorials_eth_stream_js_section2

  // CODE:BEGIN:tutorials_eth_stream_js_section3
  const streamTransfersQuery = `subscription($cursor: String) {
      searchTransactions(indexName: CALLS, query: "-value:0", sort: ASC, limit: 100, cursor: $cursor) {
        undo cursor
        node { hash from to value(encoding: ETHER) }
      }
    }`;
  // CODE:END:tutorials_eth_stream_js_section3

  // CODE:BEGIN:tutorials_eth_stream_js_section4
  const [transfers, setTransfers] = useState([]);
  const [state, setState] = useState('initialize');
  const [errors, setErrors] = useState([]);
  const [stream, setStream] = useState(undefined);
  // CODE:END:tutorials_eth_stream_js_section4

  // CODE:BEGIN:tutorials_eth_stream_js_section5
  const streamTransfers = async () => {
    setTransfers([]);
    setErrors([]);
    setState('connected');
    setErrors('');
    let currentTransfers = [];
    try {
      const stream = await dfuseClient.graphql(
        streamTransfersQuery,
        async message => {
          if (message.type === 'error') {
            setErrors([
              'An error occurred',
              ...message.errors.map(error => error.message),
              ...errors
            ]);
          }

          if (message.type === 'data') {
            const {
              node: newTransfer,
              cursor
            } = message.data.searchTransactions;

            currentTransfers = [newTransfer, ...currentTransfers];
            setTransfers(currentTransfers);
            stream.mark({ cursor });
          }

          if (message.type === 'complete') {
            setState('completed');
          }
        }
      );
      setStream(stream);
    } catch (errors) {
      setErrors(JSON.stringify(errors));
      setState('completed');
    }
  };
  // CODE:END:tutorials_eth_stream_js_section5

  // CODE:BEGIN:tutorials_eth_stream_js_section6
  const onStop = async () => {
    setState('completed');
    if (stream === undefined) {
      return;
    }
    try {
      await stream.close();
      setStream(undefined);
    } catch (error) {
      setErrors(
        `Unable to disconnect socket correctly: 
          ${JSON.stringify(error)}
        `
      );
    }
  };

  const onClose = () => {
    setState('completed');
  };

  const onError = error => {
    setErrors(
      `Unable to disconnect socket correctly: 
      ${JSON.stringify(error)}
    `
    );
  };
  // CODE:END:tutorials_eth_stream_js_section6

  // CODE:BEGIN:tutorials_eth_stream_js_section7
  const renderTransfer = (transfer, index) => {
    const { hash, from, to, value } = transfer;
    return hash ? (
      <code key={index} className='App-transfer'>
        Transfer
        <br />
        {`From: ${from} -> To: ${to}`}
        <br />
        {`Value: ${value} Hash: ${hash}`}
        <hr />
      </code>
    ) : (
      <code key={index} className='App-transfer'>
        {transfer}
      </code>
    );
  };

  const renderTransfers = () => {
    return (
      <div className='App-infinite-container'>
        {transfers.length <= 0
          ? renderTransfer('Nothing yet, start by hitting Launch!')
          : transfers.reverse().map(renderTransfer)}
      </div>
    );
  };

  const renderError = (error, index) => {
    if (error === '') {
      return <br key={index} className='App-error' />;
    }

    return (
      <code key={index} className='App-error'>
        {error}
      </code>
    );
  };

  const renderErrors = () => {
    if (errors.length <= 0) {
      return null;
    }

    return <div className='App-container'>{errors.map(renderError)}</div>;
  };

  return (
    <div className='App'>
      <header className='App-header'>
        <h2>Stream Ethereum Transfers</h2>
        {renderErrors()}
        <div className='App-buttons'>
          <button className='App-button' onClick={streamTransfers}>
            Launch
          </button>
          <button className='App-button' onClick={onStop}>
            Stop
          </button>
        </div>
        <main className='App-main'>
          <p className='App-status'>
            {`Connected: ${
              state === 'connected'
                ? 'Connected (Showing last 100 transfers)'
                : 'Disconnected'
            }`}
          </p>
          {renderTransfers()}
        </main>
      </header>
    </div>
  );
}
// CODE:END:tutorials_eth_stream_js_section7

export default App;
// CODE:END:tutorials_eth_stream_js_section8