---
title: get_action_traces
---
Retrieve a stream of executed actions, filtered by `receiver` and `account`

{{< alert type="important" >}}
We **strongly suggest** to use our [GraphQL search API]({{< ref "/reference/eosio/graphql#query-searchtransactionsforward" >}})
instead of this stream. Advantages of using the GraphQL version:

- Fork-aware, able to tell you if an action was rollout due to being part of a forked block.
- Possibility to also perform a paginated query instead of streaming.
- Possibility to greatly reduce bandwidth transfer & cost (ingress to your server) by specifying the exact trimmed down data payload you need (excellent for browser & mobile usage).
- A much cleaner interface to query by block range (`lowBlockNum` and `highBlockNum` instead of harder to reason about `startBlock` and `blockCount`)
- On-the-fly ABI decode to JSON smart contract database rows that changed due to the execution of the transaction.

See the [Conversion to GraphQL API]({{< ref "#conversion-to-graphql-api" >}}) section for steps on how to perform the conversion.
{{< /alert >}}

## Usage

{{< alert type="note" >}}
  The `get_action_traces` call is streaming only actions that are part of an executed transaction. That means
  you will never receive an action matching your filter input that is part of a soft or hard fail transaction.
  The API used to return all actions regardless of the transaction status, but it's not the case anymore.
{{< /alert >}}

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
{{< external-link title="Read more details here" href="https://developers.eos.io/eosio-cpp/docs/communication-model#section-action-handlers-and-action-apply-context" >}}.

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
  Stream contract's database row changes and associated metadata (payer, data, operation) produced by each action (See [DBOp]({{< ref "../types/DBOp" >}})).
{{< /method-list-item >}}

{{< method-list-item name="with_dtrxops" required="false" type="Boolean" >}}
  Stream the modifications to deferred transactions produced by each action (See [DTrxOp]({{< ref "../types/DTrxOp" >}})).
{{< /method-list-item >}}

{{< method-list-item name="with_ramops" required="false" type="Boolean" >}}
  Stream RAM billing changes and reasons for costs of storage produced by each action (See [RAMOp]({{< ref "../types/RAMOp" >}})).
{{< /method-list-item >}}

{{< method-list-item name="with_tableops" required="false" type="Boolean" >}} Stream table operations produced by each action (See [TableOp]({{< ref "../types/TableOp" >}})).
  {{< alert type="note" >}}
  Do not confuse, the latter being describing a row changes (i.e. for example, an account’s balance) while the former describe the actual creation/deletion of a contract’s table (i.e. the encompassing structure containing the actual rows).
  {{< /alert >}}
{{< /method-list-item >}}

#### Responses

* `fetch: true` is not supported for `get_action_traces`
* `listen: true` requests will stream [ActionTrace]({{< ref "../types/ActionTrace" >}}) objects.
* `irreversible_only: true` ensure that you only get actions from irreversible blocks. If you call it with `start_block: (current head block)`, you will have to wait until that block becomes irreversible before you see any data streaming back.

### Conversion to GraphQL API

Migrating to our GraphQL Search API is really easy and offers advantages that you really
want to leverage to greatly improve your users experience. Converting to GraphQL Search API
is simply a matter of crafting an equivalent search query and convert a fraction of your code
to use the new format.

Assuming the following stream request message you would have used previously

{{< highlight json >}}
{
  "type": "get_action_traces",
  "listen": true,
  "req_id": "your-request-id",
  "irreversible_only": true,
  "with_progress": 15,
  "start_block": -350,
  "data": {
    "accounts": "eosio.token|tethertether",
    "action_name": "transfer|issue",
    "with_dbops": true,
    "with_dtrxops": true,
    "with_ramops": true
  }
}
{{< /highlight >}}

That would result in the following GraphQL document:

