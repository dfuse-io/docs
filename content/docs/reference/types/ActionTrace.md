---
title: ActionTrace
---

# `ActionTrace`

Example `action_trace` payload:

{{< highlight json >}}
{
  "type": "action_trace",
  "data": {
    "block_num": 25870889,
    "block_id": "018ac229323f3538cfde5c34f9cfcb1b2d80a4062a822c869d9eb9fcff2235db",
    "block_time": "2018-11-08T13:23:39.5Z",
    "trx_id": "35030b5bfd05f4f5b5bcae68505bf9f2c227a84c6b406dabebe0d8cd0384cd70",
    "idx": 0,
    "depth": 0,
    "trace": {
      "receipt": {
        "receiver": "eosio.msig",
        ...
      },
      "act": {
        "account": "eosio.msig",
        "name": "exec",
        "authorization": [
          {
            "actor": "eoscanadaaaf",
            "permission": "active"
          }
        ],
        "data": {
          "proposer": "eoscanadaaaf",
          "proposal_name": "goincthirthy",
          "executer": "eoscanadaaaf"
        },
        "hex_data": "b08c31c94c833055e05bbeae65341d65b08c31c94c833055"
      },
      "context_free": false,
      "elapsed": 644,
      "console": "",
      "trx_id": "35030b5bfd05f4f5b5bcae68505bf9f2c227a84c6b406dabebe0d8cd0384cd70",
      "block_num": 25870889,
      "block_time": "2018-11-08T13:23:39.500",
      "producer_block_id": "018ac229323f3538cfde5c34f9cfcb1b2d80a4062a822c869d9eb9fcff2235db",
      "account_ram_deltas": [
        {
          "account": "eoscanadaaaf",
          "delta": -323
        }
      ],
      "except": null,
      "inline_traces": []
    },
    "ramops": [
      {
        "op": "deferred_trx_add",
        "action_idx": 0,
        "payer": "eoscanadaaaf",
        "delta": 354,
        "usage": 4027
      },
        ...
    ],
    "dtrxops": [
      {
        "op": "CREATE",
        "action_idx": 0,
        "sender": "eosio.msig",
        "sender_id": "0xe05bbeae65341d65b08c31c94c833055",
        "payer": "eoscanadaaaf",
        "published_at": "2018-11-08T13:23:39.500",
        "delay_until": "2018-11-08T13:23:39.500",
        "expiration_at": "2018-11-08T13:33:39.500",
        "trx_id": "da1abcf7e205cf410c35ba3d474fd8d854a7513d439f7f1188d186493253ed24",
        "trx": {
         ...
        }
      }
    ]
  }
}
{{< /highlight >}}


Name | Type | Options | Description
-----|------|---------|------------
`block_id` | string | required | Block at which we are seeing this action being executed, and for which we are reporting traces.
`block_num` | number (uint32) | required | Block num corresponding to the `block_id`
`block_time` | DateTime | required | Time at which `block_id` was produced.
`trx_id` | string | required | ID of transaction that produced these traces
`idx` | number (uint16) | required | Zero-based index of this action within the transaction. Actions being nestable, this index represents a depth-first search indexing: if action _A_ (index 0) produced an inline action _B_, then action _B_ is index 1.
`depth` | number (uint16) | required | Depth of the action relative to the input actions (top-level actions that were defined in the originating transaction, and _not_ inlined as side effects of execution of top-level actions).  Actions with `depth = 0` are called input actions. Anything above 0 means this is an inline action.
`trace` | [TransactionTrace](#type-TransactionTrace) | required | An execution trace object. This is a standard `nodeos` trace object. See the [reference C++ code here](https://github.com/EOSIO/eos/blob/master/libraries/chain/include/eosio/chain/trace.hpp).
`ramops` | array&lt;[RAMOp](#type-RAMOp)&gt; | optional | A list of operations on RAM usage, including operation, payer, delta, resulting usage.
`dtrxops` | array&lt;[DTrxOps](#type-DTrxOps)&gt; | optional | A list of operations on deferred transactions (create, cancel...).

<!--
  * `dbops` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)**: list of database operations, including the payer, the type of the operation (insert, update or delete), the previous row value and the new row value (in case of updates for example).
-->
