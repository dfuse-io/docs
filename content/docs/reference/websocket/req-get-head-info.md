---
title: get_head_info
---

# `get_head_info`

Retrieve a stream of informations about the chain as it moves forward

#### Request input data fields:

> Example request

{{< highlight json >}}
{
  "type": "get_head_info",
  "listen": true,
  "req_id": "your-request-id"
}
{{< /highlight >}}


None.


#### Responses

When requesting `listen: true`, _dfuse_ will stream [HeadInfo](#type-HeadInfo) objects.
