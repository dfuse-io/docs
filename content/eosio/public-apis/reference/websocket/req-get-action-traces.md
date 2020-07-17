---
weight: 40
#same weight for all pages in this section to auto-order them A->Z
pageTitle: get_action_traces
pageTitleIcon: eosio

sideNav: true
sideNavTitle: Public APIs
sideNavLinkRename: get_action_traces

BookToC: true
release: stable

aliases:
  - /reference/eosio/websocket/req-get-action-traces/

---

Retrieve a stream of executed actions, filtered by `receiver` and `account`

{{< alert type="important" >}}
We **strongly suggest** to use our [GraphQL search API]({{< ref "/eosio/public-apis/reference/graphql-api#query-searchtransactionsforward" >}})
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
  "data": {
    "accounts": "eosio.token|tethertether",
    "action_names": "transfer|issue",
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
    cursor: $cursor
  ) {
    undo cursor
    block { num id }
    trace {
      id
      matchingActions {
        seq
        receiver account name
        json
        dbOps { operation oldJSON { object error } newJSON { object error } }
        dtrxOps { operation payer transaction { actions { account name json } } }
        ramOps { operation delta usage }
      }
    }
  }
}
{{< /highlight >}}

{{< alert type="note" >}}
Eager to try out the document above? Head down straight to our {{< external-link title="GraphiQL Online Editor" href="https://mainnet.eos.dfuse.io/graphiql/?query=c3Vic2NyaXB0aW9uICgkY3Vyc29yOiBTdHJpbmcpIHsKICBzZWFyY2hUcmFuc2FjdGlvbnNGb3J3YXJkKAogICAgcXVlcnk6ICIoYWNjb3VudDplb3Npby50b2tlbiBPUiBhY2NvdW50OnRoZXRlcnRoZXRlcikgKGFjdGlvbjp0cmFuc2ZlciBPUiBhY3Rpb246aXNzdWUpIiwKICAgIGN1cnNvcjogJGN1cnNvcgogICkgewogICAgdW5kbyBjdXJzb3IKICAgIGJsb2NrIHsgbnVtIGlkIH0KICAgIHRyYWNlIHsKICAgICAgaWQKICAgICAgbWF0Y2hpbmdBY3Rpb25zIHsKICAgICAgICBzZXEKICAgICAgICByZWNlaXZlciBhY2NvdW50IG5hbWUKICAgICAgICBqc29uCiAgICAgICAgZGJPcHMgeyBvcGVyYXRpb24gb2xkSlNPTiB7IG9iamVjdCBlcnJvciB9IG5ld0pTT04geyBvYmplY3QgZXJyb3IgfSB9CiAgICAgICAgZHRyeE9wcyB7IG9wZXJhdGlvbiBwYXllciB0cmFuc2FjdGlvbiB7IGFjdGlvbnMgeyBhY2NvdW50IG5hbWUganNvbiB9IH0gfQogICAgICAgIHJhbU9wcyB7IG9wZXJhdGlvbiBkZWx0YSB1c2FnZSB9CiAgICAgIH0KICAgIH0KICB9Cn0=" >}} and press the play button in the top bar of the page.
{{</ alert>}}

The `"accounts": "eosio.token|tethertether"` argument in `get_action_traces` becomes the
`(account:eosio.token OR account:thetertheter)` clause while the `"action_names": "transfer|issue"`
argument becomes the `(action:transfer OR action:issue)` clause, both of them separated by
a space which acts as a logical `AND`.

With this document in hand, if you are using our JavaScript client library, updating
is simple a matter of changing a single line:

{{< highlight js >}}
// Instead of
const stream = await client.streamActionTraces(..., (message) => { ... })

// Use
const stream = await client.graphql(document, (message) => { ... })
{{< /highlight >}}

The logic changes a bit between the two calls also. While the `streamActionTraces` call generates
one message per action, the GraphQL version generates one message per matching
transaction, a transaction containing actions and you can easily find those the matched the
query using the `matchingActions` field.

To use the same logic as before in GraphQL, you will need, for each message received, to loop
through `matchingActions` (`pseudo-code` example below, logic applies to
all languages):

{{< highlight python >}}
for action in message.searchTransactionsForward.trace.matchingActions:
  // Do your old `get_action_traces` on message logic here
{{< /highlight >}}

The message format you will receive has also change, but making the
necessary adjustments is trivial. This is especially true since in
GraphQL, you have the power to pick and choose the exact field you want to receive
drastically shaving bandwidth cost in most usual cases.

