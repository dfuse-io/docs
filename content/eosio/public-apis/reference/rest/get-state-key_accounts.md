---
weight: 20
title: GET /v0/state/key_accounts
release: stable
aliases:
  - /reference/eosio/rest/state-key-accounts/

---

Fetches the accounts controlled by the given public key, at any block height.

## Usage

Sample request:

{{< example-request id="search-transactions" url="https://testnet.eos.dfuse.io/v0/state/key_accounts?public_key=EOS7YNS1swh6QWANkzGgFrjiX8E3u8WK5CK9GMAb6EzKVNZMYhCH3" >}}

{{< alert type="note" >}}
This endpoint is a drop-in replacement for the `/v1/history/get_key_accounts` API endpoint from standard `nodeos`. Simply tweak the URL, and add the Bearer token.
{{< /alert >}}

## Requesting past blocks

The `block_num` parameter determines for which block height you want a list of accounts associated to the given
public key. This can be anywhere in the chain's history.

If the requested `block_num` is irreversible, you will get an
immutable list of accounts. Otherwise, there are chances that the
returned value moves as the chain reorganizes.

#### Input parameters

{{< method-list-item name="public_key" type="[PublicKey](/eosio/public-apis/reference/types/publickey)" required="true" >}}
  The public key to fetch controlled accounts for.
{{< /method-list-item >}}

{{< method-list-item name="block_num" type="Number" required="false" >}}
  Defaults to head block num. The block number for which you want to retrieve the list of accounts.
{{< /method-list-item >}}

#### Response

{{< method-list-item name="block_num" type="Number" >}}
  Block number used to serve your request. Will be the head `block_num` if it was not provided or `0` was passed as `block_num`, otherwise, will be the `block_num` you've passed in the request.
{{< /method-list-item >}}

{{< method-list-item name="account_names" type="Array&lt;[AccountName](/eosio/public-apis/reference/types/accountname)&gt;" >}}
  An array of account names that the public key is associated with, sorted alphabetically.
{{< /method-list-item >}}

Here is a sample response, for a request at `block_num: 10000000`:

{{< tabs "state-key-accounts-response" >}}
{{< tab lang="json" >}}
{
  "block_num": 10000000,
  "account_names": [
    "eoscanadacom"
  ]
}
{{< /tab >}}
{{< /tabs >}}
