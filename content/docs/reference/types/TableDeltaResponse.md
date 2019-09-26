
### `TableDeltaResponse`

> Example `table_delta` response payload:

{{< highlight json >}}
{"type": "table_delta",
 "req_id": "your-request-id",
 "data": {
  "block_num": 123,
  "step": "new",
  "dbop": {
    "op": "ins",
    "old": {},
    "new": {}
  }
}}
{{< /highlight >}}

Name | Type | Options | Description
-----|------|---------|------------
`type` | string | required | The `transaction_lifecycle` string
`data` | [TableDelta](#type-TableDelta) | required | The change operation from a table, navigating forks with the `step` element.
