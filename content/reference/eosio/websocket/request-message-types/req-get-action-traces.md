---
title: get_action_traces
---

# `get_action_traces`

Retrieve a stream of executed actions, filtered by `receiver` and `account`

{{< note >}}
  The `get_action_traces` call is streaming only actions that are part of an executed transaction. That means
  you will never receive an action matching your filter input that is part of a soft or hard fail transaction.
  The API used to return all actions regardless of the transaction status, but it's not the case anymore.
{{< /note >}}

## Usage

Example request:

{{< highlight json >}}
{
  "type": "get_action_traces",
  "listen": true,
  "req_id": "your-request-id",
  "irreversible_only": true,
  "data": {
    "accounts": "eosio.token",
    "action_name": "transfer",
    "with_inline_traces": true,
    "with_dbops": true,
    "with_dtrxops": true,
    "with_ramops": true
  }
}
{{< /highlight >}}

## Information about receiver, account and action_name
Actions on the EOS blockchain are identified by a triplet `receiver`/`account`/`action_name`

- The code on the `receiver` is called with the method `account`/`action_name`
- An action is considered a "notification" when the `receiver` is different from the `account` field. That receiver may or may not contain instructions to run for that `account`/`action_name` pair.
[Read more details here](https://developers.eos.io/eosio-cpp/docs/communication-model#section-action-handlers-and-action-apply-context).

#### Arguments

{{< method-list-item name="accounts" type="String" required="true" >}}
  Pipe <code>&#124;</code> separated list of `accounts` to match.
{{< /method-list-item >}}

{{< method-list-item name="action_names" required="false" type="String" >}}
  Pipe <code>&#124;</code> separated list of `actions` to match.
{{< /method-list-item >}}

{{< method-list-item name="receivers" required="false" type="String" >}}
  Defaults to the same value as `accounts`. Pipe <code>&#124;</code> separated list of `receivers` to match.
{{< /method-list-item >}}

{{< method-list-item name="with_inline_traces" required="false" type="Boolean" >}}
  Stream the inline actions produced by each action.
{{< /method-list-item >}}

{{< method-list-item name="with_dbops" required="false" type="Boolean" >}}
  Stream contract's database row changes and associated metadata (payer, data, operation) produced by each action (See [DBOp]({{< ref "../../types/DBOp" >}})).
{{< /method-list-item >}}

{{< method-list-item name="with_dtrxops" required="false" type="Boolean" >}}
  Stream the modifications to deferred transactions produced by each action (See [DTrxOp]({{< ref "../../types/DTrxOp" >}})).
{{< /method-list-item >}}

{{< method-list-item name="with_ramops" required="false" type="Boolean" >}}
  Stream RAM billing changes and reasons for costs of storage produced by each action (See [RAMOp]({{< ref "../../types/RAMOp" >}})).
{{< /method-list-item >}}

{{< method-list-item name="with_tableops" required="false" type="Boolean" >}} Stream table operations produced by each action (See [TableOp]({{< ref "../../types/TableOp" >}})).
  {{< note >}}
  Do not confuse, the latter being describing a row changes (i.e. for example, an account’s balance) while the former describe the actual creation/deletion of a contract’s table (i.e. the encompassing structure containing the actual rows).
  {{< /note >}}
{{< /method-list-item >}}

#### Responses

* `fetch: true` is not supported for `get_action_traces`
* `listen: true` requests will stream [ActionTrace]({{< ref "../../types/ActionTrace" >}}) objects.
* `irreversible_only: true` ensure that you only get actions from irreversible blocks. If you call it with `start_block: (current head block)`, you will have to wait until that block becomes irreversible before you see any data streaming back.
