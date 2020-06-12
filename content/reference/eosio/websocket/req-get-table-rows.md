---
title: get_table_rows
---
Retrieve a stream of changes to the tables, the side effects of
transactions/actions being executed

{{< alert type="important" >}}
You will only stream changes? We **strongly suggest** for this case to use our [GraphQL search API]({{< ref "/reference/eosio/graphql#query-searchtransactionsforward" >}}) instead of this stream. Advantages of using the GraphQL version:

- Possibility to stream for all scopes of a given table.
- Possibility to also perform a paginated query instead of streaming.
- Possibility to greatly reduce bandwidth transfer & cost (ingress to your server) by specifying the exact trimmed down data payload you need (excellent for browser & mobile usage).
- A much cleaner interface to query by block range (`lowBlockNum` and `highBlockNum` instead of harder to reason about `startBlock` and `blockCount`)

See the [Conversion to GraphQL API]({{< ref "#conversion-to-graphql-api" >}}) section for steps on how to perform the conversion.
{{< /alert >}}

## Guarantees

When asking `fetch: true` and `listen: true`, you will receive a
consistent snapshot (response message type `table_snapshot`) of the whole table
at block `start_block` (or head block if `start_block` is omitted),
followed by `table_delta` response messages that have occurred *after* the snapshot.

If you are looking to fetch a snapshot only, see the REST API for
state snapshots below.

## Usage

Example request:

{{< highlight json >}}
{
  "type": "get_table_rows",
  "req_id": "your-request-id",
  "fetch": true,
  "listen": true,
  "data": {
    "code": "eosio.token",
    "scope": "eoscanadacom",
    "table": "accounts",
    "json": true
  }
}
{{< /highlight >}}

#### Arguments

{{< method-list-item name="code" type="[AccountName](/reference/eosio/types/accountname)" required="true" >}}
  Contract account which wrote to tables
{{< /method-list-item >}}

{{< method-list-item name="scope" type="[Name](/reference/eosio/types/name)" required="true" >}}
  Table _scope_ where table is stored
{{< /method-list-item >}}

{{< method-list-item name="table" type="[Name](/reference/eosio/types/name)" required="true" >}}
  Table _name_, shown in the contract ABI
{{< /method-list-item >}}

{{< method-list-item name="json" type="Boolean" required="false" >}}
  With `json=true` (or `1`), table rows will be decoded to JSON, using the ABIs active on the queried block. This endpoint automatically adapts to upgrades to the ABIs on chain.
{{< /method-list-item >}}

#### Responses

* `fetch: true` requests will stream [TableSnapshotResponse]({{< ref "../types/TableSnapshotResponse" >}}) objects.
* `listen: true` requests will stream [TableDeltaResponse]({{< ref "../types/TableDeltaResponse" >}}) objects.

### Handling Forks

Forks can happen within a blockchain ecosystem and a fork block state changes are reverted. You
**must** deal with them properly if you want to have data integrity. **Always** check the `step`
field on the [TableDeltaResponse]({{< ref "../types/TableDeltaResponse" >}}) to properly deal
with chan re-organizations.

When streaming, _dfuse_ emits [TableDeltaResponse]({{< ref "../types/TableDeltaResponse" >}})
message with a `step` field, that can take the value `step:"new"`, `step: "undo"` or `step: "redo"`.
When a chain switches from one fork to another, you duplicate message, with the only difference being
the value of the `step` field that will now be `"undo"` or `"redo"`.

Meaning of `step`:

* `new` this the first time we see this DB operation, in a brand new block.
* `undo` happens during fork resolution, it means the DB operation is *no longer* part of the longest chain. Similar to a `ROLLBACK` in DB semantics.
* `redo` happens during fork resolution, it means the DB operation is *now in* the longest chain (and was previously seen in this connection). Similar to simply reapplying the change after it was rolled back.

To facilitate you experience as a developer, when doing an `undo`, _dfuse_ actually **flips**
the operation (`INS` becomes `REM`, `UPD` sees its `old` and `new` fields swapped, and `REM`
becomes `INS`)

If you blindly apply changes to a local map of rows, you
will always be in sync with the latest changes, because `step: undo`
*flips* operations (a `REM` becomes an `INS`, and the previous/next
values for `INS` are inverted).

### Conversion to GraphQL API

{{< alert type="note">}}
You were using `fetch: true` and `listen: true` at the same time? We suggest to keep using `get_table_rows`
until we port this feature to the GraphQL endpoint directly.