We will not provide a 1 to 1 mapping list as it would be too much. You can use the
{{< external-link title="GraphiQL Online Editor" href="https://mainnet.eos.dfuse.io/graphiql/?query=c3Vic2NyaXB0aW9uICgkY3Vyc29yOiBTdHJpbmcpIHsKICBzZWFyY2hUcmFuc2FjdGlvbnNGb3J3YXJkKAogICAgcXVlcnk6ICIoYWNjb3VudDplb3Npby50b2tlbiBPUiBhY2NvdW50OnRoZXRlcnRoZXRlcikgKGFjdGlvbjp0cmFuc2ZlciBPUiBhY3Rpb246aXNzdWUpIiwKICAgIGN1cnNvcjogJGN1cnNvciwKICAgIGxpbWl0OiAxLAogICkgewogICAgdW5kbyBjdXJzb3IKICAgIGJsb2NrIHsgbnVtIGlkIH0KICAgIHRyYWNlIHsKICAgICAgaWQKICAgICAgbWF0Y2hpbmdBY3Rpb25zIHsKICAgICAgICBzZXEKICAgICAgICByZWNlaXZlciBhY2NvdW50IG5hbWUKICAgICAgICBqc29uCiAgICAgICAgZGJPcHMgeyBvcGVyYXRpb24gb2xkSlNPTiB7IG9iamVjdCBlcnJvciB9IG5ld0pTT04geyBvYmplY3QgZXJyb3IgfSB9CiAgICAgICAgZHRyeE9wcyB7IG9wZXJhdGlvbiBwYXllciB0cmFuc2FjdGlvbiB7IGFjdGlvbnMgeyBhY2NvdW50IG5hbWUganNvbiB9IH0gfQogICAgICAgIHJhbU9wcyB7IG9wZXJhdGlvbiBkZWx0YSB1c2FnZSB9CiAgICAgIH0KICAgIH0KICB9Cn0=" >}}, link and start from there, then slowly add (or remove) the fields you interested in.

{{< alert type="note" >}}
The link above as a `limit: 1` parameter so the stream stops right after a match so it's easier to inspect the
end result. Don't forget to remove it to get all results back! You can also play with `lowBlockNum` value to
find a matching instance (since the stream starts at HEAD block by default).
{{</ alert>}}

Finally, if you were using some of the more advanced WebSocket fields, here is how to convert them.

#####  Field `"irreversible_only": true`

Add `irreversibleOnly: true` parameter below `cursor` parameter in GraphQL document:

{{< highlight graphql >}}
subscription ($cursor: String) {
  searchTransactionsForward(
    ...
    cursor: $cursor,
    irreversibleOnly: true
  ) { ... }
}
{{< /highlight >}}

#####  Field `"with_progress": 15`

Add `liveMarkerInterval: 15` parameter below `cursor` parameter in GraphQL document:

{{< highlight graphql >}}
subscription ($cursor: String) {
  searchTransactionsForward(
    ...
    cursor: $cursor,
    liveMarkerInterval: 15
  ) { ... }
}
{{< /highlight >}}

#####  Field `"start_block": -350`

Add `lowBlockNum: -350` (or a direct block num) parameter below `cursor` parameter in GraphQL document:

{{< highlight graphql >}}
subscription ($cursor: String) {
  searchTransactionsForward(
    ...
    cursor: $cursor,
    lowBlockNum: -350
  ) { ... }
}
{{< /highlight >}}

{{< alert type="note" >}}
You were previously using `start_block` when reconnecting to start back where you left off? GraphQL is
now using a [Cursor]({{< ref "../../concepts/cursors" >}}) concept to perform that operation
in a much more granular and safer manner.

When receiving messages, record the last seen `message.searchTransactionsForward.cursor` value. When
re-connecting, simply pass the last seen `cursor` value in the variables set sent to the GraphQL
stream. This will ensure we start back at the exact location where you left off.

Using the our `JavaScript` client library? Even more simpler, simply use the `stream.mark(...)`
call and the library handles the rest: reconnection, cursor variables update, cursor tracking (long
term storage persistence to survive across process restarts is left to you however):

```
const stream = await client.graphql(document, (message) => {
  if (message.type === "data") {
    // Procesing here

    stream.mark({ cursor: message.data.searchTransactionsForward.cursor })
  }
})
```
{{</ alert >}}

#### Next Steps

You can use the following links to complete your code conversion to GraphQL:

- If using the JavaScript client library, checkout the [Quick Start: JavaScript - Stream your first results]({{< ref "/eosio/public-apis/getting-started/quickstart-javascript#stream-your-first-results" >}}) section.
- For other languages, refers to [Quick Start: Other Languages]({{< ref "/eosio/public-apis/getting-started/quickstart-other-languages" >}}) to learn how to make a GraphQL stream using your language of choice.
