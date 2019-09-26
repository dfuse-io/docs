---
weight: 1
title: GET /v0/state/tables/scopes
---

# GET `/v0/state/tables/scopes`

Fetches all rows for a table in a given contract for a group of
scopes, at any block height.

Most parameters are similar to the `/v0/state/table` request, except
for the `scopes` parameter, which accepts a list of name-encoded scopes
separated by the pipe character (`|`).

The output format is slightly different too.

> Sample request:

{{< highlight shell >}}
curl -H "Authorization: Bearer $TOKEN" \
    "https://mainnet.eos.dfuse.io/v0/state/tables/scopes?account=eosio&scopes=eosio.token|eosadddddddd|tokenbyeocat|ethsidechain|epraofficial|alibabapoole|hirevibeshvt|oo1122334455|irespotokens|publytoken11|parslseed123|trybenetwork|zkstokensr4u&table=delband&block_num=25000000&json=true"
{{< /highlight >}}

*NOTE*: Not to be confused with
[/v0/state/table_scopes](#rest-get-v0-state-table-scopes) which
retrieves the only the scope names. Paired with this endpoint, you can
get a consistent view of all tables in a contract.


### Requesting past blocks & ABI handling

This request exhibits the same patterns as the simpler
[`/v0/state/table`](#rest-get-v0-state-table) query.


### Input parameters

Name | Type | Options | Description
-----|------|---------|------------
`account` | [AccountName](#type-AccountName) | required | Contract account targeted by the action.
`scopes` | string | required | A [Name](#type-Name) list, separated by the pipe character <code>&#124;</code>, a maximum of 1500 elements can be present in the list.
`table` | [TableName](#type-TableName) | required | The _name-encoded_ table name you want to retrieve.  For example, user balances for tokens live in the `accounts` table.  Refer to the contract's ABI for a list of available tables.  This is contract dependent.
`block_num` | number | optional, _defaults_ to head block num | The block number for which you want to retrieve the consistent table snapshot.
`json` | boolean | optional, _defaults_ to `false` | Decode each row from its binary form into JSON. If `json: false`, then hexadecimal representation of its binary data is returned instead.
`key_type` | string | optional, _defaults_ to `name` | How to represent the row keys in the returned table.
`with_block_num` | boolean | optional, _defaults_ to `false` | Will return one `block_num` with each row. Represents the block at which that row was last changed.
`with_abi` | boolean | optional, _defaults_ to `false` | Return the ABI in effect at block `block_num`.

<!---
FIXME: This KeyType is duplicated from `state-tables-scopes.md` and `state-table.md`
-->


### Key Type

The key type can be one of the following values:

 * `name` _(default)_ for EOS name-encoded base32 representation of the row key
 * `hex` for hexadecimal encoding, ex: `abcdef1234567890`
 * `hex_be` for big endian hexadecimal encoding, ex: `9078563412efcdab`
 * `uint64` for *string* encoded uint64. Beware: uint64 can be very large numbers and some programming languages need special care to decode them without truncating their value. This is why they are returned as strings.

### Response

Returns a [MultiStateResponse](#type-MultiStateResponse), same as the [multi-accounts endpoint](#rest-get-v0-state-tables-accounts).
