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

{{< alert type="note" >}}
EOS Mainnet access is offered only to paying customers of the dfuse API.

[Contact us](https://www.dfuse.io/pricing) to set up your dedicated deployment
{{< /alert >}}

A free rate-limited access is offered by [EOS Nation](https://eosnation.io/) team.

### dfuse Community Edition (hosted by [EOS Nation](https://eosnation.io/))

{{< alert type="note" >}}
Access to the Official dfuse Community Edition does not require authentication, and is rate-limited. A higher rate limit is available to authenticatated users. The service being shared with the whole community, please be mindful of your requests. To create a dfuse API key for the dfuse Community Edition, visit [EOS Nation Account Page](https://account.eosnation.io). The authorization endpoint to use to obtain a dfuse API Token from your API key is `auth.eosnation.io`.
{{< /alert >}}

| API       | URL                                                                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| WebSocket | wss://eos.dfuse.eosnation.io/v1/stream                                                                                                  |
| REST      | https://eos.dfuse.eosnation.io/                                                                                                         |
| GraphQL over HTTP  | https://eos.dfuse.eosnation.io/graphql                                                                                                         |
| GraphQL over WebSocket | wss://eos.dfuse.eosnation.io/graphql                                                                                                         |
| GraphQL over gRPC  | eos.dfuse.eosnation.io:9000                                                                                                         |
| GraphQL Examples & References | {{< external-link title="GraphiQL" href="https://eos.dfuse.eosnation.io/graphiql/" >}} |

## EOSIO Testnet

Chain ID: `0db13ab9b321c37c0ba8481cb4681c2788b622c3abfd1f12f0e5353d44ba6e72`

| API       | URL                                                                                                                                  |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| WebSocket | wss://testnet.eos.dfuse.io/v1/stream                                                                                                 |
| REST      | https://testnet.eos.dfuse.io/                                                                                                        |
| GraphQL over HTTP  | https://testnet.eos.dfuse.io/graphql                                                                                                         |
| GraphQL over WebSocket | wss://testnet.eos.dfuse.io/graphql                                                                                                         |
| GraphQL over gRPC  | testnet.eos.dfuse.io:443                                                                                                        |
| GraphQL Examples & References | {{< external-link title="GraphiQL" href="https://testnet.eos.dfuse.io/graphiql/" >}} |

## CryptoKylin

Chain ID: `5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191`

| API       | URL                                                                                                                               |
| --------- | --------------------------------------------------------------------------------------------------------------------------------- |
| WebSocket | wss://kylin.eos.dfuse.io/v1/stream                                                                                                |
| REST      | https://kylin.eos.dfuse.io/                                                                                                       |
| GraphQL over HTTP  | https://kylin.eos.dfuse.io/graphql                                                                                                         |
| GraphQL over WebSocket | wss://kylin.eos.dfuse.io/graphql                                                                                                         |
| GraphQL over gRPC  | kylin.eos.dfuse.io:443                                                                                                        |
| GraphQL Examples & References | {{< external-link title="GraphiQL" href="https://kylin.eos.dfuse.io/graphiql/" >}} |

## WAX Mainnet

Chain ID: `1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4`

{{< alert type="note" >}}
WAX Mainnet access is offered only to paying customers of the dfuse API.

[Contact us](https://www.dfuse.io/pricing) to set up your dedicated deployment.
{{< /alert >}}

A free rate-limited access is offered by [EOS Nation](https://eosnation.io/) team.

### dfuse Community Edition (hosted by [EOS Nation](https://eosnation.io/))

{{< alert type="note" >}}
Access to the Official dfuse Community Edition does not require authentication, and is rate-limited. A higher rate limit is available to authenticatated users. The service being shared with the whole community, please be mindful of your requests. To create a dfuse API key for the dfuse Community Edition, visit [EOS Nation Account Page](https://account.eosnation.io). The authorization endpoint to use to obtain a dfuse API Token from your API key is `auth.eosnation.io`.
{{< /alert >}}

| API       | URL                                                                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| WebSocket | wss://wax.dfuse.eosnation.io/v1/stream                                                                                                  |
| REST      | https://wax.dfuse.eosnation.io/                                                                                                         |
| GraphQL over HTTP  | https://wax.dfuse.eosnation.io/graphql                                                                                                         |
| GraphQL over WebSocket | wss://wax.dfuse.eosnation.io/graphql                                                                                                         |
| GraphQL over gRPC  | wax.dfuse.eosnation.io:9000                                                                                                        |
| GraphQL Examples & References | {{< external-link title="GraphiQL" href="https://wax.dfuse.eosnation.io/graphiql/" >}} |
