
### `TableDelta`

> Example `table_delta` payload:

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

Name | Type | Options | Description
-----|------|---------|------------
`block_num` | number (uint32) | required | Block that produced such a change
`step` | string | required, _one of_ `new`, `undo`, `redo` | Step in the [forks navigation](#websocket-navigating-forks)
`dbop` | [DBOp](#type-DBOp) | required | Database operation
