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

{{< method-list-item name="code" type="[AccountName](../types/AccountName)" required="true" >}}
  Contract account which wrote to tables
{{< /method-list-item >}}

{{< method-list-item name="scope" type="[Name](../types/Name)" required="true" >}}
  Table _scope_ where table is stored
{{< /method-list-item >}}

{{< method-list-item name="table" type="[Name](../types/Name)" required="true" >}}
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
  "with_progress": 15,
  "start_block": -350,
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
    query: "db.key:eosio.token/eoscanadacom/accounts",
    lowBlockNum: -350,
    cursor: $cursor,
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
        dbOps {
          operation
          oldJSON { object error }
          newJSON { object error }
        }
      }
    }
  }
}
{{< /highlight >}}

{{< alert type="note" >}}
Eager to try out the document above? Head down straight to our {{< external-link title="GraphiQL Online Editor" href="https://mainnet.eos.dfuse.io/graphiql/?query=c3Vic2NyaXB0aW9uICgkY3Vyc29yOiBTdHJpbmcpIHsKICBzZWFyY2hUcmFuc2FjdGlvbnNGb3J3YXJkKAogICAgcXVlcnk6ICJkYi5rZXk6ZW9zaW8udG9rZW4vZW9zY2FuYWRhY29tL2FjY291bnRzIiwgCiAgICBsb3dCbG9ja051bTogLTM1MCwKICAgIGN1cnNvcjogJGN1cnNvciwKICAgIGlycmV2ZXJzaWJsZU9ubHk6IHRydWUsCiAgICBsaXZlTWFya2VySW50ZXJ2YWw6IDE1CgkpIHsKICAgIHVuZG8KICAgIGN1cnNvcgogICAgYmxvY2sgewogICAgICBudW0KICAgICAgaWQKICAgIH0KICAgIHRyYWNlIHsKICAgICAgaWQKICAgICAgbWF0Y2hpbmdBY3Rpb25zIHsKICAgICAgICBzZXEKICAgICAgICByZWNlaXZlcgogICAgICAgIGFjY291bnQKICAgICAgICBuYW1lCiAgICAgICAganNvbgogICAgICAgIGRiT3BzIHsKICAgICAgICAgIG9wZXJhdGlvbgogICAgICAgICAgb2xkSlNPTiB7IG9iamVjdCBlcnJvciB9CiAgICAgICAgICBuZXdKU09OIHsgb2JqZWN0IGVycm9yIH0KICAgICAgICB9CiAgICAgICAgZHRyeE9wcyB7CiAgICAgICAgICBvcGVyYXRpb24KICAgICAgICAgIHBheWVyCiAgICAgICAgICB0cmFuc2FjdGlvbiB7CiAgICAgICAgICAgIGFjdGlvbnMgewogICAgICAgICAgICAgIGFjY291bnQKICAgICAgICAgICAgICBuYW1lCiAgICAgICAgICAgICAganNvbgogICAgICAgICAgICB9CiAgICAgICAgICB9CiAgICAgICAgfQogICAgICAgIHJhbU9wcyB7CiAgICAgICAgICBvcGVyYXRpb24KICAgICAgICAgIGRlbHRhCiAgICAgICAgICB1c2FnZQogICAgICAgIH0KICAgICAgfQogICAgfQogIH0KfQo=" >}} and press the play button in the top bar of the page.
{{</ alert>}}

With this document in hand, if you are using our JavaScript client library, updating
is simply a matter of changing a single line:

{{< highlight js >}}
// Instead of
client.streamTableRows(..., (message) => { ... })

// Use
client.graphql(document, (message) => { ... })
{{< /highlight >}}

{{< alert type="note" >}}
Would like to stream table rows changes for any scope of the `eosio.token/accounts` table? Simply use the query `db.table:eosio.token/accounts`, {{< external-link title="Try it out here!" href="https://mainnet.eos.dfuse.io/graphiql/?query=c3Vic2NyaXB0aW9uICgkY3Vyc29yOiBTdHJpbmcpIHsKICBzZWFyY2hUcmFuc2FjdGlvbnNGb3J3YXJkKAogICAgcXVlcnk6ICJkYi50YWJsZTplb3Npby50b2tlbi9hY2NvdW50cyIsIAogICAgbG93QmxvY2tOdW06IC0zNTAsCiAgICBjdXJzb3I6ICRjdXJzb3IsCiAgICBsaXZlTWFya2VySW50ZXJ2YWw6IDE1CgkpIHsKICAgIHVuZG8KICAgIGN1cnNvcgogICAgYmxvY2sgewogICAgICBudW0KICAgICAgaWQKICAgIH0KICAgIHRyYWNlIHsKICAgICAgaWQKICAgICAgbWF0Y2hpbmdBY3Rpb25zIHsKICAgICAgICBzZXEKICAgICAgICByZWNlaXZlcgogICAgICAgIGFjY291bnQKICAgICAgICBuYW1lCiAgICAgICAganNvbgogICAgICAgIGRiT3BzIHsKICAgICAgICAgIG9wZXJhdGlvbgogICAgICAgICAgb2xkSlNPTiB7IG9iamVjdCBlcnJvciB9CiAgICAgICAgICBuZXdKU09OIHsgb2JqZWN0IGVycm9yIH0KICAgICAgICB9CiAgICAgICAgZHRyeE9wcyB7CiAgICAgICAgICBvcGVyYXRpb24KICAgICAgICAgIHBheWVyCiAgICAgICAgICB0cmFuc2FjdGlvbiB7CiAgICAgICAgICAgIGFjdGlvbnMgewogICAgICAgICAgICAgIGFjY291bnQKICAgICAgICAgICAgICBuYW1lCiAgICAgICAgICAgICAganNvbgogICAgICAgICAgICB9CiAgICAgICAgICB9CiAgICAgICAgfQogICAgICAgIHJhbU9wcyB7CiAgICAgICAgICBvcGVyYXRpb24KICAgICAgICAgIGRlbHRhCiAgICAgICAgICB1c2FnZQogICAgICAgIH0KICAgICAgfQogICAgfQogIH0KfQo=" >}}
{{</ alert>}}

The actual return format message has changed a bit also, but making the
necessary adjustments is trivial.

You can the following links for completing your code conversion:

- If using the JavaScript client library, checkout the [JavaScript Quickstart Stream your first results]({{< ref "/guides/eosio/getting-started/javascript-quickstart#stream-your-first-results" >}}) section.
- For other languages, refers to [Other Languages Quickstart]({{< ref "/guides/eosio/getting-started/other-languages" >}}) to learn how to make a GraphQL stream using your language of choice.