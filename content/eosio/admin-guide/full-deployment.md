---
weight: 100
title: Full Deployment
sideNavTitle: Full Deployment
---

{{< alert type="warning" >}}
This section is incomplete and is still being worked on. Missing components:

 - ABI Codec
 - Account History
 - EOSWS
 - Peering
 - StateDB
 - TokenMeta
 - TrxDB (contains Blocks & Transactions)
{{< /alert >}}

{{< alert type="note" >}}
The **goal of this page** is to give you an idea of what a highly available, and scaled out setup looks like. The example given here is based on a basic understanding of Kubernetes and/or containerized deployment. It will instruct you how to have an instance that is resilient to crashes of the machine and replacement of the machine on which you run it, and allows you to start scaling out some components.
{{< /alert >}}

### Premise

* Each component is decoupled as an independent microservice, and is scaled separately.
* Merged blocks are available on a shared fashion with a single data stores URL access point.
* Search Indexes are available on a shared fashion with a single data stores URL access point.
* Internal network routing works using a DNS that load balances between available instances (Kubernetes `ClusterIP` service).
* External network routing using a load balance is possible, we give general route mapping and protocol types.

### Components

Here some general values that will need to be replaced in the flags below, they are deployment dependent. We assuming usage GCP cloud provider with usage of:

- Google Cloud Storage for sharing data artifacts
- Google Kubernetes Engine for the Kubernetes cluster
- Google BigTable for the database storage

Each component given has a given Kubernetes name attached to it, it's the name of the resource type it represents.

{{< alert type="important" >}}
The following element below are placeholder that you will need to  find and replace in the flags provided below.

- BigTable dsn `bigkv://project-id.bigtable-instance/eos-name-here-trxdb-v1`
- One blocks `gs://acme-blocks/eos-name-here/v1-oneblock`
- Merged blocks `gs://acme-blocks/eos-name-here/v1`
- Search indexes `gs://acme-search-indexes/eos-name-here/v1`
- Snapshots for `nodeos` `gs://acme-backups/eos-name-here/v1`
- The `etcd` cluster `etcd://etcd-cluster:2379/eos-name-here`

Do a search/replace in the config to replace all occurrences.
{{< /alert >}}

The components presented below are loosly ordered by dependencies, the most low-level dependency listed first climbing to the top of the dependencies tree up to the API level components.

### Running

All the example config presented here can be run by following these step:

- Copy the relevant config to your working directory, use the component name like `mindreader.yaml`
- Run `dfuseeos` binary pointing it to the config and picking a uniquer data directory

    {{< highlight bash >}}
dfuseeos start -c mindreader.yaml -d data/mindreader -v{{< /highlight >}}

    {{< alert type="note" >}}
If you run into a problem, you can add more `-vvv` to the end of the command to increase the logger verbosity. If nothing seems to standout, it's possible to also active tracing by preprending the command with `TRACE=true` (a specific component can be specified here like `TRACE=mindreader` to restrict a bit the verbosity).
{{< /alert >}}

The default logger configured for each service is to use the `json` logging format. If you are running on GCP and want to collect logs into StackDriver, you can use `log-format: stackdriver` everywhere instead.

#### Mindreader

The `mindreader` component is responsible of generating dfuse Blocks. When catching up with the chain and block time are earlier than 12 hours ago (customizable), `mindreader` generates merged blocks (a bundle of 100 blocks in a single compressed file) and otherwise, it generates one block that are later merged together in bundle of 100 blocks by the `merger` components.

The `mindreader` component uses a node manager, which roles is to wrap and supervised `nodeos` process and providing a admin HTTP API that can be used to perform some operational task like stopping `nodeos`, restore it from a snapshost (to cover a hole of dfuse Blocks), starting back `nodeos` and other such maintenance tasks.

{{< alert type="note" >}}
To sync with high traffic chains like EOS Mainnet, a fast frequency CPU is required, the biggest clock frequency the faster transactions will be ingested by `mindreader`. A too slow CPU on a high traffic chain will make `mindreader` slowly drift or never catch up.
{{< /alert >}}

###### `sts/mindreader-v1`

{{< alert type="alert" >}}
The `config.ini` and `genesis.json` are not displayed here but should exist and be available in `/etc/nodeos` folder.

The `mindreader` component **MUST** by in read only mode, i.e. that it should not accept transactions from the network. It should have the following values in the `config.ini` file

{{< highlight ini >}}
read-mode = head
p2p-accept-transactions = false
api-accept-transactions = false
{{< /highlight >}}

