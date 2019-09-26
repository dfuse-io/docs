
### `SearchTransactionsRow`

> Example payload:


{{< highlight json >}}
{
  "lifecycle": {
    "transaction_status": "executed",
    "id": "7c5d768973152e0465a2a3eba88689d012ffd4b16cfdd41291e6d7830530d1cb",
    ...
  },
  "action_idx": [
    0
  ]
}
{{< /highlight >}}


Name | Type | Options | Description
-----|------|---------|------------
`lifecycle` | [TransactionLifecycle](#type-TransactionLifecycle) | required | Full transaction where some of its actions matched.
`action_idx` | array<Number> | required | Indexes of the actions (indexed by depth-first search through `inline_traces`, base 0) that matched the search query.
