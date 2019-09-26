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

`code` required [AccountName](#type-AccountName)<br>
Contract account which wrote to tables.

***

`scope` required [Name](#type-Name)<br>
Table _scope_ where table is stored.

***

`table` required [Name](#type-Name)<br>
Table _name_, shown in the contract ABI.

***

`json` optional boolean<br>
With `json=true` (or `1`), table rows will be decoded to JSON, using the ABIs active on the queried block. This endpoint automatically adapts to upgrades to the ABIs on chain.

#### Responses

* `fetch: true` requests will stream [TableSnapshotResponse](#type-TableSnapshotResponse) objects.
* `listen: true` requests will stream [TableDeltaResponse](#type-TableDeltaResponse) objects.

## Handling Forks

When navigating forks in the chain, _dfuse_ sends
[TableDeltaResponse](#type-TableDeltaResponse) updates with the `step` field set to
`undo` and `redo`. When doing an `undo`, _dfuse_ actually **flips**
the operation (`INS` becomes `REM`, `UPD` sees its `old` and `new`
fields swapped, and `REM` becomes `INS`), so you can simply process
the incoming stream as if it was normal actions.

If you want to be aware of the chain reorganizations, verify the
`step` field on the [TableDeltaResponse](#type-TableDeltaResponse) object.
