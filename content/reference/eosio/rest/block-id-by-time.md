---
weight: 1
title: GET /v0/block_id/by_time
---

# GET `/v0/block_id/by_time`

Get the block ID produced at a given time

## Usage

The following example fetches the block ID, time and block number for the timestamp `2019-03-04T10:36:14.6Z`.

{{< include "reference/eosio/rest/snippets/_block-id-by-time-example-req-res.md" >}}

## Input parameters

Name | Type | Description
-----|------|------------
`time` | DateTime | Reference timestamp (ISO8601 extended format, ex: `2019-03-04T10:36:14.5Z`)
`comparator` | String | Comparison operator for the block time. Should be one of `gt`, `gte`, `lt`, `lte` or `eq`.

## Response

Returns a `block` JSON object, containing the following fields.

Name | Type | Description
-----|------|------------
`id` | string | Block ID
`num` | uint32 | Block Number
`time` | DateTime | Timestamp of the matching block (according to its production schedule, so always aligned with 500ms time slots)