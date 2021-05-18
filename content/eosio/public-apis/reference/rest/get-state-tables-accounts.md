---
weight: 20
title: GET /v0/state/tables/accounts
release: stable
aliases:
  - /reference/eosio/rest/state-tables-accounts/
---

Fetches a table from a group of contract accounts, at any block height.

## Usage

Most parameters are similar to the `/v0/state/table` request, except for the `accounts` parameter, which accepts a list of `account` separated by the pipe character (`|`).

The output format is slightly different too.

Sample request:

{{< example-request id="search-transactions" url="https://testnet.eos.dfuse.io/v0/state/tables/accounts?accounts=eosio.token|eosadddddddd|tokenbyeocat|ethsidechain|epraofficial|alibabapoole|hirevibeshvt|oo1122334455|irespotokens|publytoken11|parslseed123|trybenetwork|zkstokensr4u&scope=b1&table=accounts&block_num=25000000&json=true" >}}

## Requesting past blocks & ABI handling

This request exhibits the same patterns as the simpler
[/v0/state/table]({{< ref "./get-state-table" >}}) query.


#### Input Parameters

{{< method-list-item name="accounts" type="String" required="true" >}}
  An [AccountName]({{< ref "../types/AccountName" >}}) list, separated by the pipe character <code>&#124;</code>, a maximum of 1500 elements can be present in the list.
{{< /method-list-item >}}

{{< method-list-item name="scope" type="[Name](/eosio/public-apis/reference/types/name)" required="true" >}}
  The _name-encoded_ scope of the table you are requesting.  For example, user balances for tokens live in their account name's scope. This is contract dependent, so inspect the ABI for the contract you are interested in.
{{< /method-list-item >}}

{{< method-list-item name="table" type="[TableName](/eosio/public-apis/reference/types/tablename)" required="true" >}}
  The _name-encoded_ table name you want to retrieve.  For example, user balances for tokens live in the `accounts` table.  Refer to the contract's ABI for a list of available tables.  This is contract dependent.
{{< /method-list-item >}}

{{< method-list-item name="block_num" type="Number" required="false" >}}
  Defaults to head block num. The block number for which you want to retrieve the consistent table snapshot.
{{< /method-list-item >}}

{{< method-list-item name="json" type="Boolean" required="false" >}}
  Defaults to `false`. Decode each row from its binary form into JSON. If `json: false`, then hexadecimal representation of its binary data is returned instead.
{{< /method-list-item >}}

{{< method-list-item name="key_type" type="String" required="false" >}}
  Defaults to `name`. How to represent the row keys in the returned table.
{{< /method-list-item >}}

{{< method-list-item name="with_block_num" type="Boolean" required="false" >}}
  Defaults to `false`. Will return one `block_num` with each row. Represents the block at which that row was last changed.
{{< /method-list-item >}}

{{< method-list-item name="with_abi" type="Boolean" required="false" >}}
  Defaults to `false`. Return the ABI in effect at block `block_num`.
{{< /method-list-item >}}

<!---
FIXME: This KeyType is duplicated from `get-state-tables-scopes.md` and `get-state-table.md`
-->

## Key Type

The key type can be one of the following values:

 * `name` _(default)_ for EOS name-encoded base32 representation of the row key
 * `hex` for hexadecimal encoding, ex: `abcdef1234567890`
 * `hex_be` for big endian hexadecimal encoding, ex: `9078563412efcdab`
 * `uint64` for *string* encoded uint64. Beware: uint64 can be very large numbers and some programming languages need special care to decode them without truncating their value. This is why they are returned as strings.

## Response

Returns a [MultiStateResponse]({{< ref "../types/MultiStateResponse" >}}), same as the [multi-scopes endpoint]({{< ref "get-state-tables-scopes" >}}).
