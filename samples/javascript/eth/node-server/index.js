const { createDfuseClient, waitFor } = require('@dfuse/client');

if (process.env.DFUSE_API_KEY == null) {
  console.log(
    'You must define an enviorment variable DFUSE_API_KEY containing your API key to run this sample.'
  );
  process.exit(1);
}

global.fetch = require('node-fetch');
global.WebSocket = require('ws');

async function main() {
  const client = createDfuseClient({
    apiKey: process.env.DFUSE_API_KEY,
    network: 'mainnet.eth.dfuse.io'
  });

  const streamEthTransfers = `subscription ($limit: Int64!) {
      searchTransactions(indexName: CALLS, query: "-value:0 ", limit: $limit, sort: ASC, cursor: "") {
        cursor
        node { hash from to value }
      }
    }`;

  console.log('Streaming the last 10 transactions with non-zero value')
  const stream = await client.graphql(
    streamEthTransfers,
    message => {

      if (message.type === 'error') {
        console.log('An error occurred', message.errors, message.terminal);
      }

      if (message.type === 'data') {
        const { cursor, node } = message.data.searchTransactions;
        console.log(`Transfer [${node.from} -> ${node.to}, ${node.value}]`);

        stream.mark({ cursor });
      }

      if (message.type === 'complete') {
        console.log('Stream completed');
      }
    },
    {
      variables: { limit: '10' }
    }
  );

  await waitFor(5000);
  stream.close();
}

main()
  .then(() => {
    console.log('Completed');
    process.exit(0);
  })
  .catch(error => {
    console.log('An error occurred', error);
    process.exit(1);
  });
