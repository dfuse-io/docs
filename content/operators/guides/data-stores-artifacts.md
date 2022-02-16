---
weight: 70
title: Data Stores & Artifacts
---

{{< alert type="note" >}}
The **goal of this page** is to help you understand all the data artifacts consumed and produced by dfuse, the different databases, the different types of storages.
{{< /alert >}}



## Stores

There are 2 data stores used by the dfuse Platform:

1. Object stores, for small or large files.  These use the dfuse [dstore abstraction library](https://github.com/streamingfast/dstore) to support Azure, GCP, AWS, Minio, and local filesystems.
2. Simple key/value storage databases.  These use the [kvdb key/value database abstraction](https://github.com/streamingfast/kvdb), with support for Google Cloud Bigtable, TiKV and Badger.


## Artifacts

### dfuse artifacts

These are dfuse-specific artifacts.

In general, the dfuse Platform uses [Protocol Buffers version 3](https://developers.google.com/protocol-buffers) for serialization.


#### executed merged blocks files

Also called `100-blocks files`, or merged blocks files, or merged bundles. These are all used interchangeably here.

These files are binary files that use the [dbin](https://github.com/streamingfast/dbin) packing format, to store a series of `bstream.Block` objects ([defined here](https://github.com/streamingfast/proto/blob/develop/dfuse/bstream/v1/bstream.proto)), serialized as [Protocol Buffers version 3](https://developers.google.com/protocol-buffers).

They are produced by `mindreader`, in catch-up mode (set as such with certain flags), or by the `merger` in an HA setup.  In the latter case, the `mindreader` contributes _one-block files_ to the merger instead, and the merger collates all of those in a single bundle.

These 100-blocks files can contain **more than 100 blocks** (because they can include multiple versions of a given block number), but not less (to ensure continuity).

They are consumed by the [bstream](https://github.com/streamingfast/bstream) library, used by almost all [components]({{< ref "./components" >}}).

The [EOSIO-specific decoded Block objects](https://github.com/streamingfast/proto-eosio/blob/master/dfuse/eosio/codec/v1/codec.proto) are what circulate amongst all processes that work with executed block data.



#### one-block files

These are transient files, destined to ensure that the `merger` gathers all visible forks from the `mindreader` instances, in an HA setup.

They contain one `bstream.Block`, as serialized Protobuf (see links above).

The `merger` will consume them, bundle them in _executed blocks files_ (100-blocks files) and store them to `dstore` storage, for consumption by most other processes.
