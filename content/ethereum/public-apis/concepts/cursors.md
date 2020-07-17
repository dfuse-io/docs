---
weight: 60

pageTitle: Cursors
pageTitleIcon: eeth

sideNav: true
sideNavTitle: Public APIs
sideNavLinkRename: Cursors

BookToC: true
#release: stable

---

{% content "shared/cursors.md" %}

## Ethereum specifics

## GraphQL Query Pagination
<!--

* In general, we also use cursors in Connection objects in GraphQL
* Describe the general principles we use in our design.
* Link to Facebook's doc, and link to Pagination/Connection article in this section.

-->

{{< alert type="note" >}}
This pagination is currently only implemented on the Ethereum GraphQL schema. We will slowly roll out this pagination
pattern to all of our GraphQL schemas and it will be a dfuse-wide concept.
{{</ alert >}}

In a GraphQL query, the connection model provides a standard mechanism for slicing and paginating the result set. In the response, the connection model provides a standard way of providing cursors, and a way of telling the client when more results are available.

It is important to note that not all GraphQL query return connection models, only the ones that require pagination support. Our [`searchTransations`](/ethereum/public-apis/reference/graphql/#query-searchtransactions") query for Ethereum is a good example of a paginated query.

A `Connection` type must have fields named `edges` and `pageInfo`:

* `egdes`: returns a list of `<EdgeType>`; each specific `<EdgeType>` will have a `node` field which contains result elements of the query and a `cursor` to reference that specific `node`. For example, in the [`searchTransations`](/ethereum/public-apis/reference/graphql/#query-searchtransactions") query the `node` are of type [`TransactionTrace`](/ethereum/public-apis/reference/graphql/#query-transactiontrace".
* `pageInfo`: contains a `startCursor` and `endCursor` which corresponds to the first and last nodes in the `edges` respectively.

Consider the following example (Ethereum):

{{< tabs "graphql-cursor" >}}
{{< tab lang="graphql" title="GraphQL Response" >}}
{
  "data": {
    "searchTransactions": {
      "edges": [
        {
          "cursor": "A110RysJ6aB9YyWsFvipofe7LJ4wA11rUwHiI0VFg4vw83fBiJqjVjcmOkiGkP311Ry5SVqkj97LRiwu85JT74e5xuttviNuT3t_k9_vqrO-e6f3OAwcJO42VeiMYYzYW2mCYQr_Lw==",
          "node": {
            "__typename": "TransactionTrace",
            "hash": "0x223d30ee304e8632b33f14b05e9d8793963b22719469b2795ff569e5e8acc811",
            "from": "0x1e63a6146c8fa1a43964af901cb42aa48debc2b1",
            "to": "0x06012c8cf97bead5deae237070f9587f8e7a266d"
          }
        },
        {
          "cursor": "bN1XxBvXCvlSTgCcckQWz_e7LJ4wA11rUwHiI0VFg4vw83fBiJqjVjcmOkiGkP311Ry5SVqkj97LRiwu85JT74e5xuttviNuT3t_k9_vqrO-e6f3OAwcJO42VbzaNtvdCm_XYAz9fA==",
          "node": {
            "__typename": "TransactionTrace",
            "hash": "0xfdd36ac026664fb75d3c90384f439a79a739a39acc382b026e09d530a3f1e72a",
            "from": "0x7891f796a5d43466fc29f102069092aef497a290",
            "to": "0x06012c8cf97bead5deae237070f9587f8e7a266d"
          }
        },
        {
          "cursor": "J_uTbOh4N4wUR42TNx344ve7LJ4wA11rVwGzLUdFgt_09iTB3cmhAWQnPBzRk_iijkHjGFKs29abQXd_9pQBvNLtlrti7SM_EHssxt-9-OXoLKD1OVwaeLgwVe6MZdyIU23RawOpKw==",
          "node": {
            "__typename": "TransactionTrace",
            "hash": "0x4274c8a699bacdb11b89e12c95176696f4228095be311deec5bf167946540e35",
            "from": "0xe6f8c575965d478fe98f4e9af91e0e1bbd03d6fa",
            "to": "0xb1690c08e213a35ed9bab7b318de14420fb57d8c"
          }
        }
      ]
    }
  }
}
{{< /tab >}}
{{< tab lang="graphql" title="GraphQL Request" >}}
query {
  searchTransactions(indexName:CALLS, query: "to:0x06012c8cf97BEaD5deAe237070F9587f8E7A266d", sort: DESC, limit: 3) {
    edges {
      cursor
      node {
        __typename
        hash
        from
        to
      }
    }
  }
}
{{< /tab >}}
{{< /tabs >}}

In this example `searchTransactions` returns a collection of 3 `edges`, each one pointing to a `node` of type `TransactionTrace` with specific attributes. Furthermore, each `edge` has a `cursor` which is a `pointer` to that specific `node`, in this case, that specific `TransactionTrace`.

The second transaction trace (with hash `0xfdd36ac....`) of the collection has a cursor pointer of

`bN1XxBvXCvlSTgCcckQWz_e7LJ4wA11rUwHiI0VFg4vw83fBiJqjVjcmOkiGkP311Ry5SVqkj97LRiwu85JT74e5xuttviNuT3t_k9_vqrO-e6f3OAwcJO42VbzaNtvdCm_XYAz9fA==`

Thus if you were to run the same query with this`cursor` value, you would get the subsequent transaction trace: `0x4274c8a699bacdb11b89e12c95176696f4228095be311deec5bf167946540e35`

{{< tabs "graphql-cursor-2" >}}
{{< tab lang="graphql" title="GraphQL Response" >}}
{
  "data": {
    "searchTransactions": {
      "edges": [
        {
          "cursor": "J_uTbOh4N4wUR42TNx344ve7LJ4wA11rVwGzLUdFgt_09iTB3cmhAWQnPBzRk_iijkHjGFKs29abQXd_9pQBvNLtlrti7SM_EHssxt-9-OXoLKD1OVwaeLgwVe6MZdyIU23RawOpKw==",
          "node": {
            "__typename": "TransactionTrace",
            "hash": "0x4274c8a699bacdb11b89e12c95176696f4228095be311deec5bf167946540e35",
            "from": "0xe6f8c575965d478fe98f4e9af91e0e1bbd03d6fa",
            "to": "0xb1690c08e213a35ed9bab7b318de14420fb57d8c"
          }
        }
      ]
    }
  }
}
{{< /tab >}}
{{< tab lang="graphql" title="GraphQL Request" >}}
query {
  searchTransactions(indexName:CALLS query: "to:0x06012c8cf97BEaD5deAe237070F9587f8E7A266d", sort: DESC, limit: 1,cursor: "bN1XxBvXCvlSTgCcckQWz_e7LJ4wA11rUwHiI0VFg4vw83fBiJqjVjcmOkiGkP311Ry5SVqkj97LRiwu85JT74e5xuttviNuT3t_k9_vqrO-e6f3OAwcJO42VbzaNtvdCm_XYAz9fA==") {
    edges {
      cursor
      node {
        __typename
        hash
        from
        to
      }
    }
  }
}

{{< /tab >}}
{{< /tabs >}}
