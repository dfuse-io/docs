---
title: TableSnapshotResponse
---

# `TableSnapshotResponse`

#### Properties

{{< method-list-item name="type" type="String" required="true" >}}
   The `table_snapshot` string
{{< /method-list-item >}}

{{< method-list-item name="data" type="[TableRows](/reference/eosio/types/tablerows)" required="true" >}}
   Rows for the corresponding `get_table_rows` request. The `TableRows` object will not contain `account` nor `scope` in this case.
{{< /method-list-item >}}

## Example Payload

{{< highlight json >}}
{"type": "table_snapshot",
 "req_id": "your-request-id",
 "data": {
  "rows": [
   {
    ...
   }]
}}
{{< /highlight >}}