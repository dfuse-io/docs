---
pageTitle: TableDeltaResponse
---

# `TableDeltaResponse`

#### Properties

{{< method-list-item name="type" type="String" required="true" >}}
  The `transaction_lifecycle` string
{{< /method-list-item >}}

{{< method-list-item name="data" type="[TableDelta](/eosio/public-apis/reference/types/tabledelta)" required="true" >}}
  The change operation from a table, navigating forks with the `step` element.
{{< /method-list-item >}}

## Example Payload

{{< highlight json >}}
{
  "type": "table_delta",
  "req_id": "your-request-id",
  "data": {
    "block_num": 123,
    "step": "new",
    "dbop": {
      "op": "ins",
      "old": {},
      "new": {}
    }
  }
}
{{< /highlight >}}
