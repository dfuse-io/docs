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

### `mindreader`

**Description**: The `mindreader` processes uses the [node-manager](https://github.com/streamingfast/node-manager) library to run a blockchain node (`nodeos`) instance as a sub-process, and read data produced therein.

This is the primal source of all data that will flow in all systems

**High Availability considerations**: You will want more than one `mindreader` if you want to ensure blocks always flow through your system. `dfuse` is designed to deduplicate any `mindreader` data produced that would be identical (when two `mindreader` instances execute the same block), and also to aggregate any forked blocks that would be seen by one `mindreader`, and not by another one. See the [merger](#merger) for details.

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

### `node-manager`

**Description**: The stock `node-manager` offered here is to run a _second_ `nodeos` instance when doing all-in-one deployments of a brand new chain. Its role is to run the instance that will produce nodes, distinct from the `mindreader` instance that will produce the data out of the execution of the produced blocks.

