---
title: get_table_rows
---

# `get_table_rows`

Retrieve a stream of changes to the tables, the side effects of
transactions/actions being executed

## Guarantees

When asking `fetch: true` and `listen: true`, you will receive a
consistent snapshot (response message type `table_snapshot`) of the whole table
at block `start_block` (or head block if `start_block` is omitted),
followed by `table_delta` response messages that have occured *after* the snapshot.

If you are looking to fetch a snapshot only, see the REST API for
state snapshots below.

#### Request input data fields:

> Example request

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


`code` required [AccountName](#type-AccountName)
{: .argument-title}

Contract account which wrote to tables.

<div class="argument-separator"></div>

`scope` required [Name](#type-Name)
{: .argument-title}

Table _scope_ where table is stored.

<div class="argument-separator"></div>

`table` required [Name](#type-Name)
{: .argument-title}

Table _name_, shown in the contract ABI.

<div class="argument-separator"></div>

`json` optional boolean
{: .argument-title}

With `json=true` (or `1`), table rows will be decoded to JSON, using the ABIs active on the queried block. This endpoint automatically adapts to upgrades to the ABIs on chain.

#### Responses

* `fetch: true` requests will stream [TableSnapshotResponse](#type-TableSnapshotResponse) objects.
* `listen: true` requests will stream [TableDeltaResponse](#type-TableDeltaResponse) objects.

### Handling Forks

When navigating forks in the chain, _dfuse_ sends
[TableDeltaResponse](#type-TableDeltaResponse) updates with the `step` field set to
`undo` and `redo`. When doing an `undo`, _dfuse_ actually **flips**
the operation (`INS` becomes `REM`, `UPD` sees its `old` and `new`
fields swapped, and `REM` becomes `INS`), so you can simply process
the incoming stream as if it was normal actions.

If you want to be aware of the chain reorganizations, verify the
`step` field on the [TableDeltaResponse](#type-TableDeltaResponse) object.
