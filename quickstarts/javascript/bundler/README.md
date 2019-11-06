### dfuse Quickstart JavaScript Bundler

### Execute

First install the dependencies:

```
npm install
```

You must then build the bundle for the chain you want to quickstart
on then open the associated `index.<chain>.html` file on your
favorite browser. We are using Webpack, which is the bundler used
by both Create React App for React applications and `vue-cli` to
Vue.js applications.

**Note** We use Webpack straight to make the example in here much simpler.

Before invoking the build step, be sure to export your dfuse API key
into the `DFUSE_API_KEY` environment variable.

For example, to run the Ethereum example, you would do:

```
export DFUSE_API_KEY=web_abcdef12345678900000000000
npm run build:ethereum

# Open `index.ethereum.html` directly in your favorite Browser
open index.ethereum.html       # Mac
xdg-open index.ethereum.html   # Ubuntu
start index.ethereum.thml      # Windows
```

#### Bootstrap

This project was bootstrapped using those commands:

```
npm init -y
npm install @dfuse/client
npm install --save-dev webpack webpack-cli

cat <<EOD > webpack.prod.js
const { EnvironmentPlugin } = require('webpack')

module.exports = env => ({
  mode: 'production',
  entry: \`./index.\${env.chainId}.js\`,
  output: {
    path: __dirname,
    filename: \`bundle.\${env.chainId}.js\`,
  },
  plugins: [
    new EnvironmentPlugin(['DFUSE_API_KEY']),
  ]
})
EOD
```