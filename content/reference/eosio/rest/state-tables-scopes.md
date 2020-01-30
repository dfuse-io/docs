---
weight: 1
title: GET /v0/state/tables/scopes
release: beta
---

Fetches all rows for a table in a given contract for a group of
scopes, at any block height.


## Usage

Most parameters are similar to the `/v0/state/table` request, except
for the `scopes` parameter, which accepts a list of name-encoded scopes
separated by the pipe character (`|`).

The output format is slightly different too.

Sample request:

{{< example-request id="search-transactions" url="https://mainnet.eos.dfuse.io/v0/state/tables/scopes?account=eosio&scopes=eosio.token|eosadddddddd|tokenbyeocat|ethsidechain|epraofficial|alibabapoole|hirevibeshvt|oo1122334455|irespotokens|publytoken11|parslseed123|trybenetwork|zkstokensr4u&table=delband&block_num=25000000&json=true" >}}

{{< alert type="note" >}}
Not to be confused with [/v0/state/table_scopes]({{< ref "./state-table-scopes" >}}) which retrieves the only the scope names. Paired with this endpoint, you can get a consistent view of all tables in a contract.
{{< /alert >}}

## Requesting past blocks & ABI handling

This request exhibits the same patterns as the simpler
[/v0/state/table]({{< ref "./state-table" >}}) query.

#### Input parameters

{{< method-list-item name="account" type="[AccountName](/reference/eosio/types/accountname)" required="true" >}}
  Contract account targeted by the action.
{{< /method-list-item >}}

{{< method-list-item name="scopes" type="String" required="true" >}}
  A [Name]({{< ref "../types/Name" >}}) list, separated by the pipe character <code>&#124;</code>, a maximum of 1500 elements can be present in the list.
{{< /method-list-item >}}

{{< method-list-item name="table" type="[TableName](/reference/eosio/types/tablename)" required="true" >}}
  The _name-encoded_ table name you want to retrieve.  For example, user balances for tokens live in the `accounts` table.  Refer to the contract's ABI for a list of available tables.  This is contract dependent.
{{< /method-list-item >}}

{{< method-list-item name="block_num" type="Number" required="false" >}}
  Defaults to head block num | The block number for which you want to retrieve the consistent table snapshot.
{{< /method-list-item >}}

{{< method-list-item name="json" type="Boolean" required="false" >}}
  Defaults to `false` | Decode each row from its binary form into JSON. If `json: false`, then hexadecimal representation of its binary data is returned instead.
{{< /method-list-item >}}

{{< method-list-item name="key_type" type="String" required="false" >}}
  Defaults to `name` | How to represent the row keys in the returned table.
{{< /method-list-item >}}

{{< method-list-item name="with_block_num" type="Boolean" required="false" >}}
  Defaults to `false` | Will return one `block_num` with each row. Represents the block at which that row was last changed.
{{< /method-list-item >}}

{{< method-list-item name="with_abi" type="Boolean" required="false" >}}
  Defaults to `false` | Return the ABI in effect at block `block_num`.
{{< /method-list-item >}}

<!---
FIXME: This KeyType is duplicated from `state-tables-scopes.md` and `state-table.md`
-->

## Key Type

The key type can be one of the following values:

 * `name` _(default)_ for EOS name-encoded base32 representation of the row key
 * `hex` for hexadecimal encoding, ex: `abcdef1234567890`
 * `hex_be` for big endian hexadecimal encoding, ex: `9078563412efcdab`
 * `uint64` for *string* encoded uint64. Beware: uint64 can be very large numbers and some programming languages need special care to decode them without truncating their value. This is why they are returned as strings.

## Response

Returns a [MultiStateResponse]({{< ref "../types/MultiStateResponse" >}}), same as the [multi-scopes endpoint]({{< ref "state-tables-scopes" >}}).
