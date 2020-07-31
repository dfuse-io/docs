---
weight: 40
title: get_head_info
release: stable
aliases:
  - /reference/eosio/websocket/req-get-head-info/
---

Retrieve a stream of informations about the chain as it moves forward

## Usage

Example request:

{{< highlight json >}}
{
  "type": "get_head_info",
  "listen": true,
  "req_id": "your-request-id"
}
{{< /highlight >}}


#### Arguments

None.

#### Responses

When requesting `listen: true`, _dfuse_ will stream [HeadInfo]({{< ref "../types/HeadInfo" >}}) objects.
