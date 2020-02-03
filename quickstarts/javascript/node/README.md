### dfuse Quickstart JavaScript Bundler

### Execute

First install the dependencies:

```
npm install
```

Then run the `index.<chain>.js` file for the chain you want to run
the quickstart example for. Before invoking the script, be sure to export
your dfuse API key into the `DFUSE_API_KEY` environment variable.

For example, to run the Ethereum example, you would do:

```
export DFUSE_API_KEY=web_abcdef12345678900000000000
node index.ethereum.js
```

#### Bootstrap

The bootstrap of this project was performed using:

```
npm init -y
npm install @dfuse/client node-fetch ws

cat <<EOD > index.js
global.fetch = require('node-fetch')
global.WebSocket = require('ws')
EOD
```