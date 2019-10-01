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

#### Input parameters

{{< method-list-item name="q" type="String" required="true" >}}
  Search query string. See [Search language specs](#ref-search-query-specs) for details.
{{< /method-list-item >}}

{{< method-list-item name="account" type="[AccountName](#type-AccountName)" required="true" >}}
  Contract account targeted by the action.
{{< /method-list-item >}}

{{< method-list-item name="block_num" type="Number" required="false" >}}
  Defaults to head block num. The block number for which you want to retrieve the ABI. The returned ABI will be the one that was active at this given `block_num`.
{{< /method-list-item >}}

{{< method-list-item name="json" type="Boolean" required="false" >}}
  Defaults to `false`. Returns the ABI in JSON form if set to `true`. When set to `false`, the packed ABI is returned in hexadecimal string form.
{{< /method-list-item >}}

#### Response

{{< method-list-item name="block_num" type="String" required="true" >}}
  Block number closest to `block_num` at which the ABI was put on chain. For example, if ABI was last changed at block 1000 and you used a `block_num` of 20000 in the request, the response `block_num` will be 1000.
{{< /method-list-item >}}

{{< method-list-item name="account" type="[AccountName](#type-AccountName)" required="true" >}}
  Contract account this ABI is active for.
{{< /method-list-item >}}

{{< method-list-item name="abi" type="Object" required="true" >}}
  A hexadecimal string (or JSON if `json=true`) representation of the ABI that is stored within the account. It is the ABI in effect at the requested `block_num`.
{{< /method-list-item >}}

Here is a sample response, for a request at `block_num: 8000`:

{{< tabs "state-abi-response" >}}
{{< tab lang="json" >}}
  "block_num": 8000,
  "account": "eosio.token",
  "abi": {
    "version": "eosio::abi/1.0",
    ...
  }
}
{{< /tab >}}
{{< /tabs >}}
