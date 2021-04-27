---
weight: 120
title: Parallel Processing of Chain Segments
---

{{< alert type="warning" >}}
This section is incomplete and is still being worked on.
{{< /alert >}}


{{< alert type="note" >}}
The **goal of this page** is to help you understand the steps required to do parallel reprocessing of the different dfuse services,.
{{< /alert >}}


**The dfuse platform was designed for massively parallelized operation on all levels.**

{{< alert type="tip" >}}
Data agility is a primal need of data science, blockchain data is no exception.
{{< /alert >}}


## `mindreader` reprocessing

This processing means executing transactions in blocks that circulate on the chain's peer-to-peer network.  This is layer-1 blockchain execution.  It can be time consuming, but dfuse ensures good support for parallelization.

Throw more machines and throughput, and you can

**Input**: Availability of portable state snapshots for `nodeos`.  Ideally, these have been produced automatically by the `node-manager` options to take periodic snapshots (to follow name conventions that can be picked-up by `node-manager` in reprocessing mode).  See the [node-manager component docs]({{< relref "./components" >}}#node-manager).

If portable snapshots are not available, you will have no choice but to go linearly.

**Output**: Merged blocks (100-block files) files.


<!-- // TODO: insert concerned flags + how to -->


## `statedb` reprocessing

`statedb` processing happens in two steps, because state changes need to be inserted linearly in the database (each change potentially builds on previous changes, and uses previous table snapshots to create periodic snapshots).

1. The first phase is taking the full history of merged blocks, extracting only the state changes, and outputting 100 smaller slices of the history (with each EOSIO state table in the same given slice).
2. These 100 slices can then be parallely (yet linearly) inserted into the database, each having 1% of the tables to insert.

This allows for 100x increase in insertion speed. The 100 value can be altered to any number.

After the process, the sliced data files can be deleted.

**Input**: Merged blocks files for the whole history you want to process, with no missing segments.

**Produces**: Sharded and reduced merged blocks files, which contain only the data necessary to write a subset of the tables.  These files are not useful to other systems, because they are purged of what is not meaningful to statedb, and statedb is only concerned by state changes, not other block or transaction data.


<!-- // TODO: insert concerned flags -->

## `trxdb` reprocessing

**Input**: Merged blocks files

**Produces**: Writes to the `trxdb` database (backed by a `kvdb` key/value store).

Block segments (ranges) can be loaded in parallel, and integrity checking (with `dfuseeos tools check merged-blocks`) can be done afterwards to make sure no holes are left in the history.


<!-- // TODO: insert concerned flags -->


## `search` indexes reprocessing

**Input**: Merged blocks files

**Produces**: Bleve search indexes of the shard size (number of blocks per index) specified by the reprocessing job, destined to the `search-archive` process of the same shard size.  These are written to a `dstore` object store, compressed, ready to be picked up by the `archive` that are polling for them.


<!-- // TODO: which flags? -->
