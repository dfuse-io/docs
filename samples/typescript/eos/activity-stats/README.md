# EOS Chain Activity Statistics

This repository contains two quick scripts to extract chain activity
(blocks, transactions, token transaction, account creation, etc).
We use the dfuse Search GraphQL API to perform this example.

First, install the dependencies:

    yarn install

Then run the token stats:

    DFUSE_API_KEY=<Your API Key here> yarn token

Or run the account creation stats:

    DFUSE_API_KEY=<Your API Key here> yarn account
