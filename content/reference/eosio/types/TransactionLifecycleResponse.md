---
title: TransactionLifecycleResponse
---

# `TransactionLifecycleResponse`

 Example `transaction_lifecycle` response payload:

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

Here are the fields under `data`:

Name | Type | Options | Description
-----|------|---------|------------
`type` | string | required | The `transaction_lifecycle` string
`data.lifecycle` | [TransactionLifecycle]({{< ref "./TransactionLifecycle" >}}) | required | The lifecycle object being tracked.
