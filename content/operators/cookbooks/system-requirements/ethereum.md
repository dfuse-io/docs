---
weight: 45
title: Ethereum
---

The **goal of this page** is to set expectations and get you to understand what is required to run Firehose for Ethereum, for different protocols.

The Firehose stack is extremely elastic, and supports handling networks of varied sizes and shapes. It is also heavy on data, so **make sure you have a good understanding** of the [different data stores, artifacts and databases]({{< ref "/operators/concepts/data-stores-artifacts" >}}) required to run the Firehose stack.

The deployment efforts will be proportional to the size of history, and the density of the chain at hand.

## Network shapes

This document outlines requirements for different shapes of networks

### Persistent chains

In order to scale easily, you will want to decouple [components]({{< ref "/operators/concepts/components" >}}) that run in a single process.

The storage requirements will vary depending on these metrics:

* **The length of history**: which will affect the quantity of search indexes that need to existe in `dstore` storage, and being served by `search-archive` nodes, thus the amount of RAM
* **Throughput in transactions and calls**: Calls on Ethereum are the smallest units of execution to produce meaningful data, transaction overhead becomes negligible once you have 2-3 calls in a transaction. A single ERC20 transfer generally has 1 call, 2 calls when there is a proxy contract involved. A Uniswap swap is usually composes of a few dozens of calls.

The CPU/RAM requirements will depend on these factors:

* **High Availability**: highly available deployments will require **2 times the resources** (or more) listed in the following examples, as a general rule.
* **Throughput of queries**: the Firehose stack is built for horizontal scalability, the more requests per second you want to fulfill, the larger the deployment, the more CPU/RAM you will need to allocate to your cluster.

{{< alert type="note" >}}
These stats are from March 2022, but chains of similar density and similar age will behave similarly.
{{< /alert >}}

#### Ethereum Mainnet
