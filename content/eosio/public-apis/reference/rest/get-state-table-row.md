---
weight: 20
title: GET /v0/state/table/row
release: stable
aliases:
  - /reference/eosio/rest/state-table-row/
---

Fetches a single row from the state of any table, at any block height.

## Usage

Sample request:

{{< example-request id="search-transactions" url="https://testnet.eos.dfuse.io/v0/state/table/row?account=eosio.token&scope=b1&table=accounts&primary_key=EOS&key_type=symbol_code&block_num=25000000&json=true" >}}

## Requesting past blocks

The `block_num` parameter determines for which block you want a table row snapshot. This can be anywhere in the chain's history.

If the requested `block_num` is irreversible, you will get an immutable snapshot.  If the `block_num` is still in a reversible chain, you will get a full consistent snapshot, but it is not guaranteed to pass irreversibility. Inspect the returned `up_to_block_id` parameter to understand from which longest chain the returned value is a snapshot of.


## ABI handling

The _dfuse_ API tracks ABI changes and will decode the row with the ABI in effect at the `block_num` requested.

Row is decoded only if `json: true` is passed. Otherwise, hexadecimal of its binary data is returned instead.

If you requested a json-decoded form but it was impossible to decode a row (ex: the ABI was not well formed at that `block_num`), the `hex` representation would be returned along with an `error` field containing the decoding error.

#### Input parameters

{{< method-list-item name="account" type="[AccountName](/eosio/public-apis/reference/types/accountname)" required="true" >}}
  Contract account targeted by the action.
{{< /method-list-item >}}

{{< method-list-item name="scope" type="[AccountName](/eosio/public-apis/reference/types/accountname)" required="true" >}}
  The _name-encoded_ scope of the table you are requesting.  For example, user balances for tokens live in their account name's scope. This is contract dependent, so inspect the ABI for the contract you are interested in.
{{< /method-list-item >}}

{{< method-list-item name="table" type="[TableName](/eosio/public-apis/reference/types/tablename)" required="true" >}}
  The _name-encoded_ table name you want to retrieve.  For example, user balances for tokens live in the `accounts` table.  Refer to the contract's ABI for a list of available tables.  This is contract dependent.
{{< /method-list-item >}}

{{< method-list-item name="primary_key" type="String" required="true" >}}
  The string representation of the primary key that you want to retrieve. The `primaryKey` is always a string, but can be encoded differently, for example `name` encoded like an account. The `key_type` is used to know how to transform the value in the string to the correct type. This is contract dependent.
{{< /method-list-item >}}

{{< method-list-item name="block_num" type="Number" required="false" >}}
  Defaults to head block num. The block number for which you want to retrieve the consistent table snapshot.
{{< /method-list-item >}}

{{< method-list-item name="json" type="Boolean" required="false" >}}
  Defaults to `false`. Decode each row from its binary form into JSON. If `json: false`, then hexadecimal representation of its binary data is returned instead.
{{< /method-list-item >}}

{{< method-list-item name="key_type" type="String" required="false" >}}
  Defaults to `name`, see [Key Type](#key-type) for valid values. How to represent the row keys in the returned table as well as how to interpret the `primary_key` received in string.
{{< /method-list-item >}}

{{< method-list-item name="with_block_num" type="Boolean" required="false" >}}
  Defaults to `false`. Will return one `block_num` with each row. Represents the block at which that row was last changed.
{{< /method-list-item >}}

{{< method-list-item name="with_abi" type="Boolean" required="false" >}}
  Defaults to `false`. Will return the ABI in effect at block `block_num`.
{{< /method-list-item >}}

<!---
FIXME: This KeyType is duplicated from `get-state-tables-scopes.md` and `get-state-table.md`
-->

## Key Type

The key type can be one of the following values:

 * `name` _(default)_ for EOS name-encoded base32 representation of the row key
 * `symbol` for EOS asset's symbol representation of the row key, a symbol is always composed
   of a precision and symbol code in the form of `4,EOS`.
 * `symbol_code` for EOS asset's symbol code representation of the row key, a symbol code is always composed
   of solely of 1 to 7 upper case characters like `EOS`.
 * `hex` for hexadecimal encoding, ex: `abcdef1234567890`
 * `hex_be` for big endian hexadecimal encoding, ex: `9078563412efcdab`
 * `uint64` for *string* encoded uint64. Beware: uint64 can be very large numbers and some programming languages need special care to decode them without truncating their value. This is why they are returned as strings.

## Response

Returns a [StateTableRowResponse]({{< ref "../types/StateTableRowResponse" >}})

See also [Sample Response]({{< ref "../types/StateTableRowResponse#sample-response" >}}) for schema of the actual row returned.
