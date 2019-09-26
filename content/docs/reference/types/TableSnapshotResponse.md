
### `TableSnapshotResponse`

> Example `table_snapshot` response payload:

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

Name | Type | Options | Description
-----|------|---------|------------
`type` | string | required | The `table_snapshot` string
`data` | [TableRows](#type-TableRows) | required | Rows for the corresponding `get_table_rows` request. The `TableRows` object will not contain `account` nor `scope` in this case.
