---
weight: 20
#same weight for all pages in this section to auto-order them A->Z
pageTitle: StateResponse
pageTitleIcon: eosio

sideNav: true
sideNavTitle: Public APIs
sideNavLinkRename: StateResponse

BookToC: true
#release: stable

aliases:
  - /reference/eosio/types/stateresponse/

---

## Type `StateResponse`

#### Properties

{{< method-list-item name="rows" type="Array&lt;[DBRow](/eosio/public-apis/reference/types/dbrow)&gt;" required="true" >}}
  An array of rows in the table, sorted by their uint64 key.
{{< /method-list-item >}}

{{< method-list-item name="up_to_block_id" type="String" required="false" >}}
  Block ID at which the snapshot was taken when querying the reversible chain segment. This will not be present if querying blocks older than the last irreversible block.
{{< /method-list-item >}}

{{< method-list-item name="up_to_block_num" type="Number (uint32)" required="false" >}}
  Block number extracted from `up_to_block_id` if present, provided as a convenience so you don't need to extract it yourself.
{{< /method-list-item >}}

{{< method-list-item name="last_irreversible_block_id" type="String" required="false" >}}
  Last irreversible block considered for this request. The returned snapshot is still for the requested `block_num`, even though the irreversible block shown here is more recent.
{{< /method-list-item >}}

{{< method-list-item name="last_irreversible_block_num" type="Number (uint32)" required="false" >}}
  Block number extracted from `last_irreversible_block_num`, provided as a convenience so you don't need to extract it yourself.
{{< /method-list-item >}}

{{< method-list-item name="abi" type="Object" required="false" >}}
  A JSON representation of the ABI that is stored within the account. It is the ABI in effect at the requested `block_num`.
{{< /method-list-item >}}

The main difference between a `StateResponse` and a
`MultiStateResponse` is the `rows` field above.

## Sample Response

Here is a sample response, for a request at `block_num: 8`:

{{< highlight json >}}
{
  "up_to_block_id": "0000001000000000000000000000000000000000000000000000000000000000",
  "up_to_block_num": 8,
  "last_irreversible_block_id": "0000000400000000000000000000000000000000000000000000000000000000",
  "last_irreversible_block_num": 4,
  "abi": {
    ...
  },
  "rows": [
    {
      "key": "account123",
      "payer": "account123",
      "json": {
        "owner": "account123"
      },
      "block": 1
    },
    ... or ...
    {
      "key": "account123",
      "payer": "account123",
      "hex": "0011223344556677",
      "block": 2
    },
    ...
  ]
}
{{< /highlight >}}
