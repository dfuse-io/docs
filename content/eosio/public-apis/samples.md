---
weight: 70
title: Samples
titleProtocolIcon: eosio
menuTitle: Public APIs

# TODO: purge of all its ETH stuff
# TODO: I've renamed `main` to `eosio` here.. but that doesn't work with all the menus..
# We need to review the `config.json`, and how we'll actually build the menu structure
# to be able to reuse the menus in each protocol section.. can we have sub-trees or a
# certain menu in a sub-tree? Like use `eosio` in the `content/eosio` subtree, and the
# `ethereum` menu in the `content/ethereum` subtree?

---

<!-- TODO: USE CRYPTO ICONS for headers -->

## Go

| Description                            |                                                   Ethereum Source                                                    | EOSIO Source                                                                                                              |
| :------------------------------------- | :------------------------------------------------------------------------------------------------------------------: | ------------------------------------------------------------------------------------------------------------------------- |
| Example of dfuse GraphQL API over gRPC | {{< external-link title="Github" href="https://github.com/dfuse-io/docs/tree/master/samples/go/eth/graphql-grpc" >}} | {{< external-link title="Github" href="https://github.com/dfuse-io/docs/tree/master/samples/go/eos/graphql-grpc" >}}      |
| Using Push Notifications               |                                                         N/A                                                          | {{< external-link title="Github" href="https://github.com/dfuse-io/docs/tree/master/samples/go/eos/push-notification" >}} |

## Typescript

| Description                                                                                    |                                                                  Ethereum Source                                                                  |                                                                 EOSIO Source                                                                 |
| :--------------------------------------------------------------------------------------------- | :-----------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------: |
| Live Search Example, using GraphQL Subscriptions & Apollo Client                               |                                             N/A <!-- NEED EQUIVALENT OF ACTION RATES TO AGGREGATE -->                                             |     {{< external-link title="Github" href="https://github.com/dfuse-io/docs/tree/master/samples/typescript/eos/stream-action-rates" >}}      |
| Getting Started with GraphQL and Apollo                                                        |          {{< external-link title="Github" href="https://github.com/dfuse-io/docs/tree/master/samples/typescript/eth/graphql-apollo" >}}           |        {{< external-link title="Github" href="https://github.com/dfuse-io/docs/tree/master/samples/typescript/eos/graphql-apollo" >}}        |
| Example of dfuse Events in action                                                              |                                                                        N/A                                                                        |         {{< external-link title="Github" href="https://github.com/dfuse-io/docs/tree/master/samples/typescript/eos/dfuse-events" >}}         |
| Extracting Chain Activity Statistics                                                           |          {{< external-link title="Github" href="https://github.com/dfuse-io/docs/tree/master/samples/typescript/eth/activity-stats" >}}           |        {{< external-link title="Github" href="https://github.com/dfuse-io/docs/tree/master/samples/typescript/eos/activity-stats" >}}        |
| NodeJS example that uses dfuse GraphQL Streaming API to obtain real-time feed of EOS/REX price |                                                                        N/A                                                                        |          {{< external-link title="Github" href="https://github.com/dfuse-io/docs/tree/master/samples/typescript/eos/price-feed" >}}          |
| How to decode hexadecimal string data into a JSON structure using eosjs                        |                                                                        N/A                                                                        |          {{< external-link title="Github" href="https://github.com/dfuse-io/docs/tree/master/samples/typescript/eos/decode-hex" >}}          |
| How to use dfuse guaranteed `push_transaction` with eosjs library                              |                                                                        N/A                                                                        |            {{< external-link title="Github" href="https://github.com/dfuse-io/docs/tree/master/tutorials/eos/push-guaranteed" >}}            |
| Stream pending transactions from or to an address                                              | {{< external-link title="Github" href="https://github.com/dfuse-io/client-js/blob/master/examples/reference/ethereum/pending-transactions.ts" >}} |                                                                     N/A                                                                      |
| Never miss a beat when socket disconnects with dfuse Stream                                    |                                                                                                                                                   | {{< external-link title="Github" href="https://github.com/dfuse-io/client-js/blob/master/examples/advanced/graphql-never-miss-a-beat.ts" >}} |

## JavaScript

| Description                                                              |                                                       Ethereum Source                                                       | EOSIO Source                                                                                                                     |
| :----------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------: | -------------------------------------------------------------------------------------------------------------------------------- |
| Example of dfuse Client Library stream transfers with React              |        {{< external-link title="Github" href="https://github.com/dfuse-io/docs/tree/master/tutorials/eth/stream" >}}        | {{< external-link title="Github" href="https://github.com/dfuse-io/docs/tree/master/samples/javascript/eos/stream-transfers" >}} |
| Showcase on how to use the dfuse Client Library in a Node.js environment | {{< external-link title="Github" href="https://github.com/dfuse-io/docs/tree/master/samples/javascript/eth/node-server" >}} | {{< external-link title="Github" href="https://github.com/dfuse-io/docs/tree/master/samples/javascript/eos/node-server" >}}      |
| How to track transaction in real-time with dfuse Lifecycle               |      {{< external-link title="Github" href="https://github.com/dfuse-io/docs/tree/master/tutorials/eth/lifecycle" >}}       | N/A                                                                                                                              |
| How to search transactions with dfuse Search and render with React       |        {{< external-link title="Github" href="https://github.com/dfuse-io/docs/tree/master/tutorials/eth/search" >}}        | N/A                                                                                                                              |
| How to use dfuse guaranteed `push_transaction` with eosjs library        |                                                             N/A                                                             | {{< external-link title="Github" href="https://github.com/dfuse-io/docs/tree/master/samples/javascript/eos/push-guaranteed" >}}  |

## Python

| Description                                        |                                                     Ethereum Source                                                      | EOSIO Source                                                                                                             |
| :------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------: | ------------------------------------------------------------------------------------------------------------------------ |
| Querying the dfuse GraphQL API over gRPC in Python | {{< external-link title="Github" href="https://github.com/dfuse-io/docs/tree/master/samples/python/eth/graphql-grpc" >}} | {{< external-link title="Github" href="https://github.com/dfuse-io/docs/tree/master/samples/python/eos/graphql-grpc" >}} |

## C++

| Description                          | Ethereum Source | EOSIO Source                                                                                                                   |
| :----------------------------------- | :-------------: | ------------------------------------------------------------------------------------------------------------------------------ |
| An example contract for dfuse Events |       N/A       | {{< external-link title="Github" href="https://github.com/dfuse-io/docs/tree/master/samples/cpp/eos/dfuse-events-contract" >}} |
