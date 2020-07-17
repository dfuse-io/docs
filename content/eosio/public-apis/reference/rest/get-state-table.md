---
weight: 20
#same weight for all pages in this section to auto-order them A->Z
pageTitle: GET /v0/state/table
pageTitleIcon: eosio

sideNav: true
sideNavTitle: Public APIs
sideNavLinkRename: GET /state/table

BookToC: true
release: stable

---

Fetches the state of any table, at any block height.

## Usage

Sample request:

{{< example-request id="search-transactions" url="https://mainnet.eos.dfuse.io/v0/state/table?account=eosio.token&scope=b1&table=accounts&block_num=25000000&json=true" >}}

## Requesting past blocks

The `block_num` parameter determines for which block you want a table
snapshot. This can be anywhere in the chain's history.

If the requested `block_num` is irreversible, you will get an
immutable snapshot.  If the `block_num` is still in a reversible
chain, you will get a full consistent snapshot, but it is not
guaranteed to pass irreversibility. Inspect the
returned `up_to_block_id` parameter to understand from which longest
chain the returned value is a snapshot of.


## ABI handling

The _dfuse_ API tracks ABI changes and will decode each row with the ABI
in effect at the `block_num` requested.

Rows are decoded only if `json: true` is passed. Otherwise,
hexadecimal of its binary data is returned instead.

If you requested a json-decoded form but it was impossible to decode a
row (ex: the ABI was not well formed at that `block_num`), the `hex`
representation would be returned along with an `error` field
containing the decoding error.

#### Input parameters

{{< method-list-item name="account" type="[AccountName](/eosio/public-apis/reference/types/accountname)" required="true" >}}
  Contract account targeted by the action.
{{< /method-list-item >}}

{{< method-list-item name="scope" type="[AccountName](/eosio/public-apis/reference/types/accountname)" required="true" >}}
  Contract account targeted by the action.
{{< /method-list-item >}}

{{< method-list-item name="table" type="[TableName](/eosio/public-apis/reference/types/tablename)" required="true" >}}
  The _name-encoded_ table name you want to retrieve.  For example, user balances for tokens live in the `accounts` table.  Refer to the contract's ABI for a list of available tables.  This is contract dependent.
{{< /method-list-item >}}

{{< method-list-item name="block_num" type="Number" required="false" >}}
  The block number for which you want to retrieve the consistent table snapshot.
{{< /method-list-item >}}

{{< method-list-item name="json" type="Boolean" required="false" >}}
  Defaults to `false`. Decode each row from its binary form into JSON. If `json: false`, then hexadecimal representation of its binary data is returned instead.
{{< /method-list-item >}}

{{< method-list-item name="key_type" type="String" required="false" >}}
  Defaults to `name`, see [KeyType](#state-table-KeyType) for valid values. How to represent the row keys in the returned table.
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
 * `hex` for hexadecimal encoding, ex: `abcdef1234567890`
 * `hex_be` for big endian hexadecimal encoding, ex: `9078563412efcdab`
 * `uint64` for *string* encoded uint64. Beware: uint64 can be very large numbers and some programming languages need special care to decode them without truncating their value. This is why they are returned as strings.

## Response

Returns a [StateResponse]({{< ref "../types/StateResponse" >}})

## Table Row

{{< method-list-item name="key" type="String" required="true" >}}
  The encoded key (as requested with `key_type`) for the row
{{< /method-list-item >}}

{{< method-list-item name="payer" type="[AccountName](/eosio/public-apis/reference/types/accountname)" required="true" >}}
  The name-encoded account that was billed RAM to store this row.
{{< /method-list-item >}}

{{< method-list-item name="block" type="Number (uint32)" required="false" >}}
  The block num when this row was last modified (as requested by `with_block_num`).
{{< /method-list-item >}}

{{< method-list-item name="json" type="Object" required="false" >}}
  Returned when `json: true` and ABI decoding succeeded, absent otherwise | A JSON representation of the binary data, decoded through the active ABI at that block height.
{{< /method-list-item >}}

{{< method-list-item name="hex" type="String" required="false" >}}
  Returned when `json: false`, absent otherwise | A string-encoded hexadecimal representation of the binary data in that row.
{{< /method-list-item >}}

{{< method-list-item name="error" type="String" required="false" >}}
  An error string in case the binary data failed to be decoded through the ABI.
{{< /method-list-item >}}

Each row will have one of `hex` or `json` present.
