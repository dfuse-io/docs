---
weight: 70

pageTitle: Samples
pageTitleIcon: eosio

sideNav: true
sideNavTitle: Public APIs
sideNavLinkRename: Samples

BookToC: true
#release: stable

---

<!-- 
# TODO: I've renamed `main` to `eosio` here.. but that doesn't work with all the menus..
# We need to review the `config.json`, and how we'll actually build the menu structure
# to be able to reuse the menus in each protocol section.. can we have sub-trees or a
# certain menu in a sub-tree? Like use `eosio` in the `content/eosio` subtree, and the
# `ethereum` menu in the `content/ethereum` subtree?
-->

## Go

| Description                            | Source                                                                                                                    |
| :------------------------------------- | :-----------------------------------------------------------------------------------------------------------------------: |
| Example of dfuse GraphQL API over gRPC | {{< external-link title="Github" href="https://github.com/dfuse-io/docs/tree/master/samples/go/eos/graphql-grpc" >}}      |
| Using Push Notifications               | {{< external-link title="Github" href="https://github.com/dfuse-io/docs/tree/master/samples/go/eos/push-notification" >}} |

## Typescript

| Description                                                                                    | Source                                                                                                                                       |
| :--------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------: |
| Live Search Example, using GraphQL Subscriptions & Apollo Client                               | {{< external-link title="Github" href="https://github.com/dfuse-io/docs/tree/master/samples/typescript/eos/stream-action-rates" >}}          |
| Getting Started with GraphQL and Apollo                                                        | {{< external-link title="Github" href="https://github.com/dfuse-io/docs/tree/master/samples/typescript/eos/graphql-apollo" >}}               |
| Example of dfuse Events in action                                                              | {{< external-link title="Github" href="https://github.com/dfuse-io/docs/tree/master/samples/typescript/eos/dfuse-events" >}}                 |
| Extracting Chain Activity Statistics                                                           | {{< external-link title="Github" href="https://github.com/dfuse-io/docs/tree/master/samples/typescript/eos/activity-stats" >}}               |
| NodeJS example with dfuse GraphQL Streaming API to obtain real-time feed of EOS/REX price      | {{< external-link title="Github" href="https://github.com/dfuse-io/docs/tree/master/samples/typescript/eos/price-feed" >}}                   |
| How to decode hexadecimal string data into a JSON structure using eosjs                        | {{< external-link title="Github" href="https://github.com/dfuse-io/docs/tree/master/samples/typescript/eos/decode-hex" >}}                   |
| How to use dfuse guaranteed `push_transaction` with eosjs library                              | {{< external-link title="Github" href="https://github.com/dfuse-io/docs/tree/master/tutorials/eos/push-guaranteed" >}}                       |
| Never miss a beat when socket disconnects with dfuse Stream                                    | {{< external-link title="Github" href="https://github.com/dfuse-io/client-js/blob/master/examples/advanced/graphql-never-miss-a-beat.ts" >}} |

## JavaScript

| Description                                                              | Source                                                                                                                           |
| :----------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------: |
| Example of dfuse Client Library stream transfers with React              | {{< external-link title="Github" href="https://github.com/dfuse-io/docs/tree/master/samples/javascript/eos/stream-transfers" >}} |
| Showcase on how to use the dfuse Client Library in a Node.js environment | {{< external-link title="Github" href="https://github.com/dfuse-io/docs/tree/master/samples/javascript/eos/node-server" >}}      |
| How to use dfuse guaranteed `push_transaction` with eosjs library        | {{< external-link title="Github" href="https://github.com/dfuse-io/docs/tree/master/samples/javascript/eos/push-guaranteed" >}}  |

## Python

| Description                                        | Source                                                                                                                   |
| :------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------: |
| Querying the dfuse GraphQL API over gRPC in Python | {{< external-link title="Github" href="https://github.com/dfuse-io/docs/tree/master/samples/python/eos/graphql-grpc" >}} |

## C++

| Description                          | Source                                                                                                                         |
| :----------------------------------- | :----------------------------------------------------------------------------------------------------------------------------: |
| An example contract for dfuse Events | {{< external-link title="Github" href="https://github.com/dfuse-io/docs/tree/master/samples/cpp/eos/dfuse-events-contract" >}} |
