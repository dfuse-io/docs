---
title: TableDelta
---

# `TableDelta`

#### Properties

{{< method-list-item name="block_num" type="Number (uint32)" required="true" >}}
  Block that produced such a change
{{< /method-list-item >}}

{{< method-list-item name="step" type="String" required="true" >}}
  One of_ `new`, `undo`, `redo` | Step in the [forks navigation]({{< ref "../websocket/navigating-forks" >}})
{{< /method-list-item >}}

{{< method-list-item name="dbop" type="[DBOp](/reference/eosio/types/dbop)" required="true" >}}
  Database operation
{{< /method-list-item >}}

## Example Payload

{{< highlight json >}}
{
  "block_num": 123,
  "step": "new",
  "dbop": {
    "op": "upd",
    "old": {},
    "new": {}
  }
}
{{< /highlight >}}