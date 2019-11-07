---
weight: 40
title: Navigating Fork
protocol: EOS
---

The *dfuse* API allows remote endpoints to navigate forks without
fuss, with the guarantee that you will receive all the information you
need to stay in sync with the head of the chain.

For example, the [`get_table_rows`](#websocket-get-table-rows) will emit
`step: "undo"` and `step: "redo"` when a chain switches from one fork
to another. If you blindly apply changes to a local map of rows, you
will always be in sync with the latest changes, because `step: undo`
*flips* operations (a `REM` becomes an `INS`, and the previous/next
values for `INS` are inverted).

Meaning of `step`:

* `new` this the first time we see this DB operation, in a brand new block.
* `undo` happens during fork resolution, it means the DB operation is *no longer* part of the longest chain. Similar to a `ROLLBACK` in DB semantics.
* `redo` happens during fork resolution, it means the DB operation is *now in* the longest chain (and was previously seen in this connection). Similar to simply reapplying the change after it was rolled back.

Again, [`transaction_lifecycle`](#type-TransactionLifecycle)
events will be emitted when the transaction you are watching was in a
block that was forked out, or forked back in.
