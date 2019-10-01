---
title: StateResponse
---

# `StateResponse`

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

Name | Type | Options | Description
-----|------|---------|------------
`up_to_block_id` | string | optional | Block ID at which the snapshot was taken when querying the reversible chain segment. This will not be present if querying blocks older than the last irreversible block.
`up_to_block_num` | number (uint32) | optional | Block number extracted from `up_to_block_id` if present, provided as a convenience so you don't need to extract it yourself.
`last_irreversible_block_id` | string | optional | Last irreversible block considered for this request. The returned snapshot is still for the requested `block_num`, even though the irreversible block shown here is more recent.
`last_irreversible_block_num` | number (uint32) | optional | Block number extracted from `last_irreversible_block_num`, provided as a convenience so you don't need to extract it yourself.
`abi` | object | optional | A JSON representation of the ABI that is stored within the account. It is the ABI in effect at the requested `block_num`.
`rows` | Array&lt;[DBRow]({{< ref "./DBRow" >}})&gt; | required | An array of rows in the table, sorted by their uint64 key.

The main difference between a `StateResponse` and a
`MultiStateResponse` is the `rows` field above.
