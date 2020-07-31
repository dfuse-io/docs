---
weight: 20
title: TableDelta
aliases:
  - /reference/eosio/types/tabledelta/

---

## Type `TableDelta`

#### Properties

{{< method-list-item name="block_num" type="Number (uint32)" required="true" >}}
  Block that produced such a change
{{< /method-list-item >}}

{{< method-list-item name="step" type="String" required="true" >}}
  One of_ `new`, `undo`, `redo` | See [Table Delta Handling Forks]({{< ref "../websocket/req-get-table-rows#handling-forks" >}}) section for details
{{< /method-list-item >}}

{{< method-list-item name="dbop" type="[DBOp](/eosio/public-apis/reference/types/dbop)" required="true" >}}
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