If you would like to still port, you will need extra steps to port your code. Retrieve the last irreversible
block, use our REST API `/state/table` to get a snapshot of the table you want, and start streaming at last
irreversible block num.
{{</ alert>}}

Migrating to our GraphQL Search API is really easy and offers advantages that you really
want to leverage to greatly improve your users experience. Converting to GraphQL Search API
is simply a matter of crafting an equivalent search query and convert a fraction of your code
to use the new format.
Assuming the following stream request message you would have used previously

{{< highlight json >}}
{
  "type": "get_table_rows",
  "listen": true,
  "req_id": "your-request-id",
  "data": {
    "code": "eosio.token",
    "scope": "eoscanadacom",
    "table": "accounts",
    "json": true
  }
}
{{< /highlight >}}

That would result in the following GraphQL document:

{{< highlight graphql >}}
subscription ($cursor: String) {
  searchTransactionsForward(
    query: "receiver:eosio.token db.table:accounts/eoscanadacom",
    cursor: $cursor,
  ) {
    undo cursor
    block { num id }
    trace {
      matchingActions {
        dbOps(code: "eosio.token", table: "accounts") {
          operation
          key { code table scope key }
          oldPayer newPayer
          oldJSON { object error }
          newJSON { object error }
        }
      }
    }
  }
}
{{< /highlight >}}

{{< alert type="note" >}}
Eager to try out the document above? Head down straight to our {{< external-link title="GraphiQL Online Editor" href="https://mainnet.eos.dfuse.io/graphiql/?query=c3Vic2NyaXB0aW9uICgkY3Vyc29yOiBTdHJpbmcpIHsKICBzZWFyY2hUcmFuc2FjdGlvbnNGb3J3YXJkKAogICAgcXVlcnk6ICJyZWNlaXZlcjplb3Npby50b2tlbiBkYi50YWJsZTphY2NvdW50cy9lb3NjYW5hZGFjb20iLAogICAgY3Vyc29yOiAkY3Vyc29yLAogICkgewogICAgdW5kbyBjdXJzb3IKICAgIGJsb2NrIHsgbnVtIGlkIH0KICAgIHRyYWNlIHsKICAgICAgbWF0Y2hpbmdBY3Rpb25zIHsKICAgICAgICBleGVjdXRpb25JbmRleAogICAgICAgIGRiT3BzKGNvZGU6ICJlb3Npby50b2tlbiIsIHRhYmxlOiAiYWNjb3VudHMiKSB7CiAgICAgICAgICBvcGVyYXRpb24KICAgICAgICAgIGtleSB7IGNvZGUgdGFibGUgc2NvcGUga2V5IH0KICAgICAgICAgIG9sZFBheWVyIG5ld1BheWVyCiAgICAgICAgICBvbGRKU09OIHsgb2JqZWN0IGVycm9yIH0KICAgICAgICAgIG5ld0pTT04geyBvYmplY3QgZXJyb3IgfQogICAgICAgIH0KICAgICAgfQogICAgfQogIH0KfQ==" >}} and press the play button in the top bar of the page.

Prefer to leverage rows changes for any scope of the `eosio.token/accounts` table directly? Simply use this query instead: `receiver: eosio.token db.table:accounts` ({{< external-link title="Try it out here!" href="https://mainnet.eos.dfuse.io/graphiql/?query=c3Vic2NyaXB0aW9uICgkY3Vyc29yOiBTdHJpbmcpIHsKICBzZWFyY2hUcmFuc2FjdGlvbnNGb3J3YXJkKAogICAgcXVlcnk6ICJyZWNlaXZlcjplb3Npby50b2tlbiBkYi50YWJsZTphY2NvdW50cyIsCiAgICBjdXJzb3I6ICRjdXJzb3IsCiAgKSB7CiAgICB1bmRvIGN1cnNvcgogICAgYmxvY2sgeyBudW0gaWQgfQogICAgdHJhY2UgewogICAgICBtYXRjaGluZ0FjdGlvbnMgewogICAgICAgIGV4ZWN1dGlvbkluZGV4CiAgICAgICAgZGJPcHMoY29kZTogImVvc2lvLnRva2VuIiwgdGFibGU6ICJhY2NvdW50cyIpIHsKICAgICAgICAgIG9wZXJhdGlvbgogICAgICAgICAga2V5IHsgY29kZSB0YWJsZSBzY29wZSBrZXkgfQogICAgICAgICAgb2xkUGF5ZXIgbmV3UGF5ZXIKICAgICAgICAgIG9sZEpTT04geyBvYmplY3QgZXJyb3IgfQogICAgICAgICAgbmV3SlNPTiB7IG9iamVjdCBlcnJvciB9CiAgICAgICAgfQogICAgICB9CiAgICB9CiAgfQp9" >}})
{{</ alert>}}

