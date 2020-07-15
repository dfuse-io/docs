---
pageTitle: unlisten
---

Allows to interrupt a stream.

## Usage

To interrupt a stream, you can `unlisten` with the original `req_id` like this:

Request example:

{{< highlight json >}}
{"type": "unlisten", "data": {"req_id": "your-request-id"}}
{{< /highlight >}}

#### Arguments

`req_id` `required string`<br>
The `req_id` passed to previous commands which included `listen=true`.

#### Responses

{{< highlight json >}}
{"type":"unlistened","data":{"success":true}}
{{< /highlight >}}

If unlistened fails, you will receive a normal [error]({{< ref "../#responses-error" >}}) message.