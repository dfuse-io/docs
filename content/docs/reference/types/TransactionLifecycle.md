
### `TransactionLifecycle`

> Example TransactionLifecycle payload:

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

Here are the fields under `data`:

Name | Type | Options | Description
-----|------|---------|------------
`id` | string | required | the transaction ID
`transaction_status` | string | required, _one of_ `pending`, `delayed`, `canceled`, `expired`, `executed`, `soft_fail`, `hard_fail` | Computed status for the transaction
`transaction` | [Transaction](#type-Transaction) | required | Standard nodeos transaction object
`execution_trace` | [TransactionTrace](#type-TransactionTrace) | optional | Traces of execution. In the case of a deferred transaction, you might not see execution traces
`execution_block_header` | BlockHeader | optional | Standard `block_header` object for the block where the transaction got executed
`creation_tree` | [CreationTree](#type-CreationTree) | optional | Represents the creation order of actions within this transaction.
`dtrxops` | array&lt;[DTrxOp](#type-DTrxOp)&gt; | optional | A list of operations on deferred transactions (create, cancel...).
`ramops` | array&lt;[RAMOp](#type-RAMOp)&gt; | optional | A list of operations on RAM usage, including operation, payer, delta, resulting usage.
`tableops` | array&lt;[TableOp](#type-TableOp)&gt; | optional | A list of table operations, including operation, contract account, table, scope and payer.
`pub_keys` | array&lt;string&gt; | optional | List of public keys used to sign the transaction.
`created_by` | [ExtDTrxop](#type-ExtDTrxOp) | optional | When querying a deferred transaction, reference to the transaction that created it.
`canceled_by` | [ExtDTrxop](#type-ExtDTrxOp) | optional | Similar to `created_by`, the reference to another transaction that has canceled this one.
`execution_irreversible` | boolean | optional | Indicates execution passed irreversibility.
`creation_irreversible` | boolean | optional | Indicates transaction creation passed irreversibility. Valid only for deferred transactions
`cancelation_irreversible` | boolean | optional | Indicates cancelation passed irreversibility. Valid only for deferred transactions.

Also see this [source code for reference](https://github.com/dfuse-io/eosws-go/blob/master/mdl/v1/transaction.go#L68)
