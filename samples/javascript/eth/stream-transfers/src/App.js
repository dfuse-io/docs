import React, { Component } from 'react';
import { createDfuseClient } from '@dfuse/client';

import './App.css';

const apiKey = process.env.REACT_APP_DFUSE_API_KEY;
const network = process.env.REACT_APP_DFUSE_NETWORK || 'mainnet.eth.dfuse.io';

class App extends Component {
  state = {
    connected: false,
    errorMessages: [],
    transfers: []
  };

  constructor() {
    super();

    this.stream = undefined;
    this.client = createDfuseClient({
      apiKey,
      network,
      streamClientOptions: {
        socketOptions: {
          onClose: this.onClose,
          onError: this.onError
        }
      }
    });

    this.streamTransfer = `subscription($cursor: String) {
      searchTransactions(indexName: CALLS, query: "method:'transfer(address,uint256)'", cursor: $cursor) {
        undo cursor
        node { hash from to value(encoding: ETHER) }
      }
    }`;
  }

  componentWillUnmount() {
    if (this.stream !== undefined) {
      this.stream.close();
    }
  }

  launch = async () => {
    if (!apiKey) {
      const messages = [
        'To correctly run this sample, you need to defined an environment variable',
        "named 'REACT_APP_DFUSE_API_KEY' with the value being your dfuse API token.",
        '',
        'To make it into effect, define the variable before starting the development',
        'scripts, something like:',
        '',
        'REACT_APP_DFUSE_API_KEY=web_....',
        '',
        'You can obtain a free API key by visiting https://dfuse.io'
      ];

      this.setState({
        connected: false,
        errorMessages: messages,
        transactions: []
      });
      return;
    }

    this.setState({ errorMessages: [], transfers: [] });

    try {
      this.stream = await this.client.graphql(
        this.streamTransfer,
        this.onMessage
      );
    } catch (error) {
      this.setState({
        errorMessages: ['Unable to connect to socket.', JSON.stringify(error)]
      });
    }
  };

  onMessage = async message => {
    if (message.type === 'error') {
      this.setState({
        errorMessages: [
          'An error occurred',
          ...message.errors.map(error => error.message)
        ]
      });
    }

    if (message.type === 'data') {
      this.setState({ connected: true });
      const transfer = message.data.searchTransactions.node;

      this.setState(prevState => ({
        transfers: [...prevState.transfers.slice(-100), transfer]
      }));
      const { cursor } = message.data.searchTransactions;
      this.stream.mark({ cursor });
    }

    if (message.type === 'complete') {
      console.log('Stream completed');
    }
  };

  stop = async () => {
    if (this.stream === undefined) {
      return;
    }

    try {
      await this.stream.close();
      this.stream = undefined;
    } catch (error) {
      this.setState({
        errorMessages: [
          'Unable to disconnect socket correctly.',
          JSON.stringify(error)
        ]
      });
    }
  };

  onClose = () => {
    this.setState({ connected: false });
  };

  onError = error => {
    this.setState({
      errorMessages: [
        'An error occurred with the socket.',
        JSON.stringify(error)
      ]
    });
  };

  renderTransfer = (transfer, index) => {
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

  renderTransfers() {
    return (
      <div className='App-infinite-container'>
        {this.state.transfers.length <= 0
          ? this.renderTransfer('Nothing yet, start by hitting Launch!')
          : this.state.transfers.reverse().map(this.renderTransfer)}
      </div>
    );
  }

  renderError = (error, index) => {
    if (error === '') {
      return <br key={index} className='App-error' />;
    }

    return (
      <code key={index} className='App-error'>
        {error}
      </code>
    );
  };

  renderErrors() {
    if (this.state.errorMessages.length <= 0) {
      return null;
    }

    return (
      <div className='App-container'>
        {this.state.errorMessages.map(this.renderError)}
      </div>
    );
  }

  render() {
    return (
      <div className='App'>
        <header className='App-header'>
          <h2>Stream Ethereum Transfers</h2>
          {this.renderErrors()}
          <div className='App-buttons'>
            <button className='App-button' onClick={this.launch}>
              Launch
            </button>
            <button className='App-button' onClick={this.stop}>
              Stop
            </button>
          </div>
          <main className='App-main'>
            <p className='App-status'>
              {`Connected: ${
                this.state.connected
                  ? 'Connected (Showing last 100 transfers)'
                  : 'Disconnected'
              }`}
            </p>
            {this.renderTransfers()}
          </main>
        </header>
      </div>
    );
  }
}

export default App;
