---
weight: 1
title: REST API
---

# REST API

The _dfuse_ REST API includes the following endpoints:

* [`POST https://auth.dfuse.io/v1/auth/issue`](#post-v1-auth-issue): Exchange a long-term API key for a short-lived (24 hours) API Authentication Token (JWT).

* **(Beta)** [`GET /v0/block_id/by_time`](#rest-api-get-v0-block_id-by_time): Get the block ID produced at a given time

* **(Beta)** [`GET /v0/transactions/:id`](#rest-api-get-v0-transaction_id): Fetching the transaction lifecycle associated with the provided path parameter `:id`.

* **(Beta)** [`GET /v0/state/abi`](#rest-api-get-v0-state-abi): Fetch the ABI for a given contract account, at any block height.

* **(Beta)** [`POST /v0/state/abi/bin_to_json`](#rest-api-get-v0-state-abi-decode): Decode binary rows (in hexadecimal string) for a given table against
the ABI of a given contract account, at any block height.

* **(Beta)** [`GET /v0/state/permission_links`](#rest-api-get-v0-state-permission_links): Fetching snapshots of any account's linked authorizations on the blockchain, at any block height.

* **(Beta)** [`GET /v0/state/table`](#rest-api-get-v0-state-table): Fetching snapshots of any table on the blockchain, at any block height.

* **(Beta)** [`GET /v0/state/table/accounts`](#rest-api-get-v0-state-tables-accounts): Fetching snapshots of any table on the blockchain, at any block height, for a list of accounts (contracts).

* **(Beta)** [`GET /v0/state/table/scopes`](#rest-api-get-v0-state-table-scopes): Fetching snapshots of any table on the blockchain, at any block height, for a list of scopes for a given account (contract).

* **(Beta)** [`GET /v0/search/transactions`](#rest-api-get-v0-search-transactions): Structure Query Engine (SQE), for searching the whole blockchain history and get fast and precise results.

* **(Beta)** [`POST /v1/chain/push_transaction`](#rest-api-post-v1-push-transaction): Drop-in replacement for submitting a transaction to the network, but can optionally block the request until the transaction is either *in a block* or *in an irreversible block*.

* Other `/v1/chain/...`: Reverse-proxy of all [standard chain requests](https://developers.eos.io/eosio-nodeos/reference) to a well-connected node.

    
To use the API, you must pass a *dfuse* API token (JWT) in a HTTP Header, like the following:

{{< highlight shell >}}
curl -H "Authorization: Bearer yJhbGciOiJLTVNFUzI1NiIsI....." "https://endpoint..."
{{< /highlight >}}
