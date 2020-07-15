---
pageTitle: TransactionLifecycleResponse
---

# `TransactionLifecycleResponse`

#### Properties

Here are the fields under `data`:

{{< method-list-item name="type" type="String" required="true" >}}
  The `transaction_lifecycle` string
{{< /method-list-item >}}

{{< method-list-item name="data.lifecycle" type="[TransactionLifecycle](/eosio/public-apis/reference/types/transactionlifecycle)" required="true" >}}
  The lifecycle object being tracked.
{{< /method-list-item >}}

## Example Payload

{{< highlight json >}}
{
  "type": "transaction_lifecycle",
  "data": {
    "lifecycle": {
      "transaction_status":"executed",
      "id": "da1abcf7e205cf410c35ba3d474fd8d854a7513d439f7f1188d186493253ed24",
      "transaction": { ... "actions": [ ... ] ... },
      "execution_trace": { ... },
      ...
    }
  }
}
{{< /highlight >}}