The `"code": "eosio.token"` argument in `get_table_rows` becomes the `receiver: eosio.token` clause
while the `"scope": "eoscanadacom", "table": "accounts"` fields get merged into the
`db.table:accounts/eoscanadacom` clause of the query.

With this document in hand, if you are using our JavaScript client library, updating
is simple a matter of changing a single line:

{{< highlight js >}}
// Instead of
const stream = await client.streamTableRows(..., (message) => { ... })

// Use
const stream = await client.graphql(document, (message) => { ... })
{{< /highlight >}}

The logic changes a bit between the two calls also. While the `streamTableRows` call generates
one message per table delta change, the GraphQL version generates one message per matching
transaction, a transaction containing actions, each action being able to generate N table
deltas.

Using `dbOps(code: "eosio.token", table: "accounts")` filters out the table deltas that are
not for the specific contract and table.

To use the same logic as before in GraphQL, you will need, for each message received, to loop
through `matchingActions` and then on `dbOps` (`pseudo-code` example below, logic applies to
all languages):

{{< highlight python >}}
for action in message.searchTransactionsForward.trace.matchingActions:
  for dbOp in action.dbOps:
    // Do your old `get_table_rows` on message logic here
{{< /highlight >}}

The actual return format message has changed a bit also, but making the necessary adjustments is trivial. Here is
the mapping from old response to new response format:

- `message.data.step` → `message.searchTransactionsForward.undo` (**Now a boolean, `new` and `redo` maps to `false`, `undo` maps to `true`**)
- `message.data.block_num` → `message.searchTransactionsForward.trace.block.num`
- `message.data.dbop.action_idx` → `message.searchTransactionsForward.trace.matchingActions[].executionIndex`
- `message.data.dbop.op` → `message.searchTransactionsForward.trace.matchingActions[].dbOps[].operation` (**Now upper case**)
- `message.data.dbop.account` → `message.searchTransactionsForward.trace.matchingActions[].dbOps[].key.code`
- `message.data.dbop.scope` → `message.searchTransactionsForward.trace.matchingActions[].dbOps[].key.scope`
- `message.data.dbop.table` → `message.searchTransactionsForward.trace.matchingActions[].dbOps[].key.table`
- `message.data.dbop.key` → `message.searchTransactionsForward.trace.matchingActions[].dbOps[].key.key`
- `message.data.dbop.old.payer` → `message.searchTransactionsForward.trace.matchingActions[].dbOps[].oldPayer`
- `message.data.dbop.old.json` → `message.searchTransactionsForward.trace.matchingActions[].dbOps[].oldJSON.object` (**Field `error` set when unable to decode to JSON**)
- `message.data.dbop.new.payer` → `message.searchTransactionsForward.trace.matchingActions[].dbOps[].newPayer`
- `message.data.dbop.new.json` → `message.searchTransactionsForward.trace.matchingActions[].dbOps[].newJSON.object` (**Field `error` set when unable to decode to JSON**)

If you were using `json: false` before to receive hexadecimal values, simply remove `oldJSON { object error }` and
`newJSON { object error }` and replace by `oldData` and `newData` in the GraphQL document. The mapping for those two
fields is:

- `message.data.dbop.old.hex` → `message.searchTransactionsForward.trace.matchingActions[].dbOps[].oldData`
- `message.data.dbop.new.hex` → `message.searchTransactionsForward.trace.matchingActions[].dbOps[].newData`

Finally, if you were using some of the more advanced WebSocket fields, here the how to convert them.

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
now using a [Cursor]({{< ref "/guides/core-concepts/cursors" >}}) concept to perform that operation
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

- If using the JavaScript client library, checkout the [JavaScript Quickstart Stream your first results]({{< ref "/guides/eosio/getting-started/javascript-quickstart#stream-your-first-results" >}}) section.
- For other languages, refers to [Other Languages Quickstart]({{< ref "/guides/eosio/getting-started/other-languages" >}}) to learn how to make a GraphQL stream using your language of choice.