## dfuse Client Library - Track Ethereum Transaction React Example

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and
showcase how to use [dfuse Client Library](https://github.com/dfuse-io/client-js) to easily stream
all transfers happening in Mainnet in a streaming fashion.

First install all the dependencies:

```
yarn install
```

Then replace the API key with your own:

```
const dfuseClient = createDfuseClient({
  apiKey: <dfuse API key here>',
  network: 'mainnet.eth.dfuse.io'
});
```

Then simply launch the application and see the results:

```
yarn start
```

When running this, a browser should automatically open pointing
to the example. If it's not the case, simply open http://localhost:3000 in a browser.

### Requirements

You will need to have a dfuse API key.

Obtain a free API key by visiting https://dfuse.io.
