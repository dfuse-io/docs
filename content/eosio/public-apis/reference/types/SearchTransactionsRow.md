---
title: SearchTransactionsRow
---

# `SearchTransactionsRow`

#### Properties

{{< method-list-item name="lifecycle" type="[TransactionLifecycle](/eosio/reference/types/transactionlifecycle)" required="true" >}}
  Full transaction where some of its actions matched.
{{< /method-list-item >}}

{{< method-list-item name="action_idx" type="Array<Number>" required="true" >}}
  Indexes of the actions (indexed by depth-first search through `inline_traces`, base 0) that matched the search query.
{{< /method-list-item >}}

## Example Payload

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
