---
weight: 60
title: Understanding Components
---

{{< alert type="note" >}}
The **goal of this page** is to help you understand the _apps_ or _components_ available through `dfuseeos start`, with their respective role and interaction.
{{< /alert >}}

<!-- // Detailed textual description of those things. Taken from the videos? The guys have transcribed those no? -->

## General Architecture Diagram

![General architecture](/drawings/general_architecture.png)


## Video Series

To help you better understand certain components and dfuse at a higher level, our CTO recorded engaging video overviews. If you're looking for written information, keep scrolling!


### dfuse for EOSIO Architecture Series

* [General Overview](https://www.youtube.com/watch?v=q3Mi1S4nvcU)
* [deepmind & the dfuse Data Model](https://www.youtube.com/watch?v=BMcSmqvNU1Q)
* [manageos & mindreader](https://www.youtube.com/watch?v=uR1cB5QpvcY)
* [bstream part 1](https://www.youtube.com/watch?v=LX7_Q7b5pyc)
* [bstream part 2](https://www.youtube.com/watch?v=3HK95ng51ZM)
* [High Availability with Relayers, Merger](https://www.youtube.com/watch?v=yG-lxgp7g10)
* [pitreos](https://www.youtube.com/watch?v=9oPa8OqZdWE)


### Webinars
* [Install and Run the dfuse for EOSIO Stack](https://www.youtube.com/watch?v=1AH2wMESu2Y)
* [How to Use dfuse for EOSIO as a Blockchain Developer](https://www.youtube.com/watch?v=bFi6H5iO8ww)


## Components Description

<!-- // Take from: https://docs.google.com/document/d/1MrmnfWwSZOri5YC59__cC29BPLU7GLdz-stjtJ8gfpQ/edit -->


### `mindreader`

**Description**: The `mindreader` processes uses the [node-manager](https://github.com/streamingfast/node-manager) library to run a blockchain node (`nodeos`) instance as a sub-process, and read data produced therein.

This is the primal source of all data that will flow in all systems

**High Availability considerations**: You will want more than one `mindreader` if you want to ensure blocks always flow through your system. `dfuse` is designed to deduplicate any `mindreader` data produced that would be identical (when two `mindreader` instances execute the same block), and also to aggregate any forked blocks that would be seen by one `mindreader`, and not by another one. See the [merger](#merger) for details.


### `mindreader-stdin`

**Description**: `mindreader-stdin` replaces `mindreader` in situations where you want to manually manage backup/recovery, chain restoration, and you don't want the other benefits offered by the `node-manager` software.

**High Availability considerations**: It has the same HA properties as `mindreader`.



### `relayer`

**Description**: The `relayer` serves executed block data to most other components.

It feeds from all `mindreader` nodes available (in order to get a complete view of all possible forks)

Its role is to fan-out that block information.

The `relayer` serves its block data through a streaming gRPC interface called `BlockStream::Blocks` ([defined here](https://github.com/streamingfast/proto/blob/develop/dfuse/bstream/v1/bstream.proto)). It is the _same_ interface that `mindreader` exposes to the relayers.

NOTE: recent `relayer` can have _filters_ applied

**High Availability considerations**: Relayers feed from all of the `mindreader` nodes, to get a complete view of all possible forks.


### `merger`

**Description**: The `merger` collects _one-block files_ written by one or more `mindreader`s, into a _one-block object store_, and merges them to produce _merged blocks files_ (or 100-blocks files).

One core feature of the merger is the capacity to merge all forks visited by any backing `mindreader` node.

The merged block files are produced once the whole 100 blocks are collected, and after we're relatively sure no more forks will occur (bstream's _ForkableHandler_ supports seeing fork data in future merged blocks files anyway).



**Detailed Behavior**

* On boot, without merged-seen.gob file, it finds the last merged-block on storage and starts at the next bundle.
* On boot, with merged-seen.gob file, the merger will try to start where it left off.
* It gathers one-block-files and puts them together inside a bundle
  * The bundle is written when the first block of the next bundle is older than 25 seconds.
  * The bundle is only written when it contains at least one fully-linked segment of 100 blocks.
* The merger keeps a list of all seen(merged) blocks in the last {merger-max-fixable-fork}
  * "seen" blocks are blocks that we have either merged ourselves, or discovered by loading a bundle merged by someone else (mindreader)
* The merger will delete one-blocks:
  * that are older than {merger-max-fixable-fork}, or
  * that have been seen(merged)
* If the merger cannot complete a bundle (missing blocks, or hole...) it looks at the destination storage
  to see if the merged block already exists. If it does, it loads the blocks in there to fill its seen-blocks
  cache and continues to next bundle.
* Any one-block-file that was not included in previous bundle will be included in next ones. (ex: bundle 500 might include block 429)
  * blocks older than {merger-max-fixable-fork} will, instead, be deleted.

**High Availability considerations**: This component is needed when you want highly available `mindreader` nodes. You only need one of these, because the whole system can survive downtime from the merger, and it only produces files from time to time anyway.

Systems in need of blocks, when they start, will usually connect to `relayer`s, get real-time blocks and go back to merged block files only when the relayer can't satify the range. If relayers provide 200-300 blocks in RAM, then you have that time for the merger to be down, to sustain _restarts_ from other components. Once the other components are live, in general, they won't read from merged block files.


### `merged-filter`

**Description**: The `merged-filter` is an optional process that will ingest _merged block files_, filter them on-the-fly, and write those filtered block files back to a second destination storage.

Other components can then be pointed to that Object Storage location, and will therefore consume less RAM, because they'll process already filtered merged blocks files.

This is useful in filtered deployments, backed by an unfiltered deployment.

**High Availability considerations**: Similar to those of the `merger`, as they consume the same files, and produce the same sort of files (merged blocks files).


### `statedb`

**Description**: `statedb` is a special-purpose database to provide state snapshots of all blockchain state, at any block height.

`statedb` has two modes of operation (enabled alone or in combination through command-line flags):

* `inject` mode, which writes to the `kvdb` store
* `server` mode, which receives requests from end users and serves them. It also is connected to the `kvdb` store, and holds a buffer with recent blocks.

Both components receive blocks from a `relayer`.

**High Availability considerations**: The `inject` mode is stateful and needs to have at most one instance running at any time. The `server` mode is stateless and needs 2 or more to sustain upgrades/maintenance/crashes.

Simple deployments will have both in one process, in which case you do not want to scale it to more than one, because of the `inject` mode constraint, which writes transactionally to the backing database.


### `trxdb-loader`

**Description**: Takes the blockchain data and inserts it into out database instance (BigTable).

**High Availability considerations**: The system can sustain `trxdb-loader` being down for some time. Processes have internal buffer to cover their needs during this period.


### `eosws`

**Description**: EOSIO-specific websocket interface, REST interface, Push guarantee instrumented /v1/chain/push_transaction endpoint, and pass-through to statedb.

**High Availability considerations**: This process is stateless, and can be scaled up or down for the desired throughput. You want at least 2 to sustain one being down.


### `dgraphql`

**Description**: `dgraphql` is a server process serving end-user requests in the GraphQL format. It speaks GraphQL over both HTTP and gRPC. It routes most of its request to the appropriate service. In particular: `search-router` (for backward/forward searches), `statedb` server (for state queries), `blockmeta` (for block by time resolutions), `tokenmeta` (for token queries).

**High Availability considerations**: This process is stateless, and can be scaled up or down for the desired throughput. You want at least 2 to sustain one being down.


### `tokenmeta`

**Description**: The `tokenmeta` service is a specialized indexer for tokens, holders, and balances. It can provide clean and quick snapshots of that information. It is exposed through `dgraphql`.

**High Availability considerations**: This is a stateless deployment, as it bootstraps from `statedb`, and streams changes from `relayers`. You will want two or more to ensure zero downtime upgrades.


### `abicodec`

**Description**: This service is dedicated at decoding and encoding EOSIO binary format back and forth from JSON, using the on-chain ABIs. It can do so at _any_ block height, and is constantly kept in sync with changes from the chain.

On boot, it turns to a `search-router` to save all `eosio::setabi` transactions. It keeps a local cache in a [dstore](https://github.com/streamingfast/dstore) location.

**High Availability considerations**: This process is stateless, and can be scaled up or down for the desired throughput. You want at least 2 to sustain one being down.


### `eosq`

**Description**: `eosq` is the web front-end (block explorer) interface to the dfuse APIs. A self-contained https://eosq.app

**High Availability considerations**: This process is stateless, and can be scaled up or down for the desired throughput. You want at least 2 to sustain one being down.


### `blockmeta`

**Description**: `blockmeta` is the service that is queried by systems wanting to know the general status of the chain, in terms of head block, irreversible block, block times comparisons, past blocks status of irreversibility, etc.

It does not know much about each block, for instance, it doesn't keep track of the transaction counts for example. Just enough to help other processes bootstrap themselves (finding their start block, last irreversible block, etc..). It is like a spinal cord of a dfuse deployment.

**High Availability considerations**: This process is stateless, and can be scaled up or down for the desired throughput. You want at least 2 to sustain one being down.

### `node-manager`

**Description**: The stock `node-manager` offered here is to run a _second_ `nodeos` instance when doing all-in-one deployments of a brand new chain. Its role is to run the instance that will produce nodes, distinct from the `mindreader` instance that will produce the data out of the execution of the produced blocks.

