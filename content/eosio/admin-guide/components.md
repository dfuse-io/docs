---
title: Components
weight: 40
---

Goal: understand the _apps_ available through:

    dfuseeos start

their role, and interaction.



// Architecture graphs or links to those graphs.
// Links to videos?
// Detailed textual description of those things.  Taken from the videos ? The guys have transcribed those no?

## Overview

// TODO: insert graphics and images (plantuml renderings)

## Apps

// Take from:  https://docs.google.com/document/d/1MrmnfWwSZOri5YC59__cC29BPLU7GLdz-stjtJ8gfpQ/edit


### `mindreader`

**Description**: The `mindreader` processes uses the [node-manager](https://github.com/dfuse-io/node-manager) library to run a blockchain node (`nodeos`) instance as a sub-process, and read data produced therein.

This is the primal source of all data that will flow in all systems



**High Availability considerations**:  You will want more than one `mindreader` if you want to ensure blocks always flow through your system.  `dfuse` is designed to deduplicate any `mindreader` data produced that would be identical (when two `mindreader` instances execute the same block), and also to aggregate any forked blocks that would be seen by one `mindreader`, and not by another one. See the [merger](#merger) for details.


### `mindreader-stdin`

**Description**: `mindreader-stdin` replaces `mindreader` in situations where you want to manually manage backup/recovery, chain restoration, and you don't want the other benefits offered by the `node-manager` software.

**High Availability considerations**:  Itt has the same HA properties as `mindreader`.

### `relayer`

**Description**:

**High Availability considerations**:

### `merger`

**High Availability considerations**:

### `fluxdb`

`fluxdb` has two modes of operation (enabled alone or in combination through command-line flags):
* `inject` mode, which writes to the `kvdb` store
* `server` mode, which receives requests from end users and serves them.  It also is connected to the `kvdb` store, and holds a buffer with recent blocks.

Both components receive blocks from a `relayer`.

**High Availability considerations**:

### `trxdb-loader`


**High Availability considerations**: The system can sustain `trxdb-loader` being down for some time. Processes have internal buffer to cover their needs during this period.

### `search-archive`

**Description**: The `archive` backend of search stores only irreversible transactions.  It can serve full history, or specific segments of the chain.

* It can listen to new indexes produces by a `search-indexer`, automatically download and start serving them.  This is called _moving head_.
* It can also watch certain events to truncate the lower portion of the history it is serving, freeing some disk space and RAM usage.  This is called _moving tail_.
* It can be useful to have several archives serving the same segment, with different indexes sizes, for resiliency purposes:

```
|<- Genesis   ->  history going forward -->                                            HEAD -> |
[ tier 1,  50,000 blocks indexes, moving head                                                  ]
                                                      [  tier 2, 50 blks idx, moving tail/head ]
```

Since 50 blocks indexes are produced much quicker than 50,000 blocks indexes, this archive segment can be brought up much faster: you can parallelize production of a hundred 50 blks indexes, while you can't parallelize the production of a 50,000 blocks

50,000 blocks indexes also have fixed boundaries, so you might be waiting for the last 1000 real-time blocks because you can finalize the 50,000 blocks index.  Having 50 blocks indexes allows you to be much more reactive in case of issues.

The `search-indexer` can be instructed to only keep a certain moving window of indexes for a given tier, freeing up storage

**High Availability considerations**: To achieve high availability for any segment of the archive, you will need at least two copies.

### `search-indexer`

**Description**: The `search-indexer` takes the stream of executed block data, and creates the bleve indexes. It then writes those indexes to a `dstore` object store. The `archive` backend polls that object store for any newly produced indexes, downloads them and starts serving them.

It is configured with a given number of blocks per index. You can run multiple `indexer`, one for each index sizes.

Considerations for shard size (number of blocks in each index):
* The larger the index size, the longer it takes to process, and the longer you will wait on new live blocks before you can complete an index. Smaller indexes are more reactive in that sense.
*
Rule of thumb sizing:
* 50,000 blocks indexes for old segments, helps shrink the number of open files, and lower the overhead of an index.
* 5,000 blocks indexes for moving head segments, so you can relieve RAM pressure on the live nodes (which are waiting for purge their own memory once the `archive` covers their range).
* 500 blocks indexes, similiar to the 5,000 blocks indexes, to lower the RAM requirements of `live` nodes.
* 50 blocks indexes to help being extremely reactive in case of dramatic events.  Keep that for a short time window near the HEAD of the chain.

To keep indexes ranges coherent, we suggest they are multiples of 1, 2 or 5 and a power of ten (ex: 100, 2000, 50000, etc..).

The `archive` backend is able to query those indexes in parallel, ahead of time (spraying a given query on a large range of indexes, going faster and faster as it finds empty indexes). It is therefore possible to have 15,000 indexes under the same `search-archive` node.  Be mindful of open-files in this situations, as each index will usually take 2 open files.

**High Availability considerations**: `search-indexer` can be down for some time. `archive` nodes will not truncate their lower block range (when configured as _moving tail_) unless there is sufficient coverage of chain segments by lower tiers (archives that cover _up_ to that block wanting to be truncated).  Being down for a long time, will put pressure on disk space on those nodes with a _moving tail_ configuration, but those nodes usually also have a moving head, and already have space reserved for growth.

### `search-live`

**High Availability considerations**:

### `search-forkresolver`

**High Availability considerations**:

### `search-router`

**High Availability considerations**: This process is stateless, and can be scaled up or down for the desired throughput.  You want at least 2 to sustain one being down.

### `eosws`

**High Availability considerations**: This process is stateless, and can be scaled up or down for the desired throughput.  You want at least 2 to sustain one being down.

### `dgraphql`

**High Availability considerations**: This process is stateless, and can be scaled up or down for the desired throughput.  You want at least 2 to sustain one being down.

### `abicodec`

**Description**: This service is dedicated at decoding and encoding EOSIO binary format back and forth from JSON, using the on-chain ABIs. It can do so at _any_ block height, and is constantly kept in sync with changes from the chain.

On boot, it turns to a `search-router` to save all `eosio::setabi` transactions. It keeps a local cache in a `dstore` location.

**High Availability considerations**: This process is stateless, and can be scaled up or down for the desired throughput.  You want at least 2 to sustain one being down.

### `eosq`

**High Availability considerations**: This process is stateless, and can be scaled up or down for the desired throughput.  You want at least 2 to sustain one being down.

### `blockmeta`

**High Availability considerations**: This process is stateless, and can be scaled up or down for the desired throughput.  You want at least 2 to sustain one being down.

### `booter`

**Description**: This is the process that will bootstrap your chain if it detects that it has not been bootstrapped yet.  It will kick in if you run `node-manager`, and if there is a `bootseq.yaml` file in the current directory (or elsewhere, depending on a command-line flag).

**High Availability considerations**: This process runs only once.  It is not concerned by high availability.

### `node-manager`

**Description**: The stock `node-manager` offered here is to run a _second_ `nodeos` instance when doing all-in-one deployments of a brand new chain.  Its role is to run the instance that will produce nodes, distinct from the `mindreader` instance that will produce the data out of the execution of the produced blocks.

### `apiproxy`

**Description**: The `apiproxy` is a small router to combine all dfuse services in a single HTTP(S) endpoint.

**High Availability considerations**: In larger deployments, you can use a pool of such processed, Kubernetes Ingress or other forms of load balancers to route external traffic to the right services.  If you want to use it, you will want at least 2 to sustain one being down.

### `dashboard`
