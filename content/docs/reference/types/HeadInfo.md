
### `HeadInfo`

> Example `head_info` payload:


{{< highlight json >}}
{
  "type": "head_info",
  "data": {
    "last_irreversible_block_num": 22074884,
    "last_irreversible_block_id": "0150d604868df2ded03bb8e4452cefd0b9c84ae2da31bef6af62b2653c8bb5af",
    "head_block_num": 22075218,
    "head_block_id": "0150d7526b680955eaf4c9d94e17ff3f03d25a1dccb714601173c96b80921362",
    "head_block_time": "2018-11-22T21:00:35.5Z",
    "head_block_producer": "eosswedenorg"
  }
}
{{< /highlight >}}

Here are the fields under `data`:

Name | Type | Options | Description
-----|------|---------|------------
`head_block_num` | number (uint32) | required | Head block number
`head_block_id` | string | required | Head block ID
`head_block_time` | DateTime | required | Head block production time
`last_irreversible_block_id` | string | required | Block ID of the last irreversible block (at corresponding head block)
`last_irreversible_block_num` | number (uint32) | required | Block number corresponding to `last_irreversible_block_id`
