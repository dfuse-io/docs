---
weight: 45
title: System Requirements
---

{{< alert type="note" >}}
The **goal of this page** is to set expectations and get you to understand what is required to run dfuse, at different scale.
{{< /alert >}}

The dfuse platform is extremely elastic, and supports handling networks of varied sizes and shapes. It is also heavy on data, so **make sure you have a good understanding** of the [different data stores, artifacts and databases]({{< ref "./data-stores-artifacts" >}}) required for dfuse to run.

The deployment efforts will be proportional to the size of history,
and the density of the chain at hand.


## Network shapes

This document outlines requirements for different shapes of networks


### Local development chain

`dfuse for EOSIO` can be booted on your local computer with minimal overhead on top of the blockchain node (which itself can be trimmed).

It will boot all the components and APIs in a single process.

You can control the amount of RAM and storage used by the `nodeos` process with these `config.ini` flags (in both `producer` and `mindreader` folders):

{{< highlight ini >}}
chain-state-db-size-mb = 50
chain-state-db-guard-size-mb = 5
reversible-blocks-db-size-mb = 4
reversible-blocks-db-guard-size-mb = 2
{{< /highlight >}}

These will keep your `nodeos` node's RAM consumption under **200MB**. Twice that if you run both a `producer` and a `mindreader` node.

A fresh start `dfuseeos` on a blank chain (after a fresh `dfuseeos init` and/or `dfuseeos purge`) will consume around **700MB**. However, plan **4GB** of RAM for growth, increase in the number of transactions in blocks, and for use during an extended period of time.


### Persistent chains

In order to scale easily, you will want to decouple [components]({{< ref "./components" >}}) that run in a single process in [local instance deployments]({{< ref "./installation" >}}).

The storage requirements will vary depending on these metrics:

* **The length of history**: which will affect the quantity of search indexes that need to existe in `dstore` storage, and being served by `search-archive` nodes, thus the amount of RAM
* **Throughput in actions**: Actions in EOSIO are the smallest units of execution to produce meaningful data, transaction overhead becomes negligible once you have 2-3 actions in a transaction. A single token transfer generally has 3 actions.

The CPU/RAM requirements will depend on these factors:

* **High Availability**: highly available deployments will require **2 times the resources** listed in the following examples, as a general rule.
* **Throughput of queries**: the dfuse platform is built for horizontal scalability, the more requests per second you want to fulfill, the larger the deployment, the more CPU/RAM you will need to allocate to your cluster.

{{< alert type="note" >}}
These stats are from July 2020, but chains of similar density and
similar age will behave similarly.
{{< /alert >}}



<!-- #### Small scale chains -->

<!-- EOSIO Testnet (by Block.one): -->

<!-- * https://testnet.eos.io/ -->
<!-- * Age of the chain: 14M blocks (2.5 months old, **[refreshes (resets) each 3 months](https://testnet.eos.io/faq)**) -->
<!-- * TPS: 2-3 actions/s -->


#### Medium scale chains

CryptoKylin:

* https://www.cryptokylin.io/
* Age of the chain: **114M** blocks (2.00 years old)
* TPS: ~5 tps
* This is a long running chain, with a low volume of transactions.
* Search components:
  * Indexes size: **230 GB**
  * Object Storage for those indexes, compressed at approximately **18%**.
  * `archive` node for full history:
    * CPU/RAM: **4 vCPUs** and **12GB RAM**. Double that for HA.
    * Live SSDs to host **230 GB** uncompressed indexes
  * `live` nodes:
* `trxdb` size: **560 GB**
* `fluxdb` size: **27 GB**


#### Large scale chains

EOS Mainnet:

* https://eosq.app
* https://bloks.io
* Age of the chain: **131M blocks** (**2.08 years** old)
* TPS: on June 30th 2020, an average of 819 action traces per second.   Throughout the history of the chain, there was not _always_ that volume of data.
* Search components:
  * This includes FILTERED search data.  This excludes `eidos` mining.  See filtering query below.
  * Indexes size: **5.2TB**
    * Stored as compressed zstd indexes in Object Storage (`dstore`), **19%** of the total size.
  * CPU/RAM for `archive` nodes: around **10 vCPUs**, **100GB RAM** (double that for HA)
    * An uncompressed copy of those **5.2TB** indexes on live SSDs.
    * This assumes around 10 **new** incoming requests per second.
    * **NOTE:** In search, many users use long-lived streaming connections. This could still mean thousands of in-flight requests.
  * CPU/RAM for `live` nodes: around **4 vCPUs**, **24GB RAM** (double for HA, triple, quadruple to scale real-time reads)
    * In-flight requests will affect the `live` deployment sizing.
  * CPU/RAM for `indexer` nodes: around **2 vCPUs**, **8GB RAM**.
    * If you have [multiple search tiers]({{< ref "./components" >}}#search-archive) with different blocks sizes, it could mean 2 of these.

* Size of `trxdb` (this data includes all data, unfiltered, including "spammy" transactions): **15.1 TB**

* Size of `fluxdb` key/value store (unfiltered): **454 GB**
  * This _does_ include all state changes for the whole history of the chain, rounded at the block height.

The estimates for search indexes imply this search filtering:

{{< highlight sh >}}
dfuseeos start
      ...
      --search-common-action-filter-on-expr=""
      --search-common-action-filter-out-expr=account == 'eidosonecoin' || receiver == 'eidosonecoin' || (account == 'eosio.token' && (data.to == 'eidosonecoin' || data.from == 'eidosonecoin')) || account == 'eosiopowcoin' || receiver == 'eosiopowcoin' || (account == 'eosio.token' && (data.to == 'eosiopowcoin' || data.from == 'eosiopowcoin'))
{{< /highlight >}}

```
```
