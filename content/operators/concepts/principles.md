---
weight: 20
title: Principles & Approach
---

This section discusses the design principles of the Firehose, which were greatly inspired by the large scale data-science machinery and processes previously developed by the StreamingFast team.

## General data science approach

Here are a few principles that drove our design:

- A flat file is better than a CPU/RAM-consuming process
- Data is messy, design for fast iteration of any data processes
- Split concerns, isolate tasks, build small and robust components
- Always try to make tasks/processes parallelizable or shardable
- Define clear “data contracts” between tasks/processes (APIs, RPC query formats, Data model definitions)
- Be excruciatingly precise when defining, referencing, or identifying concepts or data models. Leave no rock unturned.
- The only guarantee in data-science is that your data processes will change and evolve. Migrating data is annoying, making these very important:
- File formats
- Forward/backward-compatibility
- Versioning
- Performance

## Principles applied

### Extraction

Find the shortest path from deterministic execution of blocks/transactions to a flat file.

- Develop laser-focused processes which are simple and robust (extractor, merger, relayer, firehose, see graphs below).
- Avoid coupling extraction with indexing itself (or other services).
- Ensure minimal impact on performance on the node executing the write operations of a given protocol.

### Data Completeness

Extract All The Data from the nodes, so we literally never need to go back and query them, making the data complete, rich and verifiable.

When a transaction changes the balance for a given address from `100` to `200`, we would store the storage key that was changed, the previous and next value. This allows atomic updates in forward and backwards directions. It also allows for integrity checks to ensure no data is inconsistent (the next mutation for that key should have a `previous_data` of `200` before it changes to something else, otherwise there’s a problem with the extraction mechanisms and data quality will suffer).

Making the data complete means that the relation between a transaction, the block’s schedule, execution, expiration, events produced by its side effects, call tree, each call’s state transition and effects, are safeguarded with their relation. Figuring out relations after the fact can only be a source of pain, and of missed opportunities for certain uses of the data.

Some protocols offer JSON-RPC requests that allow querying either transaction status or state, but separately. A data process that is triggered by an Ethereum Log event might greatly benefit from checking if the parent contract of the call which produced the given log event is mine, or another one I know and trust.

Without easy access to this kind of data, people inevitably work around by producing more events, increasing gas costs, all of that to circumvent the fact that data is not being made available in a richer way.

Availability of such data even has effects on contract design, as a contract designer needs to think about how the stored data will be queried and consumed, often by his own application.

Richer external data processes allow devs to simplify contracts, and lower on-chain operation costs.

### Modeling With Extreme Care

The data model the data produced by protocols with extreme care. We discovered peculiarities of the different protocols the hard way.

Some subtle interpretations of bits of data produced by a blockchain (e.g.: the meaning of a reverted call within the call stack of an Ethereum transaction) are such that, if enough information is not surfaced from the source, it can be impossible to interpret the data downstream. It is only when the model definitions (protobuf schemas) are complete and leave no bit of data in a node that we know that we can serve all needs: that no other solution is needed.

Conceptually, the data extracted from a node should be so complete that one could write a program that takes that data, and rebuilds a full archive node out of it, and is able to boot it.

### Use Files and Streams of Pure Data

As opposed to requests/responses model, to alleviate the challenges of querying pools of (often load-balanced) nodes in a master-to-master replication setup (like most blockchains act by default). This avoids massive consistency issues, their retries, the incurred latency, and greatly simplifies the consuming code.

### State Transition Hiearchy

Use state transitions scoped to a call, indexed within a transaction, indexed within a block.

Most blockchains “round up” state changes for all transactions into a block to facilitate consensus.[1] But the basic unit of execution remains a single smart contract execution (a single EVM call alone, where calling another contract means a second execution).

Precision in state is therefore lost for what happens mid-block: the state of a contract changes in the middle of a transaction, in the middle of a block. If you want to know the balance at the *exact* point (when you’re processing a log event for instance), because its required for some calculations, you’re out of luck, because the node will provide the response that is true at the *end* of that block. And you cannot know if there are other transactions after the one you are indexing that mutated the same state again. So querying a node will throw you off, sometimes badly.

Not all chains make consuming the actual state easy (Solidity makes that pretty opaque, in the form of a bytes32 => bytes32 mapping, although there are ways to decode it). But making that state usable creates tremendous opportunities for indexing.

Regarding versioning, compatibility and speed of file content, we found Google’s Protocol Buffers version 3 to meet these last requirements, while striving for simplicity (e.g. as attested by their removal of optional/required fields in version 3).