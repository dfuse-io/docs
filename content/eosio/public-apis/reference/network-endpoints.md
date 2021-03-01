---
weight: 20
title: Available EOSIO Networks (Endpoints)
sideNavTitle: Network Endpoints
aliases:
  - /reference/eosio/endpoints/
  - /eosio/public-apis/reference/eosio-networks-endpoints/
  - /eosio/public-apis/reference/available-networks-endpoints/
---

The _dfuse_ API is available for multiple EOSIO networks. Should you need it on another network, contact us.

## EOS Mainnet

Chain ID: `aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906`

mainnet.eos.dfuse.io has been deprecated, there are now two ways to access EOS mainnet using dfuse

1. dfuse Community Edition (hosted by [EOS Nation](https://eosnation.io/))

| API       | URL                                                                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| WebSocket | wss://eos.dfuse.eosnation.io/v1/stream                                                                                                  |
| REST      | https://eos.dfuse.eosnation.io/                                                                                                         |

2. dfuse Enterprise

[Contact us](https://www.dfuse.io/pricing) to set up your dedicated deployment

## EOSIO Testnet

Chain ID: `0db13ab9b321c37c0ba8481cb4681c2788b622c3abfd1f12f0e5353d44ba6e72`

| API       | URL                                                                                                                                  |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| WebSocket | wss://testnet.eos.dfuse.io/v1/stream                                                                                                 |
| REST      | https://testnet.eos.dfuse.io/                                                                                                        |
| GraphQL   | https://testnet.eos.dfuse.io/graphql -- Test the API with our {{< external-link title="GraphiQL" href="https://testnet.eos.dfuse.io/graphiql" >}} visual editor |

## CryptoKylin

Chain ID: `5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191`

| API       | URL                                                                                                                               |
| --------- | --------------------------------------------------------------------------------------------------------------------------------- |
| WebSocket | wss://kylin.eos.dfuse.io/v1/stream                                                                                                |
| REST      | https://kylin.eos.dfuse.io/                                                                                                       |
| GraphQL   | https://kylin.eos.dfuse.io/graphql -- Test the API with our {{< external-link title="GraphiQL" href="https://kylin.eos.dfuse.io/graphiql/" >}} visual editor |

## WAX Mainnet

Chain ID: `1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4`

{{< alert type="note" >}}
WAX Mainnet is provider through dfuse Community Edition hosted by [EOS Nation](https://eosnation.io/)
{{< /alert >}}

| API       | URL                                                                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| WebSocket | wss://wax.dfuse.eosnation.io/v1/stream                                                                                                  |
| REST      | https://wax.dfuse.eosnation.io/                                                                                                         |
| GraphQL   | https://wax.dfuse.eosnation.io/graphql -- Test the API with our {{< external-link title="GraphiQL" href="https://wax.dfuse.eosnation.io/graphiql/" >}} visual editor |
