---
weight: 20
#same weight for all pages in this section to auto-order them A->Z
pageTitle: HeadInfo
pageTitleIcon: eosio

sideNav: true
sideNavTitle: Public APIs
sideNavLinkRename: HeadInfo

BookToC: true
#release: stable

---

## Type `HeadInfo`

#### Properties

Here are the fields under `data`:

{{< method-list-item name="head_block_num" type="Number (uint32)" required="true" >}}
  Head block number
{{< /method-list-item >}}

{{< method-list-item name="head_block_id" type="String" required="true" >}}
  Head block ID
{{< /method-list-item >}}

{{< method-list-item name="head_block_time" type="DateTime" required="true" >}}
  Head block production time
{{< /method-list-item >}}

{{< method-list-item name="last_irreversible_block_id" type="String" required="true" >}}
  Block ID of the last irreversible block (at corresponding head block)
{{< /method-list-item >}}

{{< method-list-item name="last_irreversible_block_num" type="Number (uint32)" required="true" >}}
  Block number corresponding to `last_irreversible_block_id`
{{< /method-list-item >}}

## Example Payload

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