

# Get started with dfuse Events using REACT and Scatter

### dfuse Events example

This example demonstrates how to use `push_transaction` to the dfuseiohooks contract to index data fields in your smart contract. For more context, you can refer to the [contract example](https://github.com/streamingfast/example-dfuse-events-contract).

### Token management and graphQL client

First, head on to our self-service API management [portal](https://app.dfuse.io), after signing up you will be able to create long-term API keys.
The token management is done by the [@dfuse/client](https://github.com/streamingfast/client-js) library. For an example of token management implementation with graphQL, refer to the [action rates streaming example](https://github.com/streamingfast/example-stream-action-rates).


### Connection to Scatter

In order to index your smart contract, you need to use `push_transaction` from an EOS account. To connect your EOS account in this example, we will use [Scatter](https://get-scatter.com/). The [scatter plugin](https://github.com/EOSIO/ual-scatter) can be initialized in the following way:

```typescript
import { Scatter } from "ual-scatter";

export const Config = {
  chainId: "5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191",
  chainApiProtocol: "https",
  chainApiHost: "kylin.eos.dfuse.io",
  chainApiPort: "443"
};

const scatter = new Scatter([blockchainConfig], { appName: "dfuse Events" });
```

## Add an index with push_transaction

The `push_transaction` method is used to generate the transaction that will index our fields:

```typescript
export function createDfuseHooksEventTransaction(
  actor: string,
  key: string,
  data: string
) {
  return {
    actions: [
      {
        account: "dfuseiohooks",
        name: "event",
        authorization: [
          {
            actor,
            permission: "active"
          }
        ],
        data: {
          key,
          data
        }
      }
    ]
  };
}

onPushTransaction = async (event: React.MouseEvent<HTMLInputElement>) => {
  const { accountName, activeUser, key, data } = this.state;

  const transaction = createDfuseHooksEventTransaction(accountName!, key, data);

  const signedTransaction = await activeUser.signTransaction(transaction, {
    broadcast: true
  });

  // ...
};
```

where the `activeUser` is provided inside the React application via the wrapper:

```typescript jsx
import { UALProvider, withUAL } from "ual-reactjs-renderer";

const WrappedApp = withUAL(App);

ReactDOM.render(
  <ApolloProvider client={apolloClient}>
    <UALProvider
      chains={[blockchainConfig]}
      authenticators={[scatter]}
      appName={"dfuse Events"}
    >
      <WrappedApp />
    </UALProvider>
  </ApolloProvider>,
  document.getElementById("root") as HTMLElement
);
```

and `data` is a string set by the react form which must follow the format:

```
fieldName1=foo&fieldName2=bar&...
```


For see how the resulting transaction is queried with the dfuse graphQL API, you can refer to the source code of this project. A more detailed example of a GraghQL subscription to query transactions on the chain can also be found [here](https://github.com/streamingfast/example-stream-action-rates).

### Query indexed fields with dfuse search API

Now that the action has been indexed, you can easily search for those only actions you are interested in.

- Search all move action that had `fieldName1` set to `foo` and `fieldName2` set to `bar` (using format example from above) with `event.fieldName1:foo event.fieldName2:bar parent.receiver:yourcontract`.

Important The parent.receiver:<contract> should always be used to ensure that it was really your <contract> that sent the inline action. You would not like someone doing the same card_id=123&card_kind=club fields indexing to be included in your search's results!


# Quick start to run the example

The following assumes you have yarn installed on your computer

- Clone this repository
- yarn install
- yarn start
- open `localhost:3000` in a new tab in your webbrowser

