import {
  createDfuseClient,
  Stream,
  DfuseClient,
  GraphqlStreamMessage
} from '@dfuse/client';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import * as path from 'path';

(global as any).WebSocket = ws;
(global as any).fetch = nodeFetch;

if (process.env.DFUSE_API_KEY == null) {
  console.log('Missing DFUSE_API_KEY environment variable');
  process.exit(1);
}

/**
 * In this example, we will showcase how to implement bulletproof
 * data integrity while using the dfuse GraphQL Stream by ensuring
 * you never miss a single beat.
 *
 * This pattern can be used when you want to process messages only
 * once, while still ensuring you correctly receive all the blocks,
 * transactions and actions you want to process.
 *
 * We go through an example of how to easily mark the stream progress
 * and how the marker is then used when the socket reconnects to
 * restart the stream at the exact location you need.
 *
 * In the example we will implement an action persistence storer,
 * having our code restart at the exact correct place a commit had
 * occurred.
 */
const LAST_CURSOR_FILENAME = 'last_cursor.txt';

async function main() {
  const client = createDfuseClient({
    apiKey: process.env.DFUSE_API_KEY!,
    network: 'mainnet.eth.dfuse.io',
    graphqlStreamClientOptions: {
      socketOptions: {
        reconnectDelayInMs: 250
      }
    }
  });

  const engine = new Engine(client);
  await engine.run();

  client.release();
}



async function main() {
  await dfuseClient.getTokenInfo();

  const subscriptionClient = new SubscriptionClient(
    dfuseClient.endpoints.graphqlStreamUrl,
    {
      lazy: true,
      connectionCallback: (error?: any) => {
        if (error) {
          console.log('Unable to correctly initialize connection', error);
          process.exit(1);
        }
      },
      connectionParams: async () => {
        const { token } = await dfuseClient.getTokenInfo();

        return {
          Authorization: `Bearer ${token}`
        };
      }
    },
    ws
  );

  const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: new WebSocketLink(subscriptionClient)
  });

  const startBlock = 9330000;
  const stopBlock = 9340000;

  let activeCursor = '';
  let supplyCount = 0;
  let withdrawCount = 0;
  let transactionCount = 0;
  let startTime = Date.now();
  let logInterval = 10;
  let lastBlockSeen = startBlock;
  let lastConnectTime = Date.now();
  let lastReconnectingTime = Date.now();
  let lastDisconnectedTime = Date.now();
  let connectedOnce = false;

  const logStats = () => {
    const elapsed = Date.now() - startTime;
    const blockCount = lastBlockSeen - startBlock;

    console.log(
      `[Block Count: ${blockCount}, Transactions: ${transactionCount}, Supplies: ${supplyCount}, Withdraws: ${withdrawCount}, Elapsed: ${humanizeDuration(
        elapsed
      )}, Block: ${lastBlockSeen}]`
    );
    console.log();
  };

  let activeResolve = undefined;
  let activeReject = undefined;
  let activeSubscription = undefined;

  const promise = new Promise((resolve, reject) => {
    activeResolve = resolve;
    activeReject = reject;
  });

  subscriptionClient.onConnecting((...args: any) => {
    console.log('Connecting', ...args);
  });
  subscriptionClient.onConnected((...args) => {
    lastConnectTime = Date.now();

    if (!connectedOnce) {
      console.log('Connected', ...args);
      connectedOnce = true;
    } else {
      console.log(
        `Reconnected at block ${lastBlockSeen} with ${activeCursor} (reconnection time ${humanizeDuration(
          Date.now() - lastReconnectingTime
        )})`,
        ...args
      );
    }
  });

  subscriptionClient.onDisconnected((...args: any) => {
    if (activeSubscription) {
      activeSubscription.unsubscribe();
    }

    console.log(
      `Disconnected (last session lasted ${humanizeDuration(
        Date.now() - lastConnectTime
      )}`,
      ...args
    );
    lastDisconnectedTime = Date.now();
    lastConnectTime = Date.now();

    setTimeout(() => {
      console.log(
        `Reconnecting (disconnecting time ${humanizeDuration(
          Date.now() - lastDisconnectedTime
        )})`,
        ...args
      );
      lastReconnectingTime = Date.now();
      subscribe();
    }, 500);
  });

  subscriptionClient.onError(error => {
    console.log('Error', error.type, error.message);
  });

  const subscribe = () => {
    activeSubscription = apolloClient
      .subscribe({
        query: gql`
          subscription(
            $startBlock: Int64!
            $stopBlock: Int64!
            $cursor: String!
          ) {
            searchTransactions(
              indexName: CALLS
              # we are monitoring two contract method signatures
              # 0xf2b9fdb8 is the method hexSignature for supply(address, uint256)
              # 0xf3fef3a3 is the method hexSignature for withdraw(address uint256)
              query: "(method:f2b9fdb8 OR method:f3fef3a3)"
              cursor: $cursor
              lowBlockNum: $startBlock
              highBlockNum: $stopBlock
            ) {
              undo
              cursor
              block {
                number
              }
              node {
                hash
                inputData
                from
                to
                value
              }
            }
          }
        `,
        variables: {
          startBlock,
          stopBlock,
          cursor: activeCursor
        }
      })
      .subscribe({
        next: value => {
          const message = value.data.searchTransactions;
          const blockNum = message.block.number;

          lastBlockSeen = blockNum;

          const hexSignature = message.node.inputData.slice(2, 10);
          if (hexSignature !== 'f2b9fdb8' && hexSignature !== 'f3fef3a3')
            return;
          if (hexSignature === 'f2b9fdb8') {
            console.log(`Found supply method call`);
            supplyCount++;
            transactionCount++;
          }
          if (hexSignature === 'f3fef3a3') {
            console.log(`Found withdraw method call`);
            withdrawCount++;
            transactionCount++;
          }
          activeCursor = message.cursor;
          if (transactionCount % logInterval === 0) {
            console.log(
              `Results so far: ${transactionCount}, (current cursor ${activeCursor})...`
            );
            logStats();
          }
        },
        error: error => {
          activeReject(error);
        },
        complete: () => {
          console.log('Completed');
          console.log();

          console.log(`Total Transactions count: ${transactionCount}`);
          console.log(`Supply Transactions count: ${supplyCount}`);
          console.log(`Withdraw Transactions count: ${withdrawCount}`);

          console.log();

          const elapsedTime = Date.now() - startTime;
          console.log(`Elapsed Time: ${humanizeDuration(elapsedTime)}`);

          activeResolve();
        }
      });
  };

  subscribe();
  return promise;
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.log('An unknown error occurred', error);
    process.exit(1);
  });
