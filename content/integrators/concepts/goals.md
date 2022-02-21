---
weight: 10
title: Goals & Motivations
---

The Firehose is, from the consumer standpoint, a gRPC service, serving an ordered, yet fork-aware, stream of blocks with built-in cursoring enabling you to stop and restart at the exact block you need, even on a forked block. These blocks contain details about the consensus metadata, all transactions and traces of their executions including state changes.

Our vision is that these firehose blocks are sufficient as the single source of data for any API that someone would want to be built on top of it, removing the need for EVM calls while populating a database.

For each protocol, a strict and complete definition of the data structure of the protocol is defined in Protocol Buffer schemas. The blocks flowing through the Firehose are therefore messages that use those schemas (we call them blockchain `codecs`).

The goal of the Firehose is to provide a way to index blockchain data which:
- Is capable of handling high throughput chains (network bound)
- Increases linear reprocessing performances
- Increases backfilling performance & maximize data agility by enabling parallel processing
- Reduces risks of non-deterministic output
- Improves testability and developer experience when iterating on blockchain data
- Simplifies operators reprocessing needs relying on flat data files instead of live processes like an archive node reduces the need for RPC calls to nodes
