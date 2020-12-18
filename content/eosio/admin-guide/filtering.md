---
weight: 80
title: Filtering
---

{{< alert type="note" >}}
The **goal of this page** is to help you understand the filtering capabilities, data flows, and impact filtering has on the different `dfuse for EOSIO` [components]({{< ref "./components" >}}).
{{< /alert >}}

## Filtering Language

Filtering is applied through the `--common-include-filter-expr`, `--common-exclude-filter-expr` and `--common-system-actions-include-filter-expr` parameters. They are all CEL programs.

**Important**: They filter what gets **ingested** by different components across dfuse for EOSIO stack. They are not a language you can use to query _dfuse Search_ indexes.

Filtering in the dfuse platform uses the Common Expression Language, developed by Google, and used in high throughput environments (like their ACL checking routers). It is a very simple, yet powerful language. It resembles all the languages you already know (Java, JavaScript, C, C++, etc.). Here some resources about CEL language:

* [Introduction](https://github.com/google/cel-spec/blob/master/doc/intro.md)
* [Language reference](https://github.com/google/cel-spec/blob/master/doc/langdef.md)
* [Google Open Source CEL Website](https://opensource.google/projects/cel)
* [Go implementation used here](https://github.com/google/cel-go)

## Concepts

### Filtering Level

We can discern three levels of elements:
- Blocks
 - Transaction Traces
   - Action Traces

The filtering feature works at the transaction level and annotates at the action level, let's understand what this means. Filtering is applied on each block processed by the component. What the filtering does at the block level is to loop through all transaction trace.

If there is **no** action trace inside the transaction trace that matches the filter according to the precedence rules listed below, then the transaction is removed from the block completely.

If there is some action trace inside the transaction that matches the filter according to the precedence rules listed below, then the transaction is kept in the block and all action trace that matched the filter are flagged as such.

Then, what is actually stored/used is decided on a component by component basis.

### Filtering Precedence

The filtering rules are applied in specific order, the rules are ordered by:
- System actions include filter
- Include filter
- Exclude filter

Here some cases to better see the ordering in action:
- If an action matches the system actions include filter: **included**
- If an action does not match the include filter and does not match the system actions include filter: **excluded**
- If an action does match the include filter, does match the exclude filter and does not match the system actions include filter: **excluded**
- If an action does match the include filter, does match the exclude filter but does match the system actions include filter: **included**

### System Actions

Some actions are required internally by some dfuse for EOSIO components so that all capabilties are working as expected. A major example of this is the `setabi` action on the `eosio` system contract. This action is used by various subsystems to perform the decoding of contract's specific data against their active ABI.

If `setabi` actions were filtered out by mistake, some part of the dfuse for EOSIO would not work properly. To limit the chance that this happen as an oversight of using an include filter that is too narrow, the system actions that are required by dfuse for EOSIO are noted in a separate flag `common-system-actions-include-filter-expr`.

It's possible to have this flag set to `false` to also completely filtered out those system actions, but that should be done only if you totally understands the impacts it has on your deployment. A good use case example is when you are only ever interested by the dfuse Search component, in this case it's safe to exclude all system actions since the search does not depend on it.

## Components

Filtering is applied on certain components, while other components are happy to accept filtered data and process it. All components listed below filter merged blocks read from the filesystem and expects live blocks to arrive to them already filtered via the `relayer` component.

This means that if yhe

### `relayer`

The `relayer` is the first component to filter in a deployment.

It will filter blocks it receives (from either another `relayer` or a `mindreader`), and serve filtered blocks through the same `BlockStream` gRPC interface. Each block within will be marked as `FilteringApplied == true` (one of the values in the EOSIO-specific protobuf `Block`).

It uses primitives available to all components, but when the `relayer` does the filtering, it cuts on much of the network traffic that follows, thereby shrinks much of the RAM needs of all components downstream (like `search-live`, `dgraphql`, `blockmeta`, etc...)

### `search`

The `search` will only index actions that matched the inclusion filter and did **not** match the exclusion one.

The `forkresolver`, the `indexer` and the `live` components of `search` will all potentially need the filtering criterias, as they might pick up _merged block logs_ from Object Storage, and index things on-the-fly.  In that case, they will first apply the filtering criterias.

### `trxdb-loader`

The `trxdb-loader` component will only save transaction traces in the database that contains at least 1 matching action.

This means that, once filtered, the resulting `trxdb` will _not_ contain all transactions.  Will _not_ be able to resolve transaction traces requested by `dgraphql` or pointers reported by `search` unless they are _also_ in this database.

### `statedb`

`fluxdb` will be affected by filtered data coming from a `relayer` that relays filtered blocks.

You need to be diligent in what you filter, to not miss table changes that would otherwise make your view of tables inconsistent.

<!--
You can use `db.table` and `db.scope` in your filtering criteria to make sure transactions that mutate certain tables always make it through filtering.
 soon, when a `panic()` is removed)
-->

## Identifiers

An similar identifiers available for searching in **dfuse Search** is available for filtering but
with more capabilities because any action's data field can be search for whereas in **dfuse Search**,
only a subset of all fields is possible.

For example, a **dfuse Search** of:

{{< highlight none >}}
receiver:eosio.token data.from:bob
{{< /highlight >}}

would be filtered as:

{{< highlight javascript >}}
receiver == 'eosio.token' && data.from == 'bob'
{{< /highlight >}}

See the [Search Terms page]({{< ref "/eosio/public-apis/reference/search/terms" >}}) for all EOSIO terms that can be filtered.

### Examples

Showcase examples here are given as examples, mainly for syntax purposes, so you can see the full
power of the CEL filtering language

There might be new stuff to add to certain examples, like spam coins or new system contracts, this
is **not** a fully accurate document for those stuff, you are invited to make your own research
to ensure completeness based on your use case.

#### EOS Mainnet Spam

Here an example to filter out spam transactions on the EOS Mainnet:

{{< highlight javascript >}}
account == 'eidosonecoin' || receiver == 'eidosonecoin' || (account == 'eosio.token' && (data.to == 'eidosonecoin' || data.from == 'eidosonecoin'))
{{< /highlight >}}
