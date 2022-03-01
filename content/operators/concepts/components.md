---
weight: 40
title: Components
---

The **goal of this page** is to help you understand the _apps_ or _components_, with their respective role and interaction.

## General Architecture Diagram

To serve a Firehose, some infrastructure is required. You need to run a full node with the Firehose instrumentation, as well as some storage location to store the merged blocks files.

For a highly-available setup (which the system is designed to allow), you will need a few more components.

![General architecture](/drawings/general_architecture.png)

## Video Series

To help you better understand certain components and Firehose at a higher level, Alex Bourget, CTO of StreamingFast and father of the Firehose stack recorded engaging video overviews. If you're looking for written information, keep scrolling!

### Firehose Architecture Series

{{< alert type="note" >}}
Those videos were recorded for EOSIO protocol, however, all the explanation translates relatively well to our other supported chains like Ethereum, NEAR, Solana, etc.

Also, you might hear Alex talking about `dfuse` in the videos, `dfuse` is our old branding, which is now called Firehose on `<Protocol>` for example Firehose on Ethereum.
{{< /alert >}}

* [General Overview](https://www.youtube.com/watch?v=q3Mi1S4nvcU)
* [Deep Mind & Firehose Data Model](https://www.youtube.com/watch?v=BMcSmqvNU1Q)
* [Node Manager & Mindreader](https://www.youtube.com/watch?v=uR1cB5QpvcY)
* [The `bstream` library - Part 1](https://www.youtube.com/watch?v=LX7_Q7b5pyc)
* [The `bstream` library - Part 2](https://www.youtube.com/watch?v=3HK95ng51ZM)
* [High Availability](https://www.youtube.com/watch?v=yG-lxgp7g10)

## Components

### `mindreader`

#### Description

The `mindreader` processes uses the [node-manager](https://github.com/streamingfast/node-manager) library to run a blockchain node (`nodeos`) instance as a sub-process, and read data produced therein.

This is the primal source of all data that will flow in all systems. The extractor nodes can be considered as simple full nodes, with no archive enabled nor other oddities. You can bootstrap them just the way you would do with full nodes, with the same backup strategy you already have. The only difference is that they spew out lots of data when the Firehose is enabled.

#### High Availability

You will want more than one `mindreader` if you want to ensure blocks always flow through your system. Firehose is designed to deduplicate any `mindreader` data produced that would be identical (when two `mindreader` instances execute the same block), and also to aggregate any forked blocks that would be seen by one `mindreader`, and not by another one. See the [merger](#merger) for details. By adding more `mindreaders`, and dispersing them geographically, they end up racing for pushing blocks to the relayer, increasing performance of the overall system.

### `merger`

#### Description

The `merger` collects _one-block files_ written by one or more `mindreader`s, into a _one-block object store_, and merges them to produce _merged blocks files_ (or 100-blocks files).

One core feature of the merger is the capacity to merge all forks visited by any backing `mindreader` node.

The merged block files are produced once the whole 100 blocks are collected, and after we're relatively sure no more forks will occur (bstream's _ForkableHandler_ supports seeing fork data in future merged blocks files anyway).

#### Detailed Behavior

* On boot, without `merged-seen.gob` file, it finds the last merged-block on storage and starts at the next bundle.
* On boot, with `merged-seen.gob` file, the merger will try to start where it left off.
* It gathers one-block-files and puts them together inside a bundle
  * The bundle is written when the first block of the next bundle is older than 25 seconds.
  * The bundle is only written when it contains at least one fully-linked segment of 100 blocks.
* The merger keeps a list of all seen(merged) blocks in the last `{merger-max-fixable-fork}`
  * "seen" blocks are blocks that we have either merged ourselves, or discovered by loading a bundle merged by someone else (mindreader)
* The merger will delete one-blocks:
  * That are older than `{merger-max-fixable-fork}`
  * That have already been seen (merged), as recorded by the `merged-seen.gob` file
* If the merger cannot complete a bundle (missing blocks, or hole...) it looks at the destination storage to see if the merged block already exists. If it does, it loads the blocks in there to fill its seen-blocks cache and continues to next bundle.
* Any one-block-file that was not included in previous bundle will be included in next ones. (ex: bundle 500 might include block 429)
  * Blocks older than `{merger-max-fixable-fork}` will, instead, be deleted.

#### High Availability

This component is needed when you want highly available `mindreader` nodes. You only need one of these, because the whole system can survive downtime from the merger, and it only produces files from time to time anyway.

Systems in need of blocks, when they start, will usually connect to `relayer`s, get real-time blocks and go back to merged block files only when the relayer can't satify the range. If relayers provide 200-300 blocks in RAM, then you have that time for the merger to be down, to sustain _restarts_ from other components. Once the other components are live, in general, they won't read from merged block files.

### `relayer`

#### Description

The `relayer` serves executed block data to most other components. It feeds from all `mindreader` nodes available (in order to get a complete view of all possible forks). Its role is to fan-out that block information.

The `relayer` serves its block data through a streaming gRPC interface called `BlockStream::Blocks` ([defined here](https://github.com/streamingfast/proto/blob/develop/sf/bstream/v1/bstream.proto)). It is the _same_ interface that `mindreader` exposes to the relayers.

#### High Availability

Relayers feed from all of the `mindreader` nodes, to get a complete view of all possible forks.

### `firehose`

#### Description

Firehose consumes merged blocks for historical requests from the data storage location directly and live blocks from the `relayer` (itself connected to one or more `mindreader`instances) for live blocks.

#### High Availability

Firehoses can be horizontally scaled and will be limited by the throughput of the network between them and clients, as well as them as the relayers. Firehoses can connect to a subset or all of the relayers. Having firehoses connect to all relayers increases the likelihood of seeing all forks, and being able to navigate those forks for clients that request them while they are still in memory. All forks do end up in the merged blocks, so in the worst case, navigation of forks is delayed when forked blocks do not make it to all firehoses.
