---
title: GraphQL
weight: 3
---

# GraphQL

## Getting Started with GraphQL

The GraphQL API offers significantly more flexibility than the REST API. The ability to define precisely the data you want—and only the data you want—is a powerful advantage over the REST API endpoints. GraphQL lets you replace multiple REST requests with a single call to fetch the data you specify.

The GraphQL API offers two types of requests, Queries and Subscriptions, allowing you to build flexible real-time applications.

You can find the dfuse GraphQL endpoints within the [reference documentation]({{< ref "/reference" >}}) pertaining to the platform relevant to you.

## Queries

Query the block hash that contains a specific transaction:

{{< tabs "graphql-query-request" >}}
{{< tab lang="graphql" title="GraphQL Request" >}}
query {
  transaction(hash: "0x1798aefe0fe6f15abcaed3901474c1bd4303ba0fafe32d232e5121e29d63841e") {
    block {
      hash
    }
  }
}
{{< /tab >}}
{{< /tabs >}}

{{< tabs "graphql-query-response" >}}
{{< tab lang="json" title="JSON Response" >}}
{
  "data": {
    "transaction": {
      "block": {
        "hash": "0x3f59be0a3a65b9eb8f30683d69267eff461fc984ed2ebf9c8c7fda0e0bd8b2d1"
      }
    }
  }
}
{{< /tab >}}
{{< /tabs >}}

The simplest type of call you can make is a GraphQL Query. This is a single network request that will allow you to query the API.

For example, we can use this to find the block hash that contains a specific transaction.

