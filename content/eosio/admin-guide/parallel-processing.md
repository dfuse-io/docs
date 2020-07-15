---
pageTitle: Parallel processing of chain segments
weight: 110

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


// TODO: insert concerned flags + how to


## `fluxdb` reprocessing

`fluxdb` processing happens in two steps, because state changes need to be inserted linearly in the database (each change potentially builds on previous changes, and uses previous table snapshots to create periodic snapshots).

1. The first phase is taking the full history of merged blocks, extracting only the state changes, and outputting 100 smaller slices of the history (with each EOSIO state table in the same given slice).
2. These 100 slices can then be parallely (yet linearly) inserted into the database, each having 1% of the tables to insert.

This allows for 100x increase in insertion speed. The 100 value can be altered to any number.

After the process, the sliced data files can be deleted.

**Input**: Merged blocks files for the whole history you want to process, with no missing segments.

**Produces**:

// TODO: insert concerned flags

## `trxdb` reprocessing

**Input**: Merged blocks files


## `search` indexes reprocessing

**Input**: Merged blocks files

// TODO:
