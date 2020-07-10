---
title: MultiStateResponse
---

# `MultiStateResponse`

#### Properties

{{< method-list-item name="tables" type="Array&lt;[TableRows](/eosio/public-apis/reference/types/tablerows)&gt;" required="true" >}}
  An array of tables, one for each queried account, unsorted.
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

## Sample Response

For a request at `block_num: 8`:

{{< highlight json >}}
{
  "up_to_block_id": "0000001000000000000000000000000000000000000000000000000000000000",
  "up_to_block_num": 8,
  "last_irreversible_block_id": "0000000400000000000000000000000000000000000000000000000000000000",
  "last_irreversible_block_num": 4,
  ...
  "tables": [
    {
      "account": "oo1122334455",
      "scope": "eoscanadacom",
      "rows": [
        {
          "key": "1397706825",
          "payer": "iambillgates",
          "json": {
            "balance": "2000.0000 IPOS"
          }
        }
      ]
    }
  ]
}
{{< /highlight >}}