[Try it on GraphiQL](https://mainnet.eth.dfuse.io/graphiql/?query=cXVlcnkgewogIHRyYW5zYWN0aW9uKGhhc2g6ICIweDE3OThhZWZlMGZlNmYxNWFiY2FlZDM5MDE0NzRjMWJkNDMwM2JhMGZhZmUzMmQyMzJlNTEyMWUyOWQ2Mzg0MWUiKSB7CiAgICBibG9jayB7CiAgICAgIGhhc2gKICAgIH0KICB9Cn0=)

## Subscriptions

Stream all transactions to an account, in real-time:

{{< tabs "graphql-subscription-request" >}}
{{< tab lang="graphql" title="GraphQL Request" >}}
subscription {
  searchTransactions(query: "to:0x06012c8cf97BEaD5deAe237070F9587f8E7A266d", lowBlockNum: -1000) {
    node {
      hash
    }
  }
}
{{< /tab >}}
{{< /tabs >}}

{{< tabs "graphql-subscription-response" >}}
{{< tab lang="json" title="JSON Response" >}}
{
  "searchTransactions": {
    "node": {
      "hash": "0xa900fdfe012fba52bb9caf5de290fbc762e6f31f8222b13fa4fa2a58c3ae02a5"
    }
  }
}
{{< /tab >}}
{{< /tabs >}}

A more advanced method is the GraphQL Subscription. This gives you access to a a stream of transactions, essential for all kinds of real-time applications.

For example, we can use this to obtain the hash of all transfers happening on the chain, in real-time.

[Try it on GraphiQL](https://mainnet.eth.dfuse.io/graphiql/?query=c3Vic2NyaXB0aW9uIHsKICBzZWFyY2hUcmFuc2FjdGlvbnMocXVlcnk6ICJ0bzoweDA2MDEyYzhjZjk3QkVhRDVkZUFlMjM3MDcwRjk1ODdmOEU3QTI2NmQiLCBsb3dCbG9ja051bTogLTEwMDApIHsKICAgIG5vZGUgewogICAgICBoYXNoCiAgICB9CiAgfQp9)

## Paginated Queries

Query the most recent transactions to an address with 3 documents per page:

{{< tabs "graphql-paginated-request" >}}
{{< tab lang="graphql" title="GraphQL Request" >}}
query {
  searchTransactions(query: "to:0x06012c8cf97BEaD5deAe237070F9587f8E7A266d", sort: DESC, limit: 3) {
    pageInfo {
      endCursor
    }
    edges {
      node {
        hash
      }
    }
  }
}
{{< /tab >}}
{{< /tabs >}}

{{< tabs "graphql-paginated-response" >}}
{{< tab lang="json" title="JSON Response" >}}
{
  "data": {
    "searchTransactions": {
      "pageInfo": {
        "endCursor": "dlzNRn_o7zfQkFqyJa4g0Pe7LJMwBFpmVAHkLhgVjd_z83fE2p7yBGMkYR3Sw6-m1RzvQl351tvIFC198MBXuNa-lb8yviBtQCkskoHs-bS-evahPgJOJLJlVbiMMdHbUjveZV7_eQ=="
      },
      "edges": [
        {
          "node": {
            "hash": "0x6ac069cd5baeda86c768d7ec3228db15116c9014cce2f8fb73ca476c15726487"
          }
        },
        {
          "node": {
            "hash": "0x9f9cf19b37a25a16253cdce7782db475de9742cefe51f3f33f8f67032b1cf986"
          }
        },
        {
          "node": {
            "hash": "0x1de49b2ea41b71a9e684bd4c8da16d276484aeeb77994e9bb341978f02dc8da3"
          }
        }
      ]
    }
  }
}
{{< /tab >}}
{{< /tabs >}}

The GraphQL API provides cursors to enable pagination. With every response, you can receive a cursor that is a reference to a specific document. By providing this cursor in a subsequent request, the API will pick up where you left off.

Besides pagination, cursors are instrumental when using subscriptions to deal with network disconnections. By using the cursor of your last succesful request, you can reconnect and continue streaming without missing any documents.

[Try it on GraphiQL](https://mainnet.eth.dfuse.io/graphiql/?query=cXVlcnkgewogIHNlYXJjaFRyYW5zYWN0aW9ucyhxdWVyeTogInRvOjB4MDYwMTJjOGNmOTdCRWFENWRlQWUyMzcwNzBGOTU4N2Y4RTdBMjY2ZCIsIHNvcnQ6IERFU0MsIGxpbWl0OiAzKSB7CiAgICBwYWdlSW5mbyB7CiAgICAgIGVuZEN1cnNvcgogICAgfQogICAgZWRnZXMgewogICAgICBub2RlIHsKICAgICAgICBoYXNoCiAgICAgIH0KICAgIH0KICB9Cn0=)

## Navigating Forks

Stream all transactions to an account, keeping an eye on forks:

{{< tabs "graphql-forks-request" >}}
{{< tab lang="graphql" title="GraphQL Request" >}}
subscription {
  searchTransactions(query: "to:0x06012c8cf97BEaD5deAe237070F9587f8E7A266d", lowBlockNum: -1000) {
    undo
    node {
      hash
    }
  }
}
{{< /tab >}}
{{< /tabs >}}

{{< tabs "graphql-forks-response" >}}
{{< tab lang="json" title="JSON Response" >}}
{
  "searchTransactions": {
    "undo": false,
    "node": {
      "hash": "0xaf0c1606c9ae19020989c0be9b613fcd023e0f7906ad463a1e2d12b97d2c7edf"
    }
  }
}
{{< /tab >}}
{{< /tabs >}}

When dealing with documents that were very recently added to a blockchain, there is a risk that the block this document is currently in gets forked out.

When this happens, you can be notified by retrieving the `undo` property of the API. It is your responsibility to ensure that you respond properly to transactions being forked out of the chain.

[Try it on GraphiQL](https://mainnet.eth.dfuse.io/graphiql/?query=c3Vic2NyaXB0aW9uIHsKICBzZWFyY2hUcmFuc2FjdGlvbnMocXVlcnk6ICJ0bzoweDA2MDEyYzhjZjk3QkVhRDVkZUFlMjM3MDcwRjk1ODdmOEU3QTI2NmQiLCBsb3dCbG9ja051bTogLTEwMDApIHsKICAgIHVuZG8KICAgIG5vZGUgewogICAgICBoYXNoCiAgICB9CiAgfQp9)

{{< important >}}
Never forget to retrieve the `undo` property, as streaming results will re-send the matching transactions with `undo:true` upon micro-fork resolution.
{{< /important >}}

## Transports

The _dfuse_ GraphQL endpoints support the following transports:

* `POST` REST calls to `/graphql`, for GraphQL Queries only.

* The [Apollo Subscriptions Transport protocol](https://github.com/apollographql/subscriptions-transport-ws), based on WebSocket

* GraphQL over gRPC (for server-to-server streaming communications):

  * Method: `dfuse.eosio.v1.GraphQL/Execute`

  * The endpoints provide reflection to get the `.proto` schemas

## GraphQL over REST

You can run GraphQL queries by querying the `/graphql` path of _dfuse_ endpoints.

## Apollo Subscription Transport

dfuse GraphQL implements subscriptions using the [Apollo Websocket Transport protocol, version 0.9.16](https://github.com/apollographql/subscriptions-transport-ws/blob/v0.9.16/PROTOCOL.md).

In the browser, you can use the `apollo-client` npm library to connect and read responses. It uses WebSocket for Subscriptions and can also use it for Queries.

{{< tip >}}
See the [Apollo Client Introduction](https://www.apollographql.com/docs/react/) for more details.
{{< /tip >}}

<!-- TODO: Add some links to sample code we have that uses `apollo-client` -->

## GraphQL over gRPC

### Using `grpcurl`

List available gRPC methods with:

{{< highlight shell >}}
grpcurl mainnet.eos.dfuse.io:443 list
{{< /highlight >}}

Stream live search query responses:

{{< highlight shell >}}
echo '{"query": "subscription { searchTransactionsForward(limit: 10, query: \"status:executed\") { cursor undo trace { id matchingActions { receiver account name json } } } }"}' \
  | grpcurl -H "Authorization: Bearer $DFUSE_TOKEN" -d @ \
      mainnet.eos.dfuse.io:443 dfuse.eosio.v1.GraphQL/Execute
{{< /highlight >}}

For a nice output, install `jq` and pipe the previous command into:

{{< highlight shell >}}
jq '.data | fromjson | .data.searchTransactionsForward.trace'
# or
jq -r .data
{{< /highlight >}}

1. [Install grpcurl](https://github.com/fullstorydev/grpcurl), a simple `curl`-like program to communicate via gRPC.
1. Make a GraphQL request, sending along a valid Authorization token.
1. When viewing the output, you can find the GraphQL response wrapped as a string in the gRPC `data` field.

Launch grpcui:

{{< highlight shell >}}
grpcui -port 6000 mainnet.eos.dfuse.io:443
{{< /highlight >}}

### Using `grpcui`

1. [install grpcui](https://github.com/fullstorydev/grpcui).
1. Open [http://localhost:6000](http://localhost:6000) and explore the interface.
1. Add the `authorization` header in the interface, in the format: `Bearer TOKEN` where `TOKEN` is a [valid JWT](#authentication).

{{< note >}}
`grpcui` doesn't handle streaming responses properly; it jams until the subscription is terminated.  To view streaming search results, use `grpcurl` instead. <!-- TODO: There is no anchor that exists. Commented out: ([see above](#graphql-over-grpc-grpcurl)).  -->
{{< /note >}}

## Searching Through GraphQL

The _dfuse Search_ engine exposed through the GraphQL endpoint has a few pecularities that are worthy to note here:

1. The cursor property is chain-wide, and is returned with each result, so you can pick up where you left off at each transaction, and not worry that a block has been partially applied.
2. It navigates forks in a slightly different way than the WebSocket `get_table_rows`. See [Navigating Forks](#navigating-forks).
3. You can do a _backward_ search to get recent transactions up to a limit, and then use the _first_ cursor from those results to do a _forward_ search on the same query, and listen to real-time events happening in real-time, all the while navigating forks. Make sure you keep track of the `undo` property in forward searches.

## API Reference

This section contains subscriptions and queries that can be performed against our GraphQL interface.

The best way to explore the GraphQL schemas, available subscriptions & queries as well as all arguments is to use the dfuse GraphiQL web page we provide for the different endpoints. <!-- TODO: There is no anchor that exists. Commented out: [Endpoints](#endpoints). -->

The GraphQL schema is fully documented and should answer most of your questions
regarding the data it serves. Within GraphiQL, simply place your
cursor somewhere and press `Ctrl+<Space>` to see completion possibilities for current the location.

#### Subscriptions

`searchTransactionsForward`<br>
Search the blockchain forward for transaction execution traces based on the given query.

{{< warning >}}
Always consider the undo field in forward searches, which signal that the matching element was in fact removed from the chain due to a chain reorganization.
{{< /warning >}}

[Try it on GraphiQL](https://mainnet.eos.dfuse.io/graphiql/?query=c3Vic2NyaXB0aW9uIHsKICBzZWFyY2hUcmFuc2FjdGlvbnNGb3J3YXJkKHF1ZXJ5OiAicmVjZWl2ZXI6ZW9zaW8udG9rZW4gYWN0aW9uOnRyYW5zZmVyIikgewogICAgY3Vyc29yCiAgICB0cmFjZSB7CiAgICAgIGlkCiAgICAgIGJsb2NrIHsKICAgICAgICBudW0KICAgICAgICB0aW1lc3RhbXAKICAgICAgfQogICAgICBtYXRjaGluZ0FjdGlvbnMgewogICAgICAgIGFjY291bnQKICAgICAgICBuYW1lCiAgICAgICAgZGF0YQogICAgICB9CiAgICB9CiAgfQp9Cg==)

***

`searchTransactionsBackward`

Search the blockchain backward for transaction execution traces based on the given query.

{{< note >}}
The undo field is not used in a backward search.
{{< /note >}}

[Try it on GraphiQL](https://mainnet.eos.dfuse.io/graphiql/?query=c3Vic2NyaXB0aW9uIHsKICBzZWFyY2hUcmFuc2FjdGlvbnNCYWNrd2FyZChxdWVyeTogInJlY2VpdmVyOmVvc2lvLnRva2VuIGFjdGlvbjp0cmFuc2ZlciIsIGxvd0Jsb2NrTnVtOiAtMzYwKSB7CiAgICBjdXJzb3IKICAgIHRyYWNlIHsKICAgICAgaWQKICAgICAgYmxvY2sgewogICAgICAgIG51bQogICAgICAgIHRpbWVzdGFtcAogICAgICB9CiAgICAgIG1hdGNoaW5nQWN0aW9ucyB7CiAgICAgICAgYWNjb3VudAogICAgICAgIG5hbWUKICAgICAgICBkYXRhCiAgICAgIH0KICAgIH0KICB9Cn0K)

#### Queries

`searchTransactionsForward`

Search the blockchain forward for transaction execution traces based on the given query. When the returned cursor is empty, it means you have reached the end of the specified block range.

{{< warning >}}
Always consider the undo field in forward searches, which signal that the matching element was in fact __REMOVED__ from the chain because of a chain reorganization.
{{< /warning >}}

[Try it on GraphiQL](https://mainnet.eos.dfuse.io/graphiql/?query=cXVlcnkgeyAKICBzZWFyY2hUcmFuc2FjdGlvbnNGb3J3YXJkKHF1ZXJ5OiAicmVjZWl2ZXI6ZW9zaW8udG9rZW4gYWN0aW9uOnRyYW5zZmVyIiwgbG93QmxvY2tOdW06IC0zNjAsIGxpbWl0OiAxMCkgeyAKICAgIHJlc3VsdHMgeyAKICAgICAgY3Vyc29yCiAgICAgIHRyYWNlIHsKICAgICAgICBpZAogICAgICAgIG1hdGNoaW5nQWN0aW9ucyB7IAogICAgICAgICAgYWNjb3VudAogICAgICAgICAgbmFtZQogICAgICAgICAgZGF0YQogICAgICAgIH0KICAgICAgfSAKICAgIH0gCiAgfQp9)

***

`searchTransactionsBackward`

Search the blockchain backward for transaction execution traces based on the given query. When the returned cursor is empty, it means you have reached the end of the specified block range.

[Try it on GraphiQL](https://mainnet.eos.dfuse.io/graphiql/?query=cXVlcnkgeyAKICBzZWFyY2hUcmFuc2FjdGlvbnNCYWNrd2FyZChxdWVyeTogInJlY2VpdmVyOmVvc2lvLnRva2VuIGFjdGlvbjp0cmFuc2ZlciIsIGxpbWl0OiAxMCkgeyAKICAgIHJlc3VsdHMgeyAKICAgICAgY3Vyc29yCiAgICAgIHRyYWNlIHsKICAgICAgICBpZAogICAgICAgIG1hdGNoaW5nQWN0aW9ucyB7IAogICAgICAgICAgYWNjb3VudAogICAgICAgICAgbmFtZQogICAgICAgICAgZGF0YQogICAgICAgIH0KICAgICAgfSAKICAgIH0gCiAgfQp9)

***

`blockIDByTime`

Return the block ID found around the given `time`, based on the comparator provided.

[Try it on GraphiQL Sample](https://mainnet.eos.dfuse.io/graphiql/?query=ewogIGJsb2NrSURCeVRpbWUodGltZTogIjIwMTktMDYtMjRUMDU6MzU6NDVaIiwgY29tcGFyYXRvcjogR1RFKSB7CiAgICBpZAogICAgbnVtCiAgICB0aW1lCiAgfQp9Cg==)

## Sample Queries

To get you started, here are a few sample queries and how to read them.

### Streaming Transactions

The following query (try it on [GraphiQL](https://mainnet.eos.dfuse.io/graphiql/?query=c3Vic2NyaXB0aW9uIHsKICBzZWFyY2hUcmFuc2FjdGlvbnNGb3J3YXJkKAogICAgcXVlcnk6InJlY2VpdmVyOmVvc2lvLnRva2VuIGFjY291bnQ6ZW9zaW8udG9rZW4gYWN0aW9uOnRyYW5zZmVyIiwKICAgIGxvd0Jsb2NrTnVtOjAsCiAgICBsaW1pdDoyMCwKICApIHsKICAgIHVuZG8KICAgIGN1cnNvcgogICAgdHJhY2UgewogICAgICBpZAogICAgICBtYXRjaGluZ0FjdGlvbnMgewogICAgICAgIHJlY2VpdmVyCiAgICAgICAgYWNjb3VudAogICAgICAgIG5hbWUKICAgICAgICBqc29uCiAgICAgICAgY3JlYXRvckFjdGlvbiB7CiAgICAgICAgICByZWNlaXZlcgogICAgICAgICAgYWNjb3VudAogICAgICAgICAgbmFtZQogICAgICAgICAganNvbgogICAgICAgIH0KICAgICAgfQogICAgfQogIH0KfQ==)):

* `subscription` prefix - Issues a GraphQL subscription call (streaming results).
* `query:"receiver:eosio.token account:eosio.token action:transfer"` - The query utilizing the dfuse Search Query Language <!-- TODO: Add a link to a SQE page once figured out --> that you would like responses to match. This query requests responses for `transfer` actions on the `eosio.token` smart contract.
* `lowBlockNum: 0` - Defaults to the HEAD of the chain where it then begins listening for new real-time blocks that match the query.
* `limit:20` - The amount of matched responses that should be accumulated before returning a payload. Once returned, the subscription will be closed.
* `matchingActions` - Retrieve the matching actions. Note there could be many in a single transaction.
* `creatorAction` - For each matching action, we also retrieve the action that caused this transfer, if any.  If a token transfer was initiated by another smart contract, `creatorAction` will be non-null, and will point to the action which caused the creation (see the GraphQL schema for full details). <!-- TODO: Add link to the GraphQL schema -->

{{< tabs "sample-graphql-query" >}}
{{< tab lang="graphql" title="GraphQL Query" >}}
subscription {
  searchTransactionsForward(
    query:"receiver:eosio.token account:eosio.token action:transfer",
    lowBlockNum:0,
    limit:20,
  ) {
    undo
    cursor
    trace {
      id
      matchingActions {
        receiver
        account
        name
        json
        creatorAction {
          receiver
          account
          name
          json
        }
      }
    }
  }
}
{{< /tab >}}

{{< tab lang="json" title="JSON Response" >}}
{
  "searchTransactionsForward": {
    "undo": false,
    "cursor": "BKg1cvtNtiumthn4ayUAcfe7IZI9AlpmUgnvKhJFhYinoSHG2pv1AmQmYRjXlKj120frHl6ri4zPQn8p9pJRvNbixrhm6HRpEC8km4nn_bW5fvrxMA4fJbw3C-CJNN-JXj2DZgivc-A=",
    "trace": {
      "id": "7f7b51d42d9a58f461b7a88415a7cf84cc1e346fc27c022267e01dcf4c437de8",
      "matchingActions": [
        {
          "receiver": "eosio.token",
          "account": "eosio.token",
          "name": "transfer",
          "json": {
            "from": "trustdicewin",
            "to": "antoinewu123",
            "quantity": "0.0005 EOS",
            "memo": "antoinewu123-Faucet from the ...Platform! ..."
          },
          "creatorAction": {
            "receiver": "trustdicewin",
            "account": "trustdicewin",
            "name": "coinbox",
            "json": {
              "memo": "antoinewu123-antoinewu123-EOS-14fb7........."
            }
          }
        }
      ]
    }
  }
}
{{< /tab >}}
{{< /tabs >}}

### Multiple GraphQL queries in one request:

The following query (try it on [GraphiQL](https://mainnet.eos.dfuse.io/graphiql/?query=ewogIHN0YXJ0OiBibG9ja0lEQnlUaW1lKHRpbWU6ICIyMDE5LTAxLTAxVDAwOjAwOjAwWiIpIHsKICAgIHRpbWUKICAgIG51bQogICAgaWQKICB9CiAgZW5kOiBibG9ja0lEQnlUaW1lKHRpbWU6ICIyMDE5LTAyLTAxVDAwOjAwOjAwWiIpIHsKICAgIHRpbWUKICAgIG51bQogICAgaWQKICB9Cn0K)):

* Issues a GraphQL _query_ that retrieves responses for two queries at once
* Each querying the block ID and number less than or equal to the date specified in `time`.
* It remaps the result to `start` and `end` respectively.

{{< tabs "multiple-graphql-queries" >}}
{{< tab lang="graphql" title="GraphQL Request" >}}
{
  start:blockIDByTime(time: "2019-01-01T00:00:00Z") {
    time
    num
    id
  }
  end:blockIDByTime(time: "2019-02-01T00:00:00Z") {
    time
    num
    id
  }
}
{{< /tab >}}

{{< tab lang="json" title="JSON Response" >}}
{
  "data": {
    "start": {
      "time": "2019-01-01T00:00:00Z",
      "num": 35058781,
      "id": "0216f45d4cf4dd026436e270a38d4a6f4b8ff6b66c51169959c7d15cc546c454"
    },
    "end": {
      "time": "2019-02-01T00:00:00Z",
      "num": 40401308,
      "id": "0268799ce334f320485b80dd632db5168c6d894a289b82dc721e029a3a50038c"
    }
  }
}
{{< /tab >}}
{{< /tabs >}}

{{< note >}}
Batched operations are always as slow as the slowest operation in the batch.
{{< /note >}}

<!--

### Simple Go program

[insert Go example]

### Simple Python program

[insert Python example]

### Simple Ruby program

[insert Ruby example]

### Simple PHP program

[insert PHP example]

-->
