---
weight: 80

pageTitle: Filtering
pageTitleIcon: eosio

sideNav: true
sideNavTitle: System Admin Guide
sideNavLinkRename: Filtering

BookToC: false
#release: stable

---

{{< alert type="note" >}}
The **goal of this page** is to help you understand the filtering capabilities, data flows, and impact filtering has on the different `dfuse for EOSIO` [components]({{< ref "./components" >}}).
{{< /alert >}}



## Filtering language

Filtering is applied through the `--common-include-filter-expr` and `--common-exclude-filter-expr` parameters. They are both CEL programs.

Filtering in the dfuse platform uses the Common Expression Language, developed by Google, and used in high throughput environments (like their ACL checking routers).

It is a very simple, yet powerful language. It resembles all the languages you already know (Java, JavaScript, C, C++, etc.)


**Important**: They filter what gets **processed** by different components across dfuse for EOSIO stack. They are not a language you can use to query _dfuse Search_ indexes.

CEL is Google's Common Expression Language:

* [Introduction](https://github.com/google/cel-spec/blob/master/doc/intro.md)
* [Language reference](https://github.com/google/cel-spec/blob/master/doc/langdef.md)
* [Google Open Source CEL Website](https://opensource.google/projects/cel)
* [Go implementation used here](https://github.com/google/cel-go)



## Components

Filtering is applied on certain components, while other components are happy to accept filtered data and process it.


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


### `fluxdb`

`fluxdb` will be affected by filtered data coming from a `relayer` that relays filtered blocks.

You need to be diligent in what you filter, to not miss table changes that would otherwise make your view of tables inconsistent.

You can use `db.table` and `db.scope` in your filtering criteria to make sure transactions that mutate certain tables always make it through filtering.

<!-- soon, when a `panic()` is removed) -->


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
