---
title: System Requirements
weight: 30
---

{{< alert type="note" >}}
The **goal of this page** is to set expectations and get you to understand what is required to run dfuse, at different scale.
{{< /alert >}}

The dfuse platform is extremely elastic, and supports handling networks of varied sizes and shapes.

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
* **Throughput in actions**:

The CPU/RAM requirements will depend on these factors:
* **High Availability**: highly available deployments will require **2 times the resources** listed in the following examples, as a general rule.
* **Throughput of queries**: the dfuse platform is built for horizontal scalability, the more requests per second you want to fulfill, the larger the deployment, the more CPU/RAM you will need to allocate to your cluster.

{{< alert "note" >}}
These stats are from July 2020, but chains of similar density and
similar age will behave similarly.
{{< /alert >}}



#### Small scale chains

EOSIO Testnet (by Block.one)
* https://testnet.eos.io/
* Age of the chain: 14M blocks (2.5 months old, **[refreshes (resets) each 3 months](https://testnet.eos.io/faq)**)
* TPS:



#### Medium scale chains

CryptoKylin:
* https://www.cryptokylin.io/
* Age of the chain: 114M blocks (2.00 years old)
* TPS:


#### Large scale chains

EOS Mainnet:
* https://eosq.app
* Age of the chain: 131M blocks (2.08 years old)
* TPS: on June 30th 2020, an average of 819 action traces per second
  * Actions in EOSIO are the smallest units of execution to produce meaningful data, transaction overhead becomes negligible once you have 2-3 actions in a transaction
* Growth: assuming constant
  * NOTE: throughout the history of the chain, there was not _always_ that volume of data. We are here assuming a


// First reality check as to what you need to run this
// Perhaps a table of:
//   ephemeral laptop instance | simplest long-running non-HA instance | large-scale HA deployment
// What is required for each
// Network sizing
