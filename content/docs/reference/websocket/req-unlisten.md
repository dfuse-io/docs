---
title: unlisten
---

# `unlisten`

To interrupt a stream, you can `unlisten` with the original `req_id` like this:

#### Request input data fields:

> Request example:

{{< highlight json >}}
{"type": "unlisten", "data": {"req_id": "your-request-id"}}
{{< /highlight >}}


`req_id` required string
{: .argument-title}

The `req_id` passed to previous commands which included `listen=true`.


#### Responses first level data fields:

>Example `unlistened` payload:

{{< highlight json >}}
{"type":"unlistened","data":{"success":true}}
{{< /highlight >}}


If unlistened fails, you will receive a normal [error](#websocket-resp-error) message.