---
weight: 1
title: GET /v0/state/table/row
---

# GET `/v0/state/table/row`

Fetches a single row from the state of any table, at any block height.

## Usage

Sample request:

{{< highlight shell >}}
curl -H "Authorization: Bearer $TOKEN" \
    "https://mainnet.eos.dfuse.io/v0/state/table/row?account=eosio.token&scope=b1&table=accounts&primary_key=EOS&key_type=symbol_code&block_num=25000000&json=true"
{{< /highlight >}}

## Requesting past blocks

The `block_num` parameter determines for which block you want a table row snapshot. This can be anywhere in the chain's history.

If the requested `block_num` is irreversible, you will get an immutable snapshot.  If the `block_num` is still in a reversible chain, you will get a full consistent snapshot, but it is not guaranteed to pass irreversibility. Inspect the returned `up_to_block_id` parameter to understand from which longest chain the returned value is a snapshot of.


## ABI handling

The _dfuse_ API tracks ABI changes and will the row with the ABI in effect at the `block_num` requested.

Row is decoded only if `json: true` is passed. Otherwise, hexadecimal of its binary data is returned instead.

If you requested a json-decoded form but it was impossible to decode a row (ex: the ABI was not well formed at that `block_num`), the `hex` representation would be returned along with an `error` field containing the decoding error.

## Input parameters

Name | Type | Options | Description
-----|------|---------|------------
`account` | [AccountName](#type-AccountName) | required | Contract account targeted by the action.
`scope` | [AccountName](#type-AccountName) | required | The _name-encoded_ scope of the table you are requesting.  For example, user balances for tokens live in their account name's scope. This is contract dependent, so inspect the ABI for the contract you are interested in.
`table` | [TableName](#type-TableName) | required | The _name-encoded_ table name you want to retrieve.  For example, user balances for tokens live in the `accounts` table.  Refer to the contract's ABI for a list of available tables.  This is contract dependent.
`primary_key` | string | required | The string representation of the primary key that you want to retrieve. The `primaryKey` is always a string, but can be encoded differently, for example `name` encoded like an account. The `key_type` is used to know how to transform the value in the string to the correct type. This is contract dependent.
`block_num` | number | optional, _defaults_ to head block num | The block number for which you want to retrieve the consistent table snapshot.
`json` | boolean | optional, _defaults_ to `false` | Decode each row from its binary form into JSON. If `json: false`, then hexadecimal representation of its binary data is returned instead.
`key_type` | string | optional, _defaults_ to `name`, see [KeyType](#state-table-KeyType) for valid values | How to represent the row keys in the returned table as well as how to interpret the `primary_key` received in string.
`with_block_num` | boolean | optional, _defaults_ to `false` | Will return one `block_num` with each row. Represents the block at which that row was last changed.
`with_abi` | boolean | optional, _defaults_ to `false` | Will return the ABI in effect at block `block_num`.

<!---
FIXME: This KeyType is duplicated from `state-tables-scopes.md` and `state-table.md`
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

Returns a [StateTableRowResponse](#type-StateTableRowResponse)

See also [Table Row](#type-state-TableRow) for schema of the actual row returned.