While not recommended, it's ok to use it as an API node. We recommend instead having dedicates nodes for that task, too much load on the CPU could make `mindreader` drift.
{{< /alert >}}

{{< highlight yaml >}}
# mindreader.yaml
start:
  args:
  - mindreader
  flags:
    log-format: json
    log-to-file: false
    # Optional dependency, when present, used to determine if `mindreader` is live or catching up
    # common-blockmeta-addr: dns:///blockmeta-v1:9000
    common-blocks-store-url: gs://acme-blocks/eos-name-here/v1
    common-oneblock-store-url: gs://acme-blocks/eos-name-here/v1-oneblock
    # The manager API port used to send HTTP maintenance command like `curl http://localhost:8080/v1/maintenance?sync=true` or `curl http://localhost:8080/v1/resume?sync=true`
    mindreader-manager-api-addr: :8080
    mindreader-number-of-snapshots-to-keep: 0
    # This is where `nodeos` RPC API is listening to, determined by `http-server-address` value in `config.ini` file in `/etc/nodeos` folder
    mindreader-nodeos-api-addr: localhost:8888
    mindreader-connection-watchdog: false
    # Mounted directory when a `config.ini` and `genesis.json` exists, managed `nodeos` process is configured to use them
    mindreader-config-dir: /etc/nodeos
    mindreader-nodeos-path: nodeos
    # Persistent disk where `nodeos` blocks and state is stored, should be sized big enough to hold chain blocks & state
    mindreader-data-dir: /nodeos-data
    mindreader-readiness-max-latency: 5s
    # Subfolder under persistent disk to store some metadata required by mindreader component
    mindreader-working-dir: /nodeos-data/mindreader
    # Address serving a live stream of blocks, usually consumed by `relayer` to multiplex blocks into a single stream
    mindreader-grpc-listen-addr: :9000
    mindreader-blocks-chan-capacity: 100
    # Prints `nodoes` logs as-is unformatted to standard output, if sets to `true`, `nodeos` are instead routed inside dfuse for EOSIO logging system
    mindreader-log-to-zap: false
    mindreader-nodeos-args=
    # When an error occurs on `mindreader` start up, attempt a snapshot restore from more recent snapshot available, fails if snapshot restore fails
    mindreader-start-failure-handler: true
    mindreader-snapshot-store-url: gs://acme-backups/eos-name-here/v1
    mindreader-auto-restore-source: snapshot
    mindreader-auto-snapshot-period: 0
    # Graceful period while the mindreader is flagged unhealthy but still running, usefull to let time to orchestrator like K8S to remove the endpoint from a service
    mindreader-shutdown-delay: 20s
{{< /highlight >}}

#### Merger

The `merger` is responsible of merging one blocks generated by `mindreader` components. When near live, the `mindreader` starts to produce one block files in a folder. The merge responsibility is to scan this folder and merged 100 blocks together ensuring that all forked versions that could happen are recorded together.

###### `sts/merger-v1`

{{< highlight yaml >}}
# merger.yaml
start:
  args:
  - merger
  flags:
    log-format: json
    log-to-file: false
    common-blocks-store-url: gs://acme-blocks/eos-name-here/v1
    common-oneblock-store-url: gs://acme-blocks/eos-name-here/v1-oneblock
    merger-grpc-listen-addr: :9000
    merger-minimal-block-num: 0
    merger-start-block-num: 0
    merger-stop-block-num: 0
    merger-writers-leeway: 10s
    # Persistent folder used to store a cache file of the blocks that where already merged
    merger-state-file: /data/merger.seen.gob
    merger-max-fixable-fork: 2000
    merger-max-one-block-operations-batch-size: 2000
{{< /highlight >}}

#### Relayer

The `relayer` component is a multiplexer that receives blocks from multiple `mindreader` instances and join them in order to form a single stream of live blocks. All component that consumes live blocks (which is mostly all of them) connects to the `relayer`.

###### `deploy/relayer-v1`

{{< highlight yaml >}}
# relayer.yaml
start:
  args:
  - relayer
  flags:
    log-format: json
    log-to-file: false
    common-blocks-store-url: gs://acme-blocks/eos-name-here/v1
    relayer-buffer-size: 300
    relayer-max-source-latency: 5m
    relayer-merger-addr: dns:///merger-v1:9000
    # Each mindreader is specified independently, we do not want to load balance here, we want to connect to each of them individually
    relayer-source: dns:///mindreader-v1-0.mindreader-v1:9000,dns:///mindreader-v1-1.mindreader-v1:9000
    relayer-grpc-listen-addr: :9000
{{< /highlight >}}

