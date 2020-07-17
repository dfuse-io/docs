---
weight: 20
#same weight for all pages in this section to auto-order them A->Z
pageTitle: GET /v0/search/transactions
pageTitleIcon: eosio

sideNav: true
sideNavTitle: Public APIs
sideNavLinkRename: GET /search/transactions

BookToC: true
release: stable

aliases:
  - /reference/eosio/rest/search-transactions/

---

Search an EOSIO blockchain for transactions based on free-form
criterias, using the [_dfuse_ Search query language]({{< ref "../search-terms" >}}).

{{< alert type="important" >}}
We **strongly suggest** to use the [GraphQL search API]({{< ref "/eosio/public-apis/reference/graphql-api#query-searchtransactionsforward" >}})
of this endpoint. Advantages of using the GraphQL version:

- Streaming capabilities, or to be able to stream new results as they pushed on the chain. Quit or got disconnected? Simply resume at exact point you left off by using a [cursor]({{< ref "../../concepts/cursors" >}}).
- Easier data model to extract matching actions from response (i.e. to get only the actions in the transaction that matched the query used).
- Possibility to greatly reduce bandwidth transfer & cost (ingress to your server) by specifying the exact trimmed down data payload you need (excellent for browser & mobile usage).
- A much cleaner interface to query by block range (`lowBlockNum` and `highBlockNum` instead of harder to reason about `startBlock` and `blockCount`)
- On-the-fly ABI decode to JSON smart contract database rows that changed due to the execution of the transaction.
{{< /alert >}}

## Usage

Sample request:

{{< example-request id="search-transactions" url="https://mainnet.eos.dfuse.io/v0/search/transactions?start_block=0&block_count=10000&limit=10&sort=desc&q=receiver:eosio.token+action:transfer+data.to:someaccount1" >}}

## Pagination

The **dfuse Search** supports stable pagination through the use of the
`cursor` parameter. If your request yields results and there are more
to come, the response will contain a non-empty `cursor` field (which
looks like opaque base64-encoded data).

To fetch the next batch, pass the `cursor` in the next request, while
keeping all other parameters identical to the first query. You can
tweak the `limit` as you go, and the cursor will allow you to continue
where you left off, without missing anything between the two queries:
something that is impossible to do with only an `offset` parameters,
in a moving chain.

When doing searches in the moving part of the chain (the head), it is
*possible* that some results previously returned are not forked out
(because some of its blocks are ignored by block producers for some
reasons).  If you pass the `cursor` properly, the pagination system
will verify that it has *not* given you any such results.

If there are the slightest chance that you had received results that
didn't make it to the chain, the `forked_head_warning` parameter will
be set to `true` in the response. It is then appropriate to inform
your user that it is possible that some results are now stale, and to
refresh their page or something similar.

To avoid such situation, use `with_reversible=false` in your query
(the default), to search only irreversible blocks and transactions: in
that case, there are no chances that you get results that would
suddenly disappear.



#### Input parameters

{{< method-list-item name="q" type="String" required="true" >}}
  Search query string. See [Search language specs]({{< ref "../search-terms" >}}) for details.
{{< /method-list-item >}}

{{< method-list-item name="start_block" type="Number (uint32)" required="false" >}}
  Block number to start search (inclusive). See below for the special meaning of value `0`.
{{< /method-list-item >}}

{{< method-list-item name="sort" type="String" required="false" >}}
  Defaults to _ascending_ search. Use `DESC` to sort descending.
{{< /method-list-item >}}

{{< method-list-item name="block_count" type="Number (uint32)" required="false" >}}
  Number of blocks to search from `start_block`. Depending on `sort` order, the `block_count` will count upwards or downwards.
{{< /method-list-item >}}

{{< method-list-item name="limit" type="Number (uint64)" required="false" >}}
  Cap the number of returned results to `limit`. Defaults to its maximum value: `100`.
{{< /method-list-item >}}

{{< method-list-item name="cursor" type="String" required="false" >}}
  If `cursor` is passed back (from a previous response)
{{< /method-list-item >}}

{{< method-list-item name="with_reversible" type="Boolean" required="false" >}}
  If `with_reversible` is set to `true` actions included in blocks that are *not yet* irreversible will be included.
{{< /method-list-item >}}

When `start_block` is unspecified (value: `0`), it takes a special meaning depending on the context:
* When the sort order is `ascending`, a start_block of `0` means the beginning of the chain.
* When the sort order is `descending`, a start_block of `0` means either the HEAD of the chain (if `with_reversible` is true) or the LIB (Last Irreversible Block) of the chain (if `with-reversible` is false)

By default, a query that does not specify `start_block` nor `sort`, the results will be ascending (block-wise *and* transaction-wise)

#### Response

Returns a [SearchTransactionsResponse]({{< ref "../types/SearchTransactionsResponse" >}}).
