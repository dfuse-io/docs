---
weight: 1
title: GET /v0/state/key_accounts
---

# GET `/v0/state/key_accounts`

Fetches the accounts controlled by the given public key, at any block height.

## Usage

Sample request:

{{< exampleRequest id="search-transactions" url="https://mainnet.eos.dfuse.io/v0/state/key_accounts?public_key=EOS7YNS1swh6QWANkzGgFrjiX8E3u8WK5CK9GMAb6EzKVNZMYhCH3" >}}

{{< note >}}
This endpoint is a drop-in replacement for the `/v1/history/get_key_accounts` API endpoint from standard `nodeos`. Simply tweak the URL, and add the Bearer token.
{{< /note >}}

## Requesting past blocks

The `block_num` parameter determines for which block height you want a list of accounts associated to the given
public key. This can be anywhere in the chain's history.

If the requested `block_num` is irreversible, you will get an
immutable list of accounts. Otherwise, there are chances that the
returned value moves as the chain reorganizes.

## Input parameters

Name | Type | Options | Description
-----|------|---------|------------
`public_key` | [PublicKey](#type-PublicKey) | required | The public key to fetch controlled accounts for.
`block_num` | number | optional, _defaults_ to head block num | The block number for which you want to retrieve the list of accounts.

## Response

Here is a sample response, for a request at `block_num: 10000000`:

{{< highlight json >}}
{
  "block_num": 10000000,
  "account_names": [
    "eoscanadacom"
  ]
}
{{< /highlight >}}

Name | Type | Options | Description
-----|------|---------|------------
`block_num` | number | required | Block number used to serve your request. Will be the head `block_num` if it was not provided or `0` was passed as `block_num`, otherwise, will be the `block_num` you've passed in the request.
`account_names` | array&lt;[AccountName](#type-AccountName)&gt; | required | An array of account names that the public key is associated with, sorted alphabetically.