#### Block Meta

The `blockmeta` component is used by a variety of higher-level services for:

- Determines if a block is now irreversible or not
- To determine the overall chain health (compared to only the narrow vision of the components in the deployed cluster)
- To determine some information about blocks like the LIB of the block
- To resolves relative block number like `-200`

In most cases, block meta is optional but hinder the functionalities of the chain. As soon as you have a `relayer` deployed and a `nodeos` node fully in-sync available, the block meta component should be deployed also.

###### `deploy/blockmeta-v1`

{{< highlight yaml >}}
# blockmeta.yaml
start:
  args:
  - blockmeta
  flags:
    log-format: json
    log-to-file: false
    common-blockstream-addr: dns:///relayer-v1:9000
    common-blocks-store-url: gs://acme-blocks/eos-name-here/v1
    # Block Meta is able to function without blocks database being available, but not all services served by Block Meta will work properly
    common-trxdb-dsn: bigkv://project-id.bigtable-instance/eos-name-here-trxdb-v1
    # Main EOS API address to fetch info from running chain, must be in-sync, can be outside your deployment to start
    blockmeta-eos-api-upstream-addr: http://nodeos-api-v1:9999
    # Additional EOS API addresses for ID lookups (valid even if it is out of sync or read-only), optional but useful for more robust deployment
    # blockmeta-eos-api-extra-addr: "<fill me>"
    blockmeta-grpc-listen-addr: :9000
    blockmeta-live-source: true
{{< /highlight >}}

#### Firehose

Firehose consumes merged blocks for historical requests and live blocks from the `relayer` (itself connected to one or more `mindreader` instances) for live blocks.

###### `deploy/firehose-v1`

{{< highlight yaml >}}
# firehose.yaml
start:
  args:
  - firehose
  flags:
    log-format: json
    log-to-file: false
    common-blockstream-addr: dns:///relayer-v1:9000
    common-blockmeta-addr: dns:///blockmeta-v1:9000
    # When Ctrl-C is received to stop the component, the component is marked unhealthy and 30s graceful period is waited for proper orchestration in K8S and others
    common-system-shutdown-signal-delay: 30s
    firehose-blocks-store-urls: gs://acme-blocks/eos-name-here/v1
    # The * at the end means to listen on a non-SSL connection, used for easy routing and to avoid SSL configuration internally
    firehose-grpc-listen-addr: :9000*
{{< /highlight >}}

{{< alert type="note" >}}
It's possible to have a Firehose only for historical blocks, just use the empty string `""` for the live source and the block meta:

{{< highlight yaml >}}
common-blockstream-addr: ""
common-blockmeta-addr: ""
{{< /highlight >}}
{{< /alert >}}

#### Search

The dfuse Search is probably the biggest element that can be deployed within all components dfuse provides. The dfuse Search search is a big beast that requires multiple operational components to be deployed to work properly. It requires an `etcd` cluster (can be very small, but requires it anyway), a fully synced `trxdb` database containing all transactions of interest and requires a fair amount of different search components, specially for larger network where the chain must be split in multiple segments for better performance.

The dfuse Search Engine only deals with transactions ids, searching its indexes on field that match a given transaction, determining which transactions ids match the query. When actually returning the transactions to the end users, it must go through a bridge (`dgraphql` acts as the bridge). The bridge queries the `search-router`, receive a list of transaction ids that matches the query and resolve all the transaction ids against the transaction database populated by the `trxdb-loader` component.

On the size required, it's highly dependent on the chain indexed, which accounts are indexed and which fields are considered. Something like 1TB for an high availability setup of a medium size chain like Telos, to which one needs to add the size of all transactions in the database, so another 1TB or more for the transactions database. And this is ever growing, as the chain get biggers.

For an filtered chain, indexing only let's say a single contract that is known to start only high up in the chain will be a totally different story. It's also possible to create a "rotating" window of let's say 2 weeks, eliminating the ever growing aspect. In this condition(s), one could use simply a few Gigabytes of storage, even on EOS Mainnet. It's really then depending on the filtering and the rolling portion, 24 hours vs 2 weeks is quite a different story.

The `search-indexer` is responsible for creating the search indexes, each search indexes spanning a portion of the chain's block, by default 200 blocks. This number of 200 blocks is good only for local developer setup. When indexing a chain for a full deployment, default 200 blocks in each index is definitely not a good value. Usually, one should split the chain in multiple segments, each of them generating indexes for different amount of blocks. For example, on a medium size chain with 140 millions of blocks, one could split it like this:

- From `0 - 90M`, indexes into 25K blocks indexes
- From `90M - 130M`, indexes into 10K blocks indexes
- From `130M - Head` (moving), indexes into 5K blocks indexes

Assuming the following chain split, let's check the required sub-components and their respective flags.

##### Overview

Here the overview of the required components that should always run. The `search-` ones are described in this section, the others are described separately in other sections of this chapter.

- `etcd` cluster for advertising and retrieving pod's served range
- `search-router` for routing requests
- `search-archive` & `search-live` (together referred as `search-hybrid`) for live segment of the chain and `-5000 to Head` segment, using 50 blocks indexes
- `search-archive` for `0 - 90M` range
- `search-archive` for `90M - 130M` range
- `search-archive` for  `130M - Head` range (moving with Head)
- `search-indexer` for 5K blocks indexes (for the moving `130M - Head` component)
- `search-indexer` for 50 blocks (for the Search Hybrid)
- `search-forkresolver` for resolving fork when receiving cursors not in live segment anymore
- `search-memcached` for optimized block ranges lookup by skipping indexes that are known to NOT contain anything for a particular query
- `trxdb-loader` for filling up and continuously sync the transaction database
- `dgraphql` for serving the actual API responses by resolving search matches from `search-router` to transactions in the transaction database

The naming of the search components is not required, but helps understanding what they do and improve maintenability of the different components. It has two elements, the data version and the tier level.

- `d0` means the revision of the _data_, if we index new things or remove things from our indexes, we'll roll out a new series of pods, which can run the same revision of the software (`v1`), but with new data. We often can mix data revisions in the same deployment for some time, so the upgrade path is more seamless.
- `t10`, `t15`, `t20`, `t99` and `t100` are the search tiers, they are all registered in the `etcd` cluster and cover different chain segments.
 - The `t10` and `t15` are fixed size tier, with blocks ranging from 0 to 90M and then to 90M to 130M, it is not written to (no moving head), and consumes respectively `25000` and `10000` blocks indexes. No live indexer of `50000` is necessary in this situation, provided they were all processed before and exist in the _search indexes object store_ already.
 - The `t20` is a tier with a moving head, with indexes 5000 blocks in size, meaning it will keep watching for new indexes produced by the `search0-indexer-5000`, with blocks ranging from 130M to the current chain head.
 - The `t99` is a small tier that is used as a bridge between the moving head tier `t20` and the live segment. It is built in the `search-hybrid` component in such way to overlap with both the live segments tier `t100` and the moving head tier `t20`. It consumes 50 blocks indexes that are usually all in RAM to be very speedy.
 - The `t100` is the live segment. It is built in the `search-hybrid` component by generating a single block index per blocks in the actual reversible segment. This way, the set of indexes to use in the live segment can be computed dynamically against the current longest chain.

##### `etcd` cluster

You will need to deploy an `etcd` cluster, version `v3.4`. The deployment of such cluster is out of the scope of this chapter. It must be accessible to the other components through a single url.

The various search components that serves queries (`search-archive`) register themselves in the cluster with the range of the chain they are service (for example, `0 - 90M`) .The `search-router` reads those values from `etcd` cluster and using that, determines the correct query plan is must perform and selects which pods it must it to fully covered the queried range.

