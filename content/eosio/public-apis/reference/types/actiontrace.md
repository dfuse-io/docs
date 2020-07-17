---
weight: 20
#same weight for all pages in this section to auto-order them A->Z
pageTitle: ActionTrace
pageTitleIcon: eosio

sideNav: true
sideNavTitle: Public APIs
sideNavLinkRename: ActionTrace

BookToC: true
#release: stable

aliases:
  - /reference/eosio/types/actiontrace/

---

## Type `ActionTrace`

#### Properties

{{< method-list-item name="comparator" type="String" required="true" >}}
  Comparison operator for the block time. Should be one of `gt`, `gte`, `lt`, `lte` or `eq`.
{{< /method-list-item >}}

{{< method-list-item name="block_id" type="String" required="true" >}}
  Block at which we are seeing this action being executed, and for which we are reporting traces.
{{< /method-list-item >}}

{{< method-list-item name="block_num" type="Number (uint32)" required="true" >}}
  Block num corresponding to the `block_id`
{{< /method-list-item >}}

{{< method-list-item name="block_time" type="DateTime" required="true" >}}
  Time at which `block_id` was produced.
{{< /method-list-item >}}

{{< method-list-item name="trx_id" type="String" required="true" >}}
  ID of transaction that produced these traces
{{< /method-list-item >}}

{{< method-list-item name="idx" type="Number (uint16)" required="true" >}}
  Zero-based index of this action within the transaction. Actions being nestable, this index represents a depth-first search indexing: if action _A_ (index 0) produced an inline action _B_, then action _B_ is index 1.
{{< /method-list-item >}}

{{< method-list-item name="trace" type="[TransactionTrace](/eosio/public-apis/reference/types/transactiontrace)" required="true" >}}
  An execution trace object. This is a standard `nodeos` trace object. See the {{< external-link title="reference C++ code here" href="https://github.com/EOSIO/eos/blob/master/libraries/chain/include/eosio/chain/trace.hpp" >}}.
{{< /method-list-item >}}

{{< method-list-item name="ramops" type="Array&lt;[RAMOp](/eosio/public-apis/reference/types/ramop)&gt;" required="false" >}}
  A list of operations on RAM usage, including operation, payer, delta, resulting usage.
{{< /method-list-item >}}

{{< method-list-item name="dtrxops" type="Array&lt;[DTrxOps](/eosio/public-apis/reference/types/dtrxop)&gt;" required="false" >}}
  A list of operations on deferred transactions (create, cancel...).
{{< /method-list-item >}}

<!--
  * `dbops` **{{< external-link title="Array" href="https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)**: list of database operations, including the payer, the type of the operation (insert, update or delete), the previous row value and the new row value (in case of updates for example" >}}.
-->

## Example payload

{{< highlight json >}}
{
  "type": "action_trace",
  "data": {
    "block_num": 25870889,
    "block_id": "018ac229323f3538cfde5c34f9cfcb1b2d80a4062a822c869d9eb9fcff2235db",
    "block_time": "2018-11-08T13:23:39.5Z",
    "trx_id": "35030b5bfd05f4f5b5bcae68505bf9f2c227a84c6b406dabebe0d8cd0384cd70",
    "idx": 0,
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
