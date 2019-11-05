const { EnvironmentPlugin } = require('webpack')

module.exports = env => ({
  mode: 'production',
  entry: `./index.${env.chainId}.js`,
  output: {
    path: __dirname,
    filename: `bundle.${env.chainId}.js`,
  },
  plugins: [
    new EnvironmentPlugin(['DFUSE_API_KEY']),
  ]
})