{{< highlight graphql >}}
subscription ($cursor: String) {
  searchTransactionsForward(
    query: "(account:eosio.token OR account:thetertheter) (action:transfer OR action:issue)",
    lowBlockNum: -350,
    cursor: $cursor,
    irreversibleOnly: true,
    liveMarkerInterval: 15
  ) {
    undo
    cursor
    block {
      num
      id
    }
    trace {
      id
      matchingActions {
        seq
        receiver
        account
        name
        json
        dbOps {
          operation
          oldJSON { object error }
          newJSON { object error }
        }
        dtrxOps {
          operation
          payer
          transaction {
            actions {
              account
              name
              json
            }
          }
        }
        ramOps {
          operation
          delta
          usage
        }
      }
    }
  }
}
{{< /highlight >}}

{{< alert type="note" >}}
Eager to try out the document above? Head down straight to our {{< external-link title="GraphiQL Online Editor" href="https://mainnet.eos.dfuse.io/graphiql/?query=c3Vic2NyaXB0aW9uICgkY3Vyc29yOiBTdHJpbmcpIHsKICBzZWFyY2hUcmFuc2FjdGlvbnNGb3J3YXJkKAogICAgcXVlcnk6ICIoYWNjb3VudDplb3Npby50b2tlbiBPUiBhY2NvdW50OnRoZXRlcnRoZXRlcikgKGFjdGlvbjp0cmFuc2ZlciBPUiBhY3Rpb246aXNzdWUpIiwgCiAgICBsb3dCbG9ja051bTogLTM1MCwKICAgIGN1cnNvcjogJGN1cnNvciwKICAgIGlycmV2ZXJzaWJsZU9ubHk6IHRydWUsCiAgICBsaXZlTWFya2VySW50ZXJ2YWw6IDE1CgkpIHsKICAgIHVuZG8KICAgIGN1cnNvcgogICAgYmxvY2sgewogICAgICBudW0KICAgICAgaWQKICAgIH0KICAgIHRyYWNlIHsKICAgICAgaWQKICAgICAgbWF0Y2hpbmdBY3Rpb25zIHsKICAgICAgICBzZXEKICAgICAgICByZWNlaXZlcgogICAgICAgIGFjY291bnQKICAgICAgICBuYW1lCiAgICAgICAganNvbgogICAgICAgIGRiT3BzIHsKICAgICAgICAgIG9wZXJhdGlvbgogICAgICAgICAgb2xkSlNPTiB7IG9iamVjdCBlcnJvciB9CiAgICAgICAgICBuZXdKU09OIHsgb2JqZWN0IGVycm9yIH0KICAgICAgICB9CiAgICAgICAgZHRyeE9wcyB7CiAgICAgICAgICBvcGVyYXRpb24KICAgICAgICAgIHBheWVyCiAgICAgICAgICB0cmFuc2FjdGlvbiB7CiAgICAgICAgICAgIGFjdGlvbnMgewogICAgICAgICAgICAgIGFjY291bnQKICAgICAgICAgICAgICBuYW1lCiAgICAgICAgICAgICAganNvbgogICAgICAgICAgICB9CiAgICAgICAgICB9CiAgICAgICAgfQogICAgICAgIHJhbU9wcyB7CiAgICAgICAgICBvcGVyYXRpb24KICAgICAgICAgIGRlbHRhCiAgICAgICAgICB1c2FnZQogICAgICAgIH0KICAgICAgfQogICAgfQogIH0KfQo=" >}} and press the play button in the top bar of the page.
{{</ alert>}}

With this document in hand, if you are using our JavaScript client library, updating
is simply a matter of changing a single line:

{{< highlight js >}}
// Instead of
client.streamActionTraces(..., (message) => { ... })

// Use
client.graphql(document, (message) => { ... })
{{< /highlight >}}

The actual return format message has changed a bit also, but making the
necessary adjustments is trivial.

You can the following links for completing your code conversion:

- If using the JavaScript client library, checkout the [JavaScript Quickstart Stream your first results]({{< ref "/guides/eosio/getting-started/javascript-quickstart#4-stream-your-first-results" >}}) section.
- For other languages, refers to [Other Languages Quickstart]({{< ref "/guides/eosio/getting-started/other-languages" >}}) to learn how to make a GraphQL stream using your language of choice.