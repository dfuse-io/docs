---
title: SearchTransactionsResponse
---

# `SearchTransactionsResponse`

Example payload:

{{< highlight json >}}
{
  "cursor": "dno3ojdbEpHZV73TfVnvbfWzIpU9BlpvXwo=",
  "transactions": [
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
  ]
}
{{< /highlight >}}

Name | Type | Options | Description
-----|------|---------|------------
`cursor` | string | optional | [Cursor to pass back](#rest-get-v0-search-transactions) to continue your query. Only present when hitting the `limit` value. Will be null when reaching the end of the block span searched.
`transactions` | array<[SearchTransactionsRow](#type-SearchTransactionsRow)> | required | List of `SearchTransactionsRow` objects.
`forked_head_warning` | boolean | optional | Signals that results previously fetched are at risk of being wrong because of network forks conditions. Will only show when `with_reversible` was set to `true`. See [pagination](#ref-search-pagination) for more details.
