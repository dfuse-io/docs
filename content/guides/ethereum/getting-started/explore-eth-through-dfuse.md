---
weight: 5
title: Explore ETH through dfuse
---

## Try our API from your browser

The best way to get a taste of what you can do with dfuse is to try it out!

**GraphiQL** is a tool that allows writing and running graphQL queries from your browser. It is offered on [every dfuse endpoint](/reference/ethereum/endpoints/) with a valid anonymous JWT for convenience.
It also offers an access to the [documented GraphQL schema](/reference/ethereum/graphql/) on a side pane, as well as a very useful auto-completion feature (simply place your cursor somewhere and press `Ctrl+<Space>` to see completion possibilities.)

[![GraphiQL screenshot](/img/graphiql.png)](https://mainnet.eth.dfuse.io/graphiql)

## Examples

### Fetch

* Get a transaction:
{{< highlight ruby >}}
{
  transaction(hash: "0x1f73b43dc9c48cc131a931fac7095de9e5eba0c5184ec0c5c5f1f32efa2a6bab") {
    from
    to
    gasUsed gasPrice(encoding: ETHER)
  }
}
{{< / highlight >}}
{{<externalLink href="https://mainnet.eth.dfuse.io/graphiql/?query=ewogIHRyYW5zYWN0aW9uKGhhc2g6ICIweDFmNzNiNDNkYzljNDhjYzEzMWE5MzFmYWM3MDk1ZGU5ZTVlYmEwYzUxODRlYzBjNWM1ZjFmMzJlZmEyYTZiYWIiKSB7CiAgICBmcm9tCiAgICB0bwogICAgZ2FzVXNlZAogICAgZ2FzUHJpY2UoZW5jb2Rpbmc6IEVUSEVSKQogIH0KfQo=" title="Try it on GraphiQL" class="graphiql" >}}

* Get a block:
{{< highlight ruby >}}
{
  blockByNumber(number: 7280000) {
    hash
    header { parentHash difficulty }
  }
}
{{< / highlight >}}
{{<externalLink href="https://mainnet.eth.dfuse.io/graphiql/?query=ewogIGJsb2NrQnlOdW1iZXIobnVtYmVyOiA3MjgwMDAwKSB7CiAgICBoYXNoCiAgICBoZWFkZXIgewogICAgICBwYXJlbnRIYXNoCiAgICAgIGRpZmZpY3VsdHkKICAgIH0KICB9Cn0K" title="Try it on GraphiQL" class="graphiql" >}}

### Stream

* Stream blocks as they come in (every ~12s)
{{< highlight ruby >}}
subscription{
  blocks(lowBlockNum:-1){
    node{
      number hash
      transactionTraces{ edges{ node{ hash } } }
      uncles{ hash }
    }
  }
}
{{< / highlight >}}
{{<externalLink href="https://mainnet.eth.dfuse.io/graphiql/?query=c3Vic2NyaXB0aW9uIHsKICBibG9ja3MobG93QmxvY2tOdW06IC0xKSB7CiAgICBub2RlIHsKICAgICAgbnVtYmVyCiAgICAgIGhhc2gKICAgICAgdHJhbnNhY3Rpb25UcmFjZXMgewogICAgICAgIGVkZ2VzIHsKICAgICAgICAgIG5vZGUgewogICAgICAgICAgICBoYXNoCiAgICAgICAgICB9CiAgICAgICAgfQogICAgICB9CiAgICAgIHVuY2xlcyB7CiAgICAgICAgaGFzaAogICAgICB9CiAgICB9CiAgfQp9Cg==" title="Try it on GraphiQL" class="graphiql" >}}

* Stream transactions based on a **search query**
{{< highlight ruby >}}
 subscription {
    searchTransactions( indexName: call, lowBlockNum: 8500000, limit:100,
                        query: "method:'transfer(address,uint256)' -value:0") {
      undo cursor
      node {
        block{ number }
        matchingCalls { from to value(encoding: ETHER) }
      }
    }
  }
{{< / highlight >}}
{{<externalLink href="https://mainnet.eth.dfuse.io/graphiql/?query=c3Vic2NyaXB0aW9uIHsKICBzZWFyY2hUcmFuc2FjdGlvbnMoaW5kZXhOYW1lOiBjYWxsLCBsb3dCbG9ja051bTogODUwMDAwMCwgbGltaXQ6IDEwMCwgcXVlcnk6ICJtZXRob2Q6J3RyYW5zZmVyKGFkZHJlc3MsdWludDI1NiknIC12YWx1ZTowIikgewogICAgdW5kbwogICAgY3Vyc29yCiAgICBub2RlIHsKICAgICAgYmxvY2sgewogICAgICAgIG51bWJlcgogICAgICB9CiAgICAgIG1hdGNoaW5nQ2FsbHMgewogICAgICAgIGZyb20KICAgICAgICB0bwogICAgICAgIHZhbHVlKGVuY29kaW5nOiBFVEhFUikKICAgICAgfQogICAgfQogIH0KfQo=" title="Try it on GraphiQL" class="graphiql" >}}

### Search

Search queries (either streaming through a GraphQL subscription or paginated through a GraphQL query) are constructed using [dfuse Search Query Language](/guides/core-concepts/search-query-language).
See the [Ethereum Search Terms Reference](/reference/ethereum/search-terms) for a complete list of accepted terms.

You can try those search queries directly in the {{<externalLink href="https://ethq.app" title="https://ethq.app">}} search bar, or in the "query" parameter of the searchTransaction method in GraphiQL.

* To return all transactions signed by a specific address, use:

{{< highlight ruby >}}
signer:0x59a5208B32e627891C389EbafC644145224006E8
{{< / highlight >}}
<div style="text-align: right">
{{<externalLink href="https://mainnet.eth.dfuse.io/graphiql/?query=c3Vic2NyaXB0aW9uIHsKICBzZWFyY2hUcmFuc2FjdGlvbnMocXVlcnk6ICJzaWduZXI6MHg1OWE1MjA4QjMyZTYyNzg5MUMzODlFYmFmQzY0NDE0NTIyNDAwNkU4IiwgbG93QmxvY2tOdW06IDAsIGhpZ2hCbG9ja051bTogLTEsIGxpbWl0OiAxMCwgc29ydDogREVTQykgewogICAgY3Vyc29yCiAgICB1bmRvCiAgICBub2RlIHsKICAgICAgdmFsdWUoZW5jb2Rpbmc6IERFQ0lNQUwpCiAgICAgIGhhc2gKICAgICAgbm9uY2UKICAgICAgZ2FzTGltaXQKICAgICAgZ2FzUHJpY2UKICAgICAgdG8KICAgICAgYmxvY2sgewogICAgICAgIG51bWJlcgogICAgICAgIGhhc2gKICAgICAgICBzaXplCiAgICAgICAgaGVhZGVyIHsKICAgICAgICAgIHRpbWVzdGFtcAogICAgICAgIH0KICAgICAgfQogICAgICBmbGF0Q2FsbHMgewogICAgICAgIGluZGV4CiAgICAgICAgcGFyZW50SW5kZXgKICAgICAgICBjYWxsVHlwZQogICAgICAgIGNhbGxlcgogICAgICAgIGFkZHJlc3MKICAgICAgICB2YWx1ZQogICAgICAgIGdhc0NvbnN1bWVkCiAgICAgICAgZ2FzQmlsbGVkCiAgICAgICAgcmV0dXJuRGF0YQogICAgICAgIGxvZ3MgewogICAgICAgICAgYWRkcmVzcwogICAgICAgICAgdG9waWNzCiAgICAgICAgICBkYXRhCiAgICAgICAgfQogICAgICAgIGJhbGFuY2VDaGFuZ2VzIHsKICAgICAgICAgIGFkZHJlc3MKICAgICAgICAgIG9sZFZhbHVlKGVuY29kaW5nOiBERUNJTUFMKQogICAgICAgICAgbmV3VmFsdWUKICAgICAgICB9CiAgICAgICAgc3RvcmFnZUNoYW5nZXMgewogICAgICAgICAga2V5CiAgICAgICAgICBhZGRyZXNzCiAgICAgICAgICBvbGRWYWx1ZQogICAgICAgICAgbmV3VmFsdWUKICAgICAgICB9CiAgICAgIH0KICAgIH0KICB9Cn0K" title="Try it on GraphiQL" class="graphiql" >}}
{{<externalLink href="https://ethq.app/search?q=signer%3A0x59a5208B32e627891C389EbafC644145224006E8" title="Try it on ETHQ" class="ethq" >}}
</div>

* To get all calls to a given contract (as opposed to delegate calls, or callcodes), run:

{{< highlight ruby >}}
callType:call to:0x5df9b87991262f6ba471f09758cde1c0fc1de734
{{< / highlight >}}
<div style="text-align: right">
{{<externalLink href="https://ethq.app/search?q=callType%3Acall%20to%3A0x5df9b87991262f6ba471f09758cde1c0fc1de734" title="Try it on ETHQ" class="ethq" >}}
</div>

* To match transactions that provided a given input to a contract, use:

{{< highlight ruby >}}
input.0:0x84ae8708798c74ef8d00f540c4012963955106ff to:0x06012c8cf97bead5deae237070f9587f8e7a266d
{{< / highlight >}}
<div style="text-align: right">
{{<externalLink href="https://ethq.app/search?q=input.0%3A0x84ae8708798c74ef8d00f540c4012963955106ff%20to%3A0x06012c8cf97bead5deae237070f9587f8e7a266d" title="Try it on ETHQ" class="ethq" >}}
</div>

* To match any transactions that invoked a given method on a contract:

{{< highlight ruby >}}
method:'transfer(address,uint256)' to:0x8fdcc30eda7e94f1c12ce0280df6cd531e8365c5
{{< / highlight >}}
<div style="text-align: right">
{{<externalLink href="https://ethq.app/search?q=method%3A'transfer(address%2Cuint256)'%20to%3A0x8fdcc30eda7e94f1c12ce0280df6cd531e8365c5" title="Try it on ETHQ" class="ethq" >}}
</div>

Or alternatively specifying the method signature with the 8-bytes prefix of the keccak hash:

{{< highlight ruby >}}
method:a9059cbb to:0x8fdcc30eda7e94f1c12ce0280df6cd531e8365c5
{{< / highlight >}}

* To match any EVM call that tweaked storage for a given key in a contract:

{{< highlight ruby >}}
to:0xa327075af2a223a1c83a36ada1126afe7430f955 storageChange:0x3
{{< / highlight >}}
<div style="text-align: right">
{{<externalLink href="https://ethq.app/search?q=to%3A0xa327075af2a223a1c83a36ada1126afe7430f955%20storageChange%3A0x3" title="Try it on ETHQ" class="ethq" >}}
</div>

* You can also use `value` to match the amount of ETH transferred from an address to another (negating 0 is a useful pattern), along with `from` or `to` to find a specific transaction from/to a user, and then start mixing and matching.

{{< highlight ruby >}}
method:'transfer(address,uint256)' (to:0xa327075af2a223a1c83a36ada1126afe7430f955 OR from:0xa327075af2a223a1c83a36ada1126afe7430f955) -value:0
{{< / highlight >}}

## Learn more

* [Concepts: GraphQL](/guides/core-concepts/graphql)
* [Concepts: Search Query Language](/guides/core-concepts/search-query-language)
* [Reference: Ethereum GraphQL schema](/reference/ethereum/graphql/)
* [Reference: Ethereum Search Terms](/reference/ethereum/search-terms)
