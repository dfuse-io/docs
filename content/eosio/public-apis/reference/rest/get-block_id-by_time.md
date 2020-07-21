---
weight: 20
#same weight for all pages in this section to auto-order them A->Z
pageTitle: GET /v0/block_id/by_time
pageTitleIcon: eosio

sideNav: true
sideNavTitle: Public APIs
sideNavLinkRename: GET /block_id/by_time

BookToC: true
release: stable

aliases:
  - /reference/eosio/rest/block-id-by-time/

---

Get the block ID produced at a given time.

## Usage

The following example fetches the block ID, time and block number for the timestamp `2019-03-04T10:36:14.6Z`.

{{< example-request id="req-by-time" url="https://mainnet.eos.dfuse.io/v0/block_id/by_time?time=2019-03-04T10:36:14.5Z&comparator=gte" >}}

{{< tabs "block-id-response">}}
{{< tab title="Response" lang="json" >}}
{
  "block": {
    "id": "02bb43ae0d74a228f021f598b552ffb1f8d2de2c29a8ea16a897d643e1d62d62",
    "num": 45826990,
    "time": "2019-03-04T10:36:15Z"
  }
}
{{< /tab >}}
{{< /tabs >}}

#### Input parameters

{{< method-list-item name="time" type="DateTime" required="true" >}}
  Reference timestamp (ISO8601 extended format, ex: `2019-03-04T10:36:14.5Z`)
{{< /method-list-item >}}

{{< method-list-item name="comparator" type="String" required="true" >}}
  Comparison operator for the block time. Should be one of `gt`, `gte`, `lt`, `lte` or `eq`.
{{< /method-list-item >}}


#### Response

Returns a `block` JSON object, containing the following fields.

{{< method-list-item name="id" type="Number (uint32)" >}}
  Block ID
{{< /method-list-item >}}

{{< method-list-item name="num" type="Number" >}}
  Block Number
{{< /method-list-item >}}

{{< method-list-item name="time" type="DateTime" >}}
  Timestamp of the matching block (according to its production schedule, so always aligned with 500ms time slots)
{{< /method-list-item >}}
