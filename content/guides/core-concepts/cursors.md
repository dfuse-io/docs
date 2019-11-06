---
title: Cursors
weight: 30
---
{{< row-wrapper >}}
{{< sub-section-title title="Cursors" >}}

## All About Cursor
<!--
Describe what a cursor is in other database technologies, link Wikipedia, etc..
Its use as a pointer in an interrupted search query.
Describe how it applies to our technology, where it's used:
  * In search,
-->
A cursor is a control structure that enables traversal over records. Cursors facilitate subsequent processing of the traversal. It is akin to programming language concept of iterator. Cursors are a core concept within the dfuse ecosystem and is heavily used in dfuse Search.

Besides pagination, cursors are instrumental when using subscriptions to deal with network disconnections. By using the cursor of your last successful request, you can reconnect and continue streaming without missing any documents. 

We have a designed our cursor as an opaque structure that enables your query to sequential process the rows in your result set. This design gives us flexibility that if the pagination model changes in the future, the cursor format will remain the same.

## In search

Our cursor is a chain-wide cursor. In other words it points to a specific transaction within a block, within a range. This allows to display results by pagionation or stream from that specific point in both directions. In addition the cursor is fork aware. If the paginated query of stream return a transaction that was forked, you will be notified that said transaction is forked via the `undo` field.

<!--
Insert JC Diagram
-->

## Pagination in Ethereum
<!--

* In general, we also use cursors in Connection objects in GraphQL
* Describe the general principles we use in our design.
* Link to Facebook's doc, and link to Pagination/Connection article in this section.

-->

In a GrapQL query, the connection model provides a standard mechanism for slicing and paginating the result set. In the response, the connection model provides a standard way of providing cursors, and a way of telling the client when more results are available.

It is important to note that not all GraphQL query return connection model, only the ones that require pagination support. Our [`searchTransations`](/reference/ethereum/graphql/#query-searchtransactions") is a good example of a paginated query.

A Connection types must have fields named `edges` and `pageInfo`: 

* `egdes`: returns a list of `edge_type`; each `edge_type` will have a `node` field which contains an object of the query and a `cursor` to reference that specific `node`. In the `searchTransations` query the `node` are of type `TransactionTrace`.
* `pageInfo`: contains a `startCursor` and `endCursor` which corresponds to the first and last nodes in the `edges` respectively.

Consider the following example:

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
  searchTransactions(query: "to:0x06012c8cf97BEaD5deAe237070F9587f8E7A266d", sort: DESC, limit: 3) {
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
      
In this example `searchTransactions` returns a collection of 3 `edges`, each one pointing to a `node` of type `TransactionTrace` with specific attributes. Furthermore, each `edge` as a `cursor` which is a `pointer` to that specific `node`, in our case, that specific `TransactionTrace.

The second transaction trace (with hash `0x223d30e....`)  of the collection has a cursor pointer of 

`A110RysJ6aB9YyWsFvipofe7LJ4wA11rUwHiI0VFg4vw83fBiJqjVjcmOkiGkP311Ry5SVqkj97LRiwu85JT74e5xuttviNuT3t_k9_vqrO-e6f3OAwcJO42VeiMYYzYW2mCYQr_Lw==`

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
  searchTransactions(query: "to:0x06012c8cf97BEaD5deAe237070F9587f8E7A266d", sort: DESC, limit: 1,cursor: "bN1XxBvXCvlSTgCcckQWz_e7LJ4wA11rUwHiI0VFg4vw83fBiJqjVjcmOkiGkP311Ry5SVqkj97LRiwu85JT74e5xuttviNuT3t_k9_vqrO-e6f3OAwcJO42VbzaNtvdCm_XYAz9fA==") {
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
{{< row-wrapper-end >}}