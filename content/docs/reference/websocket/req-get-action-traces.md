---
title: get_action_traces
---

# `get_action_traces`

> Example request

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

Retrieve a stream of actions, filtered by `receiver` and `account`

## Information about receiver, account and action_name
Actions on the EOS blockchain are identified by a triplet `receiver`/`account`/`action_name`
* The code on the `receiver` is called with the method `account`/`action_name`
* An action is considered a "notification" when the `receiver` is different from the `account` field. That receiver may or may not contain instructions to run for that `account`/`action_name` pair.
[More details here](https://developers.eos.io/eosio-cpp/docs/communication-model#section-action-handlers-and-action-apply-context)

#### Request input data fields

`accounts` required string
{: .argument-title}

Pipe <code>&#124;</code> separated list of `accounts` to match.

<div class="argument-separator"></div>

`action_names` optional string
{: .argument-title}

Pipe <code>&#124;</code> separated list of `actions` to match.

<div class="argument-separator"></div>

`receivers` optional string
{: .argument-title}

Defaults to the same value as `accounts`. Pipe <code>&#124;</code> separated list of `receivers` to match.

<div class="argument-separator"></div>

`with_ramops` optional boolean
{: .argument-title}

Stream RAM billing changes and reasons for costs of storage produced by each action (See [RAMOp](#type-RAMOp)).

<div class="argument-separator"></div>

`with_tableops` optional boolean
{: .argument-title}

Stream table operations produced by each action (See [TableOp](#type-TableOp)).

<div class="argument-separator"></div>

`with_inline_traces` optional boolean
{: .argument-title}

Stream the inline actions produced by each action.

<div class="argument-separator"></div>

`with_dtrxops` optional boolean
{: .argument-title}
Stream the modifications to deferred transactions produced by each action (See [DTrxOp](#type-DTrxOp)).

<!--
`with_dbops` | boolean | optional |  Stream changes to the database tables produced by each action.
-->

#### Responses

* `fetch: true` is not supported for `get_action_traces`
* `listen: true` requests will stream [ActionTrace](#type-ActionTrace) objects.
* `irreversible_only: true` ensure that you only get actions from irreversible blocks. If you call it with `start_block: (current head block)`, you will have to wait until that block becomes irreversible before you see any data streaming back.
