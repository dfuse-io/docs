# Ethereum Chain Activity Statistics

This repository contains a script to extract chain activity 
The script searches and tracks the `supply(address, uint64)` and `withdraw(address, uint64)` method calls.
The same searching function can be used to extract activity 
such as method calls, balanceChange, storageChange, inputData, logs(topic, data, address).
For a list of common method signature to search for, refer to: https://www.4byte.directory/

We use the dfuse Search GraphQL API to perform this example.

First, install the dependencies:

    yarn install

Then run:

    DFUSE_API_KEY=<Your API Key here> yarn start
