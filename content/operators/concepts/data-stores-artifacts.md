---
weight: 70
title: Data Stores & Artifacts
---

The **goal of this page** is to help you understand all the data artifacts consumed and produced by dfuse, the different databases, the different types of storages.

## Stores

There is a single data store used by the Firehose stack

1. Object stores, for small or large files. These use the Firehose [dstore abstraction library](https://github.com/streamingfast/dstore) to support Azure, GCP, S3 (and on-premise solution supporting the S3 API interface like [minio](https://min.io/) or [ceph](https://ceph.com/en/)) as well as local filesystems.

{{< alert type="note" >}}
For production deployments outside of cloud provider, we recommend [ceph](https://ceph.com/en/) over it's compatible S3 API as the distributed storage system.
{{< /alert >}}

## Artifacts

### Firehose Artifacts

In general, the Firehose stack uses [Protocol Buffers version 3](https://developers.google.com/protocol-buffers) (version 3) for serialization.

#### Merged Blocks Files

Also called `100-blocks files`, or merged blocks files, or merged bundles, these are all used interchangeably.

These files are binary files that use the [dbin](https://github.com/streamingfast/dbin) packing format, to store a series of `bstream.Block` objects ([defined here](https://github.com/streamingfast/proto/blob/develop/sf/bstream/v1/bstream.proto)), serialized as [Protocol Buffers](https://developers.google.com/protocol-buffers).

They are produced by `mindreader`, in catch-up mode (set as such with certain flags), or by the `merger` in an HA setup. In the latter case, the `mindreader` contributes _one-block files_ to the merger instead, and the merger collates all of those in a single bundle.

These 100-blocks files can contain **more than 100 blocks** (because they can include multiple versions (e.g. **fork block**) of a given block number), ensuring continuity through the previous block link.

They are consumed by the [bstream](https://github.com/streamingfast/bstream) library, used by almost all [components]({{< ref "./components" >}}).

The protocol specific decoded block objects (for [Ethereum](https://github.com/streamingfast/proto-ethereum/blob/develop/sf/ethereum/codec/v1/codec.proto) as an example) are what circulate amongst all processes that work with executed block data.

#### One Block Files

These are transient files, destined to ensure that the `merger` gathers all visible forks from the `mindreader` instances, in an HA setup.

They contain one `bstream.Block`, as serialized Protobuf (see links above).

The `merger` will consume them, bundle them in _executed blocks files_ (100-blocks files) and store them to `dstore` storage, for consumption by most other processes.
