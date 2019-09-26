# <span class="get">GET</span> `/v0/block_id/by_time`

> Sample request:

{{< highlight shell >}}
curl -H "Authorization: Bearer $TOKEN" "https://mainnet.eos.dfuse.io/v0/block_id/by_time?time=2019-03-04T10:36:14.5Z&comparator=gte"
{{< /highlight >}}

> Sample response (for `time=2019-03-04T10:36:14.6Z&comparator=gte`)

{{< highlight json >}}
{
  "block": {
    "id": "02bb43ae0d74a228f021f598b552ffb1f8d2de2c29a8ea16a897d643e1d62d62",
    "num": 45826990,
    "time": "2019-03-04T10:36:15Z"
  }
}
{{< /highlight >}}

Fetches the block ID, time and block number for the given timestamp.

### Input parameters

Name | Type | Description
-----|------|------------
`time` | DateTime | Reference timestamp (ISO8601 extended format, ex: `2019-03-04T10:36:14.5Z`)
`comparator` | String | Comparison operator for the block time. Should be one of `gt`, `gte`, `lt`, `lte` or `eq`.

### Response

Returns a `block` JSON object, containing the following fields:

Name | Type | Description
-----|------|------------
`id` | string | Block ID
`num` | number (uint32) | Block Number
`time` | DateTime | Timestamp of the matching block (according to its production schedule, so always aligned with 500ms time slots)


