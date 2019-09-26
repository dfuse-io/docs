---
weight: 1
title: GET /v0/state/table_scopes
---

# GET `/v0/state/table_scopes`

Fetches a list of scopes, for a given table on a contract account, at any block height.

> Sample request:

{{< highlight shell >}}
curl -H "Authorization: Bearer $TOKEN" \
    "https://mainnet.eos.dfuse.io/v0/state/table_scopes?account=eosforumdapp&table=proposal"
{{< /highlight >}}


*NOTE*: Not to be confused with
[/v0/state/tables/scopes](#rest-get-v0-state-tables-scopes) which
retrieves the actual _tables_. Paired with this endpoint, you can
get a consistent view of all tables in a contract.



### Requesting past blocks

The `block_num` parameter determines for which block you want the list
of scopes for the given contract account's table. This can be anywhere
in the chain's history.

If the requested `block_num` is irreversible, you will get an
immutable list of accounts. Otherwise, there are chances that the
returned value moves as the chain reorganizes.


### Input parameters

Name | Type | Options | Description
-----|------|---------|------------
`account` | [AccountName](#type-AccountName) | required | Contract account holding the requested table.
`table` | [TableName](#type-TableName) | required | The _name-encoded_ table name you want to retrieve scopes from.  Refer to the contract's ABI for a list of available tables.  This is contract dependent.
`block_num` | number | optional, _defaults_ to head block num | The block number for which you want to retrieve the consistent table scopes snapshot.

### Response

> Here is a sample response, for a request at `block_num: 9000000`:


{{< highlight json >}}
{
  "block_num": 9000000,
  "scopes": [
    "aus1genereos",
    "eoscanadacom"
  ]
}
{{< /highlight >}}


Name | Type | Options | Description
-----|------|---------|------------
`block_num` | number | required | Block number used to serve your request. Will be the head `block_num` if it was not provided or `0` was passed as `block_num`, otherwise, will be the `block_num` you've passed in the request.
`scopes` | array&lt;[Name](#type-Name)&gt; | required | An array of scopes for the given table, sorted alphabetically.
