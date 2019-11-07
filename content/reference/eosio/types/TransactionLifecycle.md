---
title: TransactionLifecycle
---

# `TransactionLifecycle`

#### Properties

Here are the fields under `data`:

{{< method-list-item name="id" type="String" required="true" >}}
  The transaction ID
{{< /method-list-item >}}

{{< method-list-item name="transaction_status" type="String" required="true" >}}
  One of_ `pending`, `delayed`, `canceled`, `expired`, `executed`, `soft_fail`, `hard_fail` | Computed status for the transaction
{{< /method-list-item >}}

{{< method-list-item name="transaction" type="Transaction" required="true" >}}
  Standard nodeos transaction object
{{< /method-list-item >}}

{{< method-list-item name="execution_trace" type="[TransactionTrace](/reference/eosio/types/transactiontrace)" required="false" >}}
  Traces of execution. In the case of a deferred transaction, you might not see execution traces
{{< /method-list-item >}}

{{< method-list-item name="execution_block_header" type="BlockHeader" required="false" >}}
  Standard `block_header` object for the block where the transaction got executed
{{< /method-list-item >}}

{{< method-list-item name="creation_tree" type="[CreationTree](/reference/eosio/types/creationtree)" required="false" >}}
  Represents the creation order of actions within this transaction.
{{< /method-list-item >}}

{{< method-list-item name="dtrxops" type="Array&lt;[DTrxOp](/reference/eosio/types/DTrxOp)&gt;" required="false" >}}
  A list of operations on deferred transactions (create, cancel...).
{{< /method-list-item >}}

{{< method-list-item name="ramops" type="Array&lt;[RAMOp](/reference/eosio/types/RAMOp)&gt;" required="false" >}}
  A list of operations on RAM usage, including operation, payer, delta, resulting usage.
{{< /method-list-item >}}

{{< method-list-item name="tableops" type="Array&lt;[TableOp](/reference/eosio/types/TableOp)&gt;" required="false" >}}
  A list of table operations, including operation, contract account, table, scope and payer.
{{< /method-list-item >}}

{{< method-list-item name="pub_keys" type="Array&lt;string&gt;" required="false" >}}
  List of public keys used to sign the transaction.
{{< /method-list-item >}}

{{< method-list-item name="created_by" type="[ExtDTrxop](/reference/eosio/types/extdtrxop)" required="false" >}}
  When querying a deferred transaction, reference to the transaction that created it.
{{< /method-list-item >}}

{{< method-list-item name="canceled_by" type="[ExtDTrxop](/reference/eosio/types/extdtrxop)" required="false" >}}
  Similar to `created_by`, the reference to another transaction that has canceled this one.
{{< /method-list-item >}}

{{< method-list-item name="execution_irreversible" type="Boolean" required="false" >}}
  Indicates execution passed irreversibility.
{{< /method-list-item >}}

{{< method-list-item name="creation_irreversible" type="Boolean" required="false" >}}
  Indicates transaction creation passed irreversibility. Valid only for deferred transactions
{{< /method-list-item >}}

{{< method-list-item name="cancelation_irreversible" type="Boolean" required="false" >}}
  Indicates cancelation passed irreversibility. Valid only for deferred transactions.
{{< /method-list-item >}}

## Example Payload

{{< highlight json >}}
{
  "transaction_status":"executed",
  "id": "da1abcf7e205cf410c35ba3d474fd8d854a7513d439f7f1188d186493253ed24",
  "transaction": { ... "actions": [ ... ] ... },
  "execution_trace": { ... },
  "execution_block_header": { ... },
  "creation_tree": [
    ...
  ],
  "dtrxops": [
    {
      "op": "CREATE",
      ...
      "trx_id": "da1abcf7e205cf410c35ba3d474fd8d854a7513d439f7f1188d186493253ed24",
      "trx": { ... }
    }
  ],
  "ramops": [ ... ],
  "tableops": [ ... ],
  "pub_keys": [
    "EOS86qtjWfMcVJjyLy4TGTybyA8xsFagJtXgwFJC1KR5o7M1ch5ms"
  ],
  "created_by": {
    "src_trx_id": "35030b5bfd05f4f5b5bcae68505bf9f2c227a84c6b406dabebe0d8cd0384cd70",
    "block_num": 25870889,
    "block_id": "018ac229323f3538cfde5c34f9cfcb1b2d80a4062a822c869d9eb9fcff2235db",
    "op": "CREATE",
    "action_idx": 0,
    "sender": "eosio.msig",
    ...
  },
  "canceled_by": null,
  "execution_irreversible": true,
  "creation_irreversible": true,
  "cancelation_irreversible": false
}
{{< /highlight >}}

Also see this {{< external-link title="source code for reference" href="https://github.com/dfuse-io/eosws-go/blob/master/mdl/v1/transaction.go#L68" >}}