See [search etcd component]({{< ref "./components" >}}#search-etcd) for more details.

##### `search-indexer`

###### `deploy/search-v1-d0-indexer-25000`

{{< alert type="note" >}}
This deployment is actually required only once to generate the search indexed within this range. Once the indexation is completed, it does not need to run.

This is actually ususally run as a first step and in parallel, generating multiple smaller range. Once the search indexes are generated and stored, they are good until the search terms of the filtering needs to be updated.
{{< /alert >}}

{{< highlight yaml >}}
# search-indexer-25k.yaml
start:
  args:
  - search-indexer
  flags:
    log-format: json
    log-to-file: false
    common-blocks-store-url: gs://acme-blocks/eos-name-here/v1
    common-blockstream-addr: dns:///relayer-v1:9000
    common-blockmeta-addr: dns:///blockmeta-v1:9000
    search-common-indices-store-url: gs://acme-search-indexes/eos-name-here/v1
    search-indexer-enable-batch-mode: true
    search-indexer-enable-upload: true
    search-indexer-delete-after-upload: true
    search-indexer-start-block: 0
    search-indexer-stop-block: 89999999
    search-indexer-shard-size: 25000
    # Temporary folder used as a scratch space, must be unique for each instance of the indexer
    search-indexer-writable-path: /tmp/bleve-indexes
{{< /highlight >}}

###### `deploy/search-v1-d0-indexer-10000`

{{< alert type="note" >}}
This deployment is actually required only once to generate the search indexed within this range. Once the indexation is completed, it does not need to run.

This is actually ususally run as a first step and in parallel, generating multiple smaller range. Once the search indexes are generated and stored, they are good until the search terms of the filtering needs to be updated.
{{< /alert >}}

{{< highlight yaml >}}
# search-indexer-10k.yaml
start:
  args:
  - search-indexer
  flags:
    log-format: json
    log-to-file: false
    common-blocks-store-url: gs://acme-blocks/eos-name-here/v1
    common-blockstream-addr: dns:///relayer-v1:9000
    common-blockmeta-addr: dns:///blockmeta-v1:9000
    search-common-indices-store-url: gs://acme-search-indexes/eos-name-here/v1
    search-indexer-enable-batch-mode: true
    search-indexer-enable-upload: true
    search-indexer-delete-after-upload: true
    search-indexer-start-block: 90000000
    search-indexer-stop-block: 129999999
    search-indexer-shard-size: 10000
    # Temporary folder used as a scratch space, must be unique for each instance of the indexer
    search-indexer-writable-path: /tmp/bleve-indexes
{{< /highlight >}}

###### `sts/search-v1-d0-indexer-5000`

{{< alert type="note" >}}
This statefulset has a moving head, so it must always run in the full deployment. A parallelized version can be used to reach Head, then it must run in "live" mode.
{{< /alert >}}

{{< highlight yaml >}}
# search-indexer-5k.yaml
start:
  args:
  - search-indexer
  flags:
    log-format: json
    log-to-file: false
    common-blocks-store-url: gs://acme-blocks/eos-name-here/v1
    common-blockstream-addr: dns:///relayer-v1:9000
    common-blockmeta-addr: dns:///blockmeta-v1:9000
    search-common-indices-store-url: gs://acme-search-indexes/eos-name-here/v1
    search-indexer-http-listen-addr: :8080
    search-indexer-enable-upload: true
    search-indexer-delete-after-upload: true
    search-indexer-start-block: 130000000
    search-indexer-shard-size: 5000
    search-indexer-enable-index-truncation: true
    # Temporary folder used as a scratch space, must be unique for each instance of the indexer
    search-indexer-writable-path: /tmp/bleve-indexes
{{< /highlight >}}

##### `search-archive`

###### `sts/search-v1-d0-t10-0-90m-25000`

{{< highlight yaml >}}
# search-archive-t10-0-90m-25k.yaml
start:
  args:
  - search-archive
  flags:
    log-format: json
    log-to-file: false
    common-blockmeta-addr: dns:///blockmeta-v1:9000
    search-common-indices-store-url: gs://acme-search-indexes/eos-name-here/v1
    search-common-mesh-dsn: etcd://etcd-cluster:2379/eos-name-here
    search-common-mesh-service-version: v1
    search-common-mesh-publish-interval: 1s
    search-archive-grpc-listen-addr: :9000
    search-archive-tier-level: 10
    search-archive-shard-size: 25000
    search-archive-start-block: 0
    search-archive-stop-block: 89999999
    search-archive-index-polling: true
    search-archive-sync-from-storage: true
    search-archive-sync-max-indexes: 10000000
    search-archive-indices-dl-threads: 20
    search-archive-max-query-threads: 12
    search-archive-shutdown-delay: 5s
    # Persistent folder used to store unpacked search indexes, must be unique & persistent for each instance of the search archive
    search-archive-writable-path: /data/local-indices/d0
    # Local config file that contains query used to warmup the indexes, example content could be `receiver:eosio action:onblock` is those actions are indexed
    search-archive-warmup-filepath: /etc/search/warmup-queries
    search-archive-enable-empty-results-cache: true
    search-archive-memcache-addr: search-v1-memcache:11211
{{< /highlight >}}

###### `sts/search-v1-d0-t15-90m-130m-10000`

{{< highlight yaml >}}
# search-archive-t15-90m-130m-10k.yaml
start:
  args:
  - search-archive
  flags:
    log-format: json
    log-to-file: false
    common-blockmeta-addr: dns:///blockmeta-v1:9000
    search-common-indices-store-url: gs://acme-search-indexes/eos-name-here/v1
    search-common-mesh-dsn: etcd://etcd-cluster:2379/eos-name-here
    search-common-mesh-service-version: v1
    search-common-mesh-publish-interval: 1s
    search-archive-grpc-listen-addr: :9000
    search-archive-tier-level: 15
    search-archive-shard-size: 10000
    search-archive-start-block: 90000000
    search-archive-stop-block: 129999999
    search-archive-index-polling: true
    search-archive-sync-from-storage: true
    search-archive-sync-max-indexes: 10000000
    search-archive-indices-dl-threads: 20
    search-archive-max-query-threads: 12
    search-archive-shutdown-delay: 5s
    # Persistent folder used to store unpacked search indexes, must be unique & persistent for each instance of the search archive
    search-archive-writable-path: /data/local-indices/d0
    # Local config file that contains query used to warmup the indexes, example content could be `receiver:eosio action:onblock` is those actions are indexed
    search-archive-warmup-filepath: /etc/search/warmup-queries
    search-archive-enable-empty-results-cache: true
    search-archive-memcache-addr: search-v1-memcache:11211
{{< /highlight >}}

###### `sts/search-v1-d0-t20-130m-head-5000`

{{< highlight yaml >}}
# search-archive-t20-130m-head-5k.yaml
start:
  args:
  - search-archive
  flags:
    log-format: json
    log-to-file: false
    common-blockmeta-addr: dns:///blockmeta-v1:9000
    search-common-indices-store-url: gs://acme-search-indexes/eos-name-here/v1
    search-common-mesh-dsn: etcd://etcd-cluster:2379/eos-name-here
    search-common-mesh-service-version: v1
    search-common-mesh-publish-interval: 1s
    search-archive-grpc-listen-addr: :9000
    search-archive-tier-level: 20
    search-archive-shard-size: 5000
    search-archive-start-block: 130000000
    search-archive-index-polling: true
    search-archive-sync-from-storage: true
    search-archive-sync-max-indexes: 10000000
    search-archive-indices-dl-threads: 20
    search-archive-max-query-threads: 12
    search-archive-shutdown-delay: 5s
    # Persistent folder used to store unpacked search indexes, must be unique & persistent for each instance of the search archive
    search-archive-writable-path: /data/local-indices/d0
    # Local config file that contains query used to warmup the indexes, example content could be `receiver:eosio action:onblock` is those actions are indexed
    search-archive-warmup-filepath: /etc/search/warmup-queries
    search-archive-enable-empty-results-cache: true
    search-archive-memcache-addr: search-v1-memcache:11211
{{< /highlight >}}

##### `search-hybrid` (`search-archive` + `search-live`)

###### `deploy/search-v1-d0-hybrid`

{{< highlight yaml >}}
# search-archive-t100-hybrid.yaml
start:
  args:
  - search-archive
  - search-live
  flags:
    log-format: json
    log-to-file: false
    common-blocks-store-url: gs://acme-blocks/eos-name-here/v1
    common-blockstream-addr: dns:///relayer-v1:9000
    common-blockmeta-addr: dns:///blockmeta-v1:9000
    search-common-indices-store-url: gs://acme-search-indexes/eos-name-here/v1
    search-common-mesh-dsn: etcd://etcd-cluster:2379/eos-name-here
    search-common-mesh-service-version: v1
    search-common-mesh-publish-interval: 1s
    search-archive-grpc-listen-addr: :9100
    search-archive-tier-level: 99
    search-archive-shard-size: 50
    search-archive-start-block: -5000
    search-archive-enable-moving-tail: true
    search-archive-index-polling: true
    search-archive-sync-from-storage: true
    search-archive-sync-max-indexes: 10000000
    search-archive-indices-dl-threads: 20
    search-archive-max-query-threads: 12
    search-archive-shutdown-delay: 5s
    # Temporary folder used as a scratch space, must be unique for each instance of the hybrid, must be distinct from --search-live-live-indices-path
    search-archive-writable-path: /tmp/live-archive/bleve-indexes
    # Local config file that contains query used to warmup the indexes, example content could be `receiver:eosio action:onblock` is those actions are indexed
    search-archive-warmup-filepath: /etc/search/warmup-queries
    search-archive-enable-empty-results-cache=true
    search-archive-memcache-addr: search-v1-memcache:11211
    search-live-tier-level: 100
    search-live-grpc-listen-addr: :9000
    # Temporary folder used as a scratch space, must be unique for each instance of the hybrid, must be distinct from --search-archive-writable-path
    search-live-live-indices-path: /tmp/live-live/bleve-indexes
    search-live-truncation-threshold: 1
    search-live-realtime-tolerance: 1m
    search-live-shutdown-delay: 0s
    search-live-start-block-drift-tolerance: 5200
    search-live-head-delay-tolerance: 0
{{< /highlight >}}

##### `search-router`

###### `deploy/search-v1-d0-router`

{{< highlight yaml >}}
# search-router.yaml
start:
  args:
  - search-router
  flags:
    log-format: json
    log-to-file: false
    common-blockmeta-addr: dns:///blockmeta-v1:9000
    search-common-mesh-dsn: etcd://etcd-cluster:2379/eos-name-here
    search-common-mesh-service-version: v1
    search-router-grpc-listen-addr: :9000
    search-router-enable-retry: false
    search-router-head-delay-tolerance: 3
    search-router-lib-delay-tolerance: 0
{{< /highlight >}}

##### `search-forkresolver`

###### `deploy/search-v1-d0-forkresolver`

{{< highlight yaml >}}
# search-forkresolver.yaml
start:
  args:
  - search-forkresolver
  flags:
    log-format: json
    log-to-file: false
    common-blocks-store-url: <merged blocks remote store>
    search-common-mesh-dsn: etcd://etcd-cluster:2379/eos-name-here
    search-common-mesh-service-version: v1
    search-forkresolver-grpc-listen-addr: :9000
    # Temporary folder used as a scratch space, must be unique for each instance of the fork resolver
    search-forkresolver-indices-path: /tmp/bleve-indexes
{{< /highlight >}}

##### `search-memcached`

A `memcached` instance must be available for the search components to use.

See [search memcached component]({{< ref "./components" >}}#search-memcached) for more details.

#### GraphQL API

The dfuse GraphQL API is all served by the `dgraphql` component. This component depends which itself depends on the various other components and served the various GraphQL queries and subscriptions received.

The component is stateless and a subset of the dependencies can be provided, for example, it could only serves dfuse Search related GraphQL queries by specifying on the search router address.

##### `deploy/dgraphql-v1`

{{< highlight yaml >}}
# dgraphql.yaml
start:
  args:
  - dgraphql
  flags:
    log-format: json
    log-to-file: false
    # Used for billing (not shown here) and for GraphQL examples (PR welcome to add more, see https://github.com/dfuse-io/dfuse-eosio/blob/develop/dgraphql/examples.go)
    common-network-id: eos-name-here
    common-blockmeta-addr: dns:///blockmeta-v1:9000
    common-search-addr: dns:///search-v1-d0-router:9000
    common-system-shutdown-signal-delay: 30s
    common-trxdb-dsn: bigkv://project-id.bigtable-instance/eos-name-here-trxdb-v1
    dgraphql-abi-addr: dns:///abicodec-v1:9000
    dgraphql-disable-authentication: true
    dgraphql-grpc-addr: :9000
    dgraphql-http-addr: :8080
    dgraphql-protocol: EOS
    dgraphql-tokenmeta-addr: dns:///tokenmeta-v1:9000
    dgraphql-override-trace-id: false
{{< /highlight >}}

#### `eosq` Block Explorer

The `eosq` Block explorer is a React app that serves the `eosq` Block explorer. It depends on having `eosws` and `dgraphql` deployed which themselves must have their dependencies full filled to serve the full extent of dfuse components. Overall, the transitive dependencies are:

- Nodeos API (proxied by `eosws`)
- Search Engine (served by `eosws`)
- StateDB (proxied by `eosws`)
- Transaction Database (served by `eosws`)
- TokenMeta (served by `dgraphql`)

The `eosws` and `dgraphql` components must be available through a public address with correct path routing set up.

##### `deploy/eosq-v1`

{{< highlight yaml >}}
# eosq.yaml
start:
  args:
  - eosq
  flags:
    log-format: json
    log-to-file: false
    common-chain-core-symbol: 4,EOS
    eosq-http-listen-addr: :8001
    # A publicly accesible address that load balance and routes the requests to the approriate components
    eosq-api-endpoint-url: https://network.hostname.tld
    eosq-auth-url: null://
    eosq-default-network: eos-name-here
    eosq-disable-analytics: true
    eosq-display-price: true
    eosq-environment: production
{{< /highlight >}}

#### Routing

Here the list of routing paths and to which service they should point to. Each service hostname used here should load balance internally to all replicas of the given component.

- `/dfuse.eosio.v1.GraphQL/*` forwards gRPC (through HTTP2 protocol) traffic to `dgraphql-v1:9000`
- `/dfuse.graphql.v1.GraphQL/*` forwards gRPC (through HTTP2 protocol) traffic to `dgraphql-v1:9000`
- `/grpc.reflection.v1alpha.ServerReflection/*` forwards gRPC (through HTTP2 protocol) traffic to `dgraphql-v1:9000`
- `/graphiql` forwards HTTP traffic to `dgraphql-v1:8080`
- `/graphiql/*` forwards HTTP traffic to `dgraphql-v1:8080`
- `/graphql` forwards HTTP & WebSocket traffic to `dgraphql-v1:8080`
- `/v1/chain/*` forwards HTTP traffic to `eosws-v1:8080`
- `/v1/stream/*` forwards HTTP & WebSocket traffic to `eosws-v1:8080`
- `/v0/*` forwards HTTP traffic to `eosws-v1:8080`
- `/v1/*` forwards HTTP traffic to `eosws-v1:8080`
- `/` forwards HTTP traffic to `eosws-v1:8080`

{{< alert type="note" >}}
Ensure to make the port fit your actual deployment. The port shown here are the defaults one used in this section.
{{< /alert >}}

#### Sample Pods

This is a sample Kubernetes deployment for Kylin:
 * Pods (containers) ending with `-XYXYX` are stateless
 * Those ending with `-0`, then `-1`, etc.. are stateful, potentially have an SSD associated, or are processes that we do not want more than one to be running at any given time.

{{< highlight bash >}}
$ kubectl get pods
NAME                                         READY   STATUS
abicodec-v1-6c74fc64df-c6t56                 1/1     Running
abicodec-v1-6c74fc64df-kqqx4                 1/1     Running
blockmeta-v1-568bf46696-n2vmz                1/1     Running
blockmeta-v1-568bf46696-xjvns                1/1     Running
devproxy-v1-8656f9dfb9-4srrd                 1/1     Running
dgraphql-v1-c76c679c9-675db                  1/1     Running
dgraphql-v1-c76c679c9-9p795                  1/1     Running
eosq-v1-6454d75f5d-rdhwb                     1/1     Running
eosq-v1-6454d75f5d-zn2dk                     1/1     Running
eosrest-v1-74d96dc95-ppq47                   1/1     Running
eosrest-v1-74d96dc95-xldt8                   1/1     Running
eosws-v1-5db85bb974-w66gk                    1/1     Running
eosws-v1-5db85bb974-z7mbt                    1/1     Running
statedb-inject-v1-0                          1/1     Running
statedb-server-v1-5d647cc4fc-584ps           1/1     Running
statedb-server-v1-5d647cc4fc-zsxq5           1/1     Running
merger-v1-0                                  1/1     Running
mindreader-v1-0                              1/1     Running
mindreader-v1-1                              1/1     Running
peering-0                                    1/2     Running
peering-1                                    2/2     Running
relayer-v1-6f77d64fb8-gx4kf                  1/1     Running
relayer-v1-6f77d64fb8-tb5mp                  1/1     Running
search-v1-d0-forkresolver-7457cf86c8-tr7jq   1/1     Running
search-v1-d0-hybrid-758d7c498b-gfn8v         1/1     Running
search-v1-d0-hybrid-758d7c498b-kvhqc         1/1     Running
search-v1-d0-indexer-50-0                    1/1     Running
search-v1-d0-indexer-5000-0                  1/1     Running
search-v1-d0-router-7f85db9ff6-cnp9p         1/1     Running
search-v1-d0-router-7f85db9ff6-kjqdd         1/1     Running
search-v1-d0-t10-0-106m4-50000-0             1/1     Running
search-v1-d0-t10-0-106m4-50000-1             1/1     Running
search-v1-d0-t20-106m4-head-5000-0           1/1     Running
search-v1-d0-t20-106m4-head-5000-1           1/1     Running
search-v1-memcache-cb98db48-57q6k            1/1     Running
tokenmeta-v1-0                               1/1     Running
tokenmeta-v1-1                               1/1     Running
trxdb-loader-v1-b9d67d857-n2vsl              1/1     Running
{{< /highlight >}}

{{< alert type="note" >}}
* Not shown here is a small `etcd` cluster, deployed through the `etcd-operator`.
* The single `statedb-inject`. The individual `statedb-server`s will sustain a crash/restart of `statedb-inject` because they themselves are fed with block data, and will cover the gap between what `inject` has written, and the HEAD of the chain.
* There is a single `merger`, which can go offline for some time. It produces merged blocks files once each 100 blocks anyway, and all processes have an internal memory with a segment of the head down to the last merged block. You don't want to keep your `merger` for too long, because it will put RAM pressure on other systems that wait for a merged block before purging their internal memory for the segment of the chain.
{{< /alert >}}
