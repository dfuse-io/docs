---
title: get_transaction_lifecycle
---

# `get_transaction_lifecycle`

Retrieve a "transaction_lifecycle" (when "fetch" is true) and follow
its life-cycle (with "listen" is true)

When following a transaction, any new block referencing that transaction
will trigger an updated version of "transaction_lifecycle" to be sent.
When one of those blocks passes irreversibility, you will also receive
an updated transaction_lifecycle object.

#### Request input data fields:

> Example request

{{< highlight json >}}
{
  "type": "get_transaction",
  "fetch": true,
  "listen": true,
  "data": {
    "id": "da1abcf7e205cf410c35ba3d474fd8d854a7513d439f7f1188d186493253ed24"
  }
}
{{< /highlight >}}

`id` required string
{: .argument-title}

The transaction ID you want to keep track of


#### Responses

On both `fetch: true` and `listen: true` requests, _dfuse_ will stream back [TransactionLifecycle](#type-TransactionLifecycle) objects.
