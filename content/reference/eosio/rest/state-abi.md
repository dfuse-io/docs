---
weight: 1
title: GET /v0/state/abi
---

# GET `/v0/state/abi`

Fetches the ABI for a given contract account, at any block height.


## Usage

Sample request:

{{< exampleRequest id="search-transactions" url="https://mainnet.eos.dfuse.io/v0/state/abi?account=eosio&json=true" >}}

## Requesting past blocks

The `block_num` parameter determines for which block you want the given
ABI. This can be anywhere in the chain's history.

If the requested `block_num` is irreversible, you will get an
immutable ABI. If the ABI has changed while still in a reversible
chain, you will get this new ABI, but it is not guaranteed to be the view
that will pass irreversibility. Inspect the returned `block_num` parameter
of the response to understand from which longest chain the returned ABI is from.

The returned ABI is the one that was active at the `block_num` requested.

## Input parameters

Name | Type | Options | Description
-----|------|---------|------------
`account` | [AccountName](#type-AccountName) | required | Contract account targeted by the action.
`block_num` | number | optional, _defaults_ to head block num | The block number for which you want to retrieve the ABI. The returned ABI will be the one that was active at this given `block_num`.
`json` | boolean | optional, _defaults_ to `false` | Returns the ABI in JSON form if set to `true`. When set to `false`, the packed ABI is returned in hexadecimal string form.

## Response

Here is a sample response, for a request at `block_num: 8000`:

{{< highlight json >}}
{
  "block_num": 8000,
  "account": "eosio.token",
  "abi": {
    "version": "eosio::abi/1.0",
    ...
  }
}
{{< /highlight >}}

Name | Type | Options | Description
-----|------|---------|------------
`block_num` | string | required | Block number closest to `block_num` at which the ABI was put on chain. For example, if ABI was last changed at block 1000 and you used a `block_num` of 20000 in the request, the response `block_num` will be 1000.
`account` | [AccountName](#type-AccountName) | required | Contract account this ABI is active for.
`abi` | object | required | A hexadecimal string (or JSON if `json=true`) representation of the ABI that is stored within the account. It is the ABI in effect at the requested `block_num`.