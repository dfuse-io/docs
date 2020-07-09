---
title: SearchTransactionsResponse
---

# `SearchTransactionsResponse`

#### Properties

{{< method-list-item name="transactions" type="Array<[SearchTransactionsRow](/eosio/reference/types/searchtransactionsrow)>" required="true" >}}
  List of `SearchTransactionsRow` objects.
{{< /method-list-item >}}

{{< method-list-item name="cursor" type="String" required="false" >}}
  [Cursor to pass back]({{< ref "../rest/search-transactions" >}}) to continue your query. Only present when hitting the `limit` value. Will be null when reaching the end of the block span searched.
{{< /method-list-item >}}

{{< method-list-item name="forked_head_warning" type="Boolean" required="false" >}}
  Signals that results previously fetched are at risk of being wrong because of network forks conditions. Will only show when `with_reversible` was set to `true`. See [pagination]({{< ref "../rest/search-transactions" >}}) for more details.
{{< /method-list-item >}}

## Example Payload

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
