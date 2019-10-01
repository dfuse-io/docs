---
title: get_action_traces
---

# `get_action_traces`

Retrieve a stream of actions, filtered by `receiver` and `account`

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
    "with_dtrxops": true,
    "with_ramops": true
  }
}
{{< /highlight >}}

## Information about receiver, account and action_name
Actions on the EOS blockchain are identified by a triplet `receiver`/`account`/`action_name`
* The code on the `receiver` is called with the method `account`/`action_name`
* An action is considered a "notification" when the `receiver` is different from the `account` field. That receiver may or may not contain instructions to run for that `account`/`action_name` pair.
[More details here](https://developers.eos.io/eosio-cpp/docs/communication-model#section-action-handlers-and-action-apply-context)

#### Arguments

`accounts` `required string`<br>
Pipe <code>&#124;</code> separated list of `accounts` to match.

***

`action_names` `optional string`<br>
Pipe <code>&#124;</code> separated list of `actions` to match.

***

`receivers` `optional string`<br>
Defaults to the same value as `accounts`. Pipe <code>&#124;</code> separated list of `receivers` to match.

***

`with_ramops` `optional boolean`<br>
Stream RAM billing changes and reasons for costs of storage produced by each action (See [RAMOp]({{< ref "../../types/RAMOp" >}})).

***

`with_tableops` `optional boolean`<br>

Stream table operations produced by each action (See [TableOp]({{< ref "../../types/TableOp" >}})).

***

`with_inline_traces` `optional boolean`<br>

Stream the inline actions produced by each action.

***

`with_dtrxops` `optional boolean`<br>
Stream the modifications to deferred transactions produced by each action (See [DTrxOp]({{< ref "../../types/DTrxOp" >}})).

<!--
`with_dbops` | boolean | optional |  Stream changes to the database tables produced by each action.
-->

#### Responses

* `fetch: true` is not supported for `get_action_traces`
* `listen: true` requests will stream [ActionTrace]({{< ref "../../types/ActionTrace" >}}) objects.
* `irreversible_only: true` ensure that you only get actions from irreversible blocks. If you call it with `start_block: (current head block)`, you will have to wait until that block becomes irreversible before you see any data streaming back.
