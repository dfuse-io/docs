---
weight: 30

pageTitle: Explore Ethereum through dfuse
pageTitleIcon: eth

sideNav: true
sideNavTitle: Public APIs
sideNavLinkRename: Explore Ethereum through dfuse

BookToC: true
#release: stable

aliases:
  - /guides/ethereum/getting-started/explore-eth-through-dfuse/
  - /ethereum/public-apis/getting-started/explore-eth-through-dfuse/

---

## Try our API from your browser

The best way to get a taste of what you can do with dfuse is to try it out! **GraphiQL** is a tool that allows writing and running GraphQL queries from your browser. It is offered on [every dfuse endpoint]({{< ref "/ethereum/public-apis/reference/network-endpoints" >}}) with a valid anonymous JWT for your convenience.
It also offers access to the [documented GraphQL schema](/ethereum/public-apis/reference/graphql-api/) on a side pane, as well as a very useful auto-completion feature (simply place your cursor somewhere and press `Ctrl+<Space>` to see completion possibilities).

[![GraphiQL screenshot](/img/graphiql.png)](https://mainnet.eth.dfuse.io/graphiql)

## Examples

### Fetch

* Get a transaction:
{{< highlight ruby >}}
{
  transaction(hash: "0x1f73b43dc9c48cc131a931fac7095de9e5eba0c5184ec0c5c5f1f32efa2a6bab") {
    from
    to
    gasPrice(encoding: ETHER)
  }
}
{{< / highlight >}}
<div style="text-align: right">
{{< external-link href="https://mainnet.eth.dfuse.io/graphiql/?query=ewogIHRyYW5zYWN0aW9uKGhhc2g6ICIweDFmNzNiNDNkYzljNDhjYzEzMWE5MzFmYWM3MDk1ZGU5ZTVlYmEwYzUxODRlYzBjNWM1ZjFmMzJlZmEyYTZiYWIiKSB7CiAgICBmcm9tCiAgICB0bwogICAgZ2FzVXNlZAogICAgZ2FzUHJpY2UoZW5jb2Rpbmc6IEVUSEVSKQogIH0KfQo=" title="Try it on GraphiQL" class="graphiql" >}}
</div>

* Get a block:
{{< highlight ruby >}}
{
  blockByNumber(number: 7280000) {
    hash
    header { parentHash difficulty }
  }
}
{{< / highlight >}}
<div style="text-align: right">
{{< external-link href="https://mainnet.eth.dfuse.io/graphiql/?query=ewogIGJsb2NrQnlOdW1iZXIobnVtYmVyOiA3MjgwMDAwKSB7CiAgICBoYXNoCiAgICBoZWFkZXIgewogICAgICBwYXJlbnRIYXNoCiAgICAgIGRpZmZpY3VsdHkKICAgIH0KICB9Cn0K" title="Try it on GraphiQL" class="graphiql" >}}
</div>

### Stream

* Stream blocks as they come in (every ~12s)
{{< highlight ruby >}}
subscription{
  blocks(lowBlockNum:-1){
    node{
      number hash
      transactionTraces { edges { node { hash } } }
      uncles { hash }
    }
  }
}
{{< / highlight >}}
<div style="text-align: right">
{{< external-link href="https://mainnet.eth.dfuse.io/graphiql/?query=c3Vic2NyaXB0aW9uIHsKICBibG9ja3MobG93QmxvY2tOdW06IC0xKSB7CiAgICBub2RlIHsKICAgICAgbnVtYmVyCiAgICAgIGhhc2gKICAgICAgdHJhbnNhY3Rpb25UcmFjZXMgewogICAgICAgIGVkZ2VzIHsKICAgICAgICAgIG5vZGUgewogICAgICAgICAgICBoYXNoCiAgICAgICAgICB9CiAgICAgICAgfQogICAgICB9CiAgICAgIHVuY2xlcyB7CiAgICAgICAgaGFzaAogICAgICB9CiAgICB9CiAgfQp9Cg==" title="Try it on GraphiQL" class="graphiql" >}}
</div>

* Stream transactions based on a **search query**
{{< highlight ruby >}}
   subscription {
     searchTransactions(indexName: CALLS, query: "-value:0", lowBlockNum: -1) {
        undo cursor
        node {
          block { number }
          matchingCalls { from to value(encoding: ETHER) }
        }
      }
    }
{{< / highlight >}}
<div style="text-align: right">
{{< external-link href="https://mainnet.eth.dfuse.io/graphiql/?query=c3Vic2NyaXB0aW9uIHsKICAgICBzZWFyY2hUcmFuc2FjdGlvbnMoaW5kZXhOYW1lOiBDQUxMUywgcXVlcnk6ICItdmFsdWU6MCIsIGxvd0Jsb2NrTnVtOiAtMSkgewogICAgICAgIHVuZG8gY3Vyc29yCiAgICAgICAgbm9kZSB7CiAgICAgICAgICBibG9jayB7IG51bWJlciB9CiAgICAgICAgICBtYXRjaGluZ0NhbGxzIHsgZnJvbSB0byB2YWx1ZShlbmNvZGluZzogRVRIRVIpIH0KICAgICAgICB9CiAgICAgIH0KICAgIH0=" title="Try it on GraphiQL" class="graphiql" >}}
</div>

### Search

Search queries (either streaming through a GraphQL subscription or paginated through a GraphQL query) are constructed using [dfuse Search Query Language](/platform/public-apis/search-query-language).
See the [Ethereum Search Terms Reference]({{< ref "/ethereum/public-apis/reference/search/terms" >}}) for a complete list of accepted terms.

You can try those search queries directly in the {{< external-link href="https://ethq.app" title="https://ethq.app">}} search bar, or in the "query" parameter of the searchTransaction method in GraphiQL.

dfuse offers two distinct indexes to match transactions: **CALLS** and **LOGS**

* To search for transactions which contain an ETHER transfer (non-zero) from or to a specific address

{{< highlight ruby >}}
# with indexName = CALLS
-value:0 (to:0x32be343b94f860124dc4fee278fdcbd38c102d88 OR
          from:0x32be343b94f860124dc4fee278fdcbd38c102d88)
{{< / highlight >}}
<div style="text-align: right">
{{< external-link href="https://mainnet.eth.dfuse.io/graphiql/?query=ewogIHNlYXJjaFRyYW5zYWN0aW9ucyhpbmRleE5hbWU6IENBTExTLCBxdWVyeTogIih0bzoweDMyYmUzNDNiOTRmODYwMTI0ZGM0ZmVlMjc4ZmRjYmQzOGMxMDJkODggT1IgZnJvbToweDMyYmUzNDNiOTRmODYwMTI0ZGM0ZmVlMjc4ZmRjYmQzOGMxMDJkODgpIC12YWx1ZTowIiwgbG93QmxvY2tOdW06IDAsIGhpZ2hCbG9ja051bTogLTEsIGxpbWl0OiA1LCBzb3J0OiBERVNDKSB7CiAgICBlZGdlcyB7CiAgICAgIG5vZGUgewogICAgICAgIHZhbHVlKGVuY29kaW5nOiBFVEhFUikKICAgICAgICBoYXNoCiAgICAgICAgbm9uY2UKICAgICAgICBnYXNMaW1pdAogICAgICAgIGdhc1ByaWNlCiAgICAgICAgdG8KICAgICAgICBibG9jayB7CiAgICAgICAgICBudW1iZXIKICAgICAgICAgIGhhc2gKICAgICAgICAgIGhlYWRlciB7CiAgICAgICAgICAgIHRpbWVzdGFtcAogICAgICAgICAgfQogICAgICAgIH0KICAgICAgICBtYXRjaGluZ0NhbGxzIHsKICAgICAgICAgIGluZGV4CiAgICAgICAgICBwYXJlbnRJbmRleAogICAgICAgICAgY2FsbFR5cGUKICAgICAgICAgIGZyb20KICAgICAgICAgIHRvCiAgICAgICAgICB2YWx1ZShlbmNvZGluZzogRVRIRVIpCiAgICAgICAgICBnYXNDb25zdW1lZAogICAgICAgICAgcmV0dXJuRGF0YQogICAgICAgICAgbG9ncyB7CiAgICAgICAgICAgIGFkZHJlc3MKICAgICAgICAgICAgdG9waWNzCiAgICAgICAgICAgIGRhdGEKICAgICAgICAgIH0KICAgICAgICAgIGJhbGFuY2VDaGFuZ2VzIHsKICAgICAgICAgICAgYWRkcmVzcwogICAgICAgICAgICBvbGRWYWx1ZShlbmNvZGluZzogRVRIRVIpCiAgICAgICAgICAgIG5ld1ZhbHVlCiAgICAgICAgICAgIHJlYXNvbgogICAgICAgICAgfQogICAgICAgIH0KICAgICAgfQogICAgfQogIH0KfQo=" title="Try it on GraphiQL" class="graphiql" >}}
{{< external-link href="https://ethq.app/search?q=-value%3A0%20%28to%3A0x32be343b94f860124dc4fee278fdcbd38c102d88%20OR%20from%3A0x32be343b94f860124dc4fee278fdcbd38c102d88%29" title="Try it on ETHQ" class="ethq" >}}
</div>

* To search for transactions which contain a `transfer(address, uint256)` method on a known ERC-20 token contract (the actual value transferred has to be decoded from the `data` in the logs)

{{< highlight ruby >}}
# with indexName = CALLS
method:'transfer(address,uint256)' to:0xdac17f958d2ee523a2206206994597c13d831ec7
{{< / highlight >}}
<div style="text-align: right">
{{< external-link href="https://mainnet.eth.dfuse.io/graphiql/?query=c3Vic2NyaXB0aW9uIHsKICBzZWFyY2hUcmFuc2FjdGlvbnMoaW5kZXhOYW1lOiBDQUxMUywgcXVlcnk6ICIodG86MHgzMmJlMzQzYjk0Zjg2MDEyNGRjNGZlZTI3OGZkY2JkMzhjMTAyZDg4IE9SIGZyb206MHgzMmJlMzQzYjk0Zjg2MDEyNGRjNGZlZTI3OGZkY2JkMzhjMTAyZDg4KSAtdmFsdWU6MCIsIGxvd0Jsb2NrTnVtOiAtNSwgaGlnaEJsb2NrTnVtOiAtMSwgc29ydDogQVNDKSB7CiAgICBjdXJzb3IKICAgIHVuZG8KICAgIG5vZGUgewogICAgICB2YWx1ZShlbmNvZGluZzogRVRIRVIpCiAgICAgIGhhc2gKICAgICAgbm9uY2UKICAgICAgZ2FzTGltaXQKICAgICAgZ2FzUHJpY2UKICAgICAgdG8KICAgICAgYmxvY2sgewogICAgICAgIG51bWJlcgogICAgICAgIGhhc2gKICAgICAgICBoZWFkZXIgewogICAgICAgICAgdGltZXN0YW1wCiAgICAgICAgfQogICAgICB9CiAgICAgIG1hdGNoaW5nQ2FsbHMgewogICAgICAgIGluZGV4CiAgICAgICAgcGFyZW50SW5kZXgKICAgICAgICBjYWxsVHlwZQogICAgICAgIGZyb20KICAgICAgICB0bwogICAgICAgIHZhbHVlKGVuY29kaW5nOiBFVEhFUikKICAgICAgICBnYXNDb25zdW1lZAogICAgICAgIHJldHVybkRhdGEKICAgICAgICBsb2dzIHsKICAgICAgICAgIGFkZHJlc3MKICAgICAgICAgIHRvcGljcwogICAgICAgICAgZGF0YQogICAgICAgIH0KICAgICAgICBiYWxhbmNlQ2hhbmdlcyB7CiAgICAgICAgICBhZGRyZXNzCiAgICAgICAgICBvbGRWYWx1ZShlbmNvZGluZzogRVRIRVIpCiAgICAgICAgICBuZXdWYWx1ZQogICAgICAgICAgcmVhc29uCiAgICAgICAgfQogICAgICB9CiAgICB9CiAgfQp9Cg==" title="Try it on GraphiQL" class="graphiql" >}}
{{< external-link href="https://ethq.app/search?q=method%3A%27transfer%28address%2Cuint256%29%27%20to%3A0xdac17f958d2ee523a2206206994597c13d831ec7&ts=1573141723074" title="Try it on ETHQ" class="ethq" >}}
</div>

{{< alert type="note" >}} The method can also be specified with the 8-bytes prefix of its keccak hash, ex: `method:a9059cbb` {{< /alert >}}


* To search for transactions signed by a specific address, use:

{{< highlight ruby >}}
# with indexName = CALLS
signer:0x59a5208B32e627891C389EbafC644145224006E8
{{< / highlight >}}
<div style="text-align: right">
{{< external-link href="https://mainnet.eth.dfuse.io/graphiql/?query=c3Vic2NyaXB0aW9uIHsKICBzZWFyY2hUcmFuc2FjdGlvbnMoaW5kZXhOYW1lOiBDQUxMUywgcXVlcnk6ICJzaWduZXI6MHg1OWE1MjA4QjMyZTYyNzg5MUMzODlFYmFmQzY0NDE0NTIyNDAwNkU4IiwgbG93QmxvY2tOdW06IDAsIGhpZ2hCbG9ja051bTogLTEsIGxpbWl0OiAxMCwgc29ydDogREVTQykgewogICAgY3Vyc29yCiAgICB1bmRvCiAgICBub2RlIHsKICAgICAgdmFsdWUoZW5jb2Rpbmc6IEVUSEVSKQogICAgICBoYXNoCiAgICAgIG5vbmNlCiAgICAgIGdhc0xpbWl0CiAgICAgIGdhc1ByaWNlCiAgICAgIHRvCiAgICAgIGJsb2NrIHsKICAgICAgICBudW1iZXIKICAgICAgICBoYXNoCiAgICAgICAgaGVhZGVyIHsKICAgICAgICAgIHRpbWVzdGFtcAogICAgICAgIH0KICAgICAgfQogICAgICBmbGF0Q2FsbHMgewogICAgICAgIGluZGV4CiAgICAgICAgcGFyZW50SW5kZXgKICAgICAgICBjYWxsVHlwZQogICAgICAgIGZyb20KICAgICAgICB0bwogICAgICAgIHZhbHVlCiAgICAgICAgZ2FzQ29uc3VtZWQKICAgICAgICByZXR1cm5EYXRhCiAgICAgICAgbG9ncyB7CiAgICAgICAgICBhZGRyZXNzCiAgICAgICAgICB0b3BpY3MKICAgICAgICAgIGRhdGEKICAgICAgICB9CiAgICAgICAgYmFsYW5jZUNoYW5nZXMgewogICAgICAgICAgYWRkcmVzcwogICAgICAgICAgb2xkVmFsdWUoZW5jb2Rpbmc6RVRIRVIpCiAgICAgICAgICBuZXdWYWx1ZQogICAgICAgIH0KICAgICAgICBzdG9yYWdlQ2hhbmdlcyB7CiAgICAgICAgICBrZXkKICAgICAgICAgIGFkZHJlc3MKICAgICAgICAgIG9sZFZhbHVlCiAgICAgICAgICBuZXdWYWx1ZQogICAgICAgIH0KICAgICAgfQogICAgfQogIH0KfQo=" title="Try it on GraphiQL" class="graphiql" >}}
{{< external-link href="https://ethq.app/search?q=signer%3A0x59a5208B32e627891C389EbafC644145224006E8" title="Try it on ETHQ" class="ethq" >}}
</div>

* To search for transactions that provided a given input to a contract, use:

{{< highlight ruby >}}
# with indexName = CALLS
input.0:0x84ae8708798c74ef8d00f540c4012963955106ff to:0x06012c8cf97bead5deae237070f9587f8e7a266d
{{< / highlight >}}
<div style="text-align: right">
{{< external-link href="https://mainnet.eth.dfuse.io/graphiql/?query=c3Vic2NyaXB0aW9uIHsKICBzZWFyY2hUcmFuc2FjdGlvbnMoaW5kZXhOYW1lOiBDQUxMUywgcXVlcnk6ICJpbnB1dC4wOjB4ODRhZTg3MDg3OThjNzRlZjhkMDBmNTQwYzQwMTI5NjM5NTUxMDZmZiB0bzoweDA2MDEyYzhjZjk3YmVhZDVkZWFlMjM3MDcwZjk1ODdmOGU3YTI2NmQiLCBsb3dCbG9ja051bTogMCwgaGlnaEJsb2NrTnVtOiAtMSwgc29ydDogREVTQywgbGltaXQ6IDEpIHsKICAgIGN1cnNvcgogICAgdW5kbwogICAgbm9kZSB7CiAgICAgIGhhc2gKICAgICAgbm9uY2UKICAgICAgZ2FzTGltaXQKICAgICAgZ2FzUHJpY2UKICAgICAgdG8KICAgICAgYmxvY2sgewogICAgICAgIG51bWJlcgogICAgICAgIGhhc2gKICAgICAgICBoZWFkZXIgewogICAgICAgICAgdGltZXN0YW1wCiAgICAgICAgfQogICAgICB9CiAgICAgIG1hdGNoaW5nQ2FsbHMgewogICAgICAgIGluZGV4CiAgICAgICAgcGFyZW50SW5kZXgKICAgICAgICBjYWxsVHlwZQogICAgICAgIGZyb20KICAgICAgICB0bwogICAgICAgIHZhbHVlKGVuY29kaW5nOiBFVEhFUikKICAgICAgICBzdG9yYWdlQ2hhbmdlcyB7CiAgICAgICAgICBrZXkKICAgICAgICAgIGFkZHJlc3MKICAgICAgICAgIG9sZFZhbHVlCiAgICAgICAgICBuZXdWYWx1ZQogICAgICAgIH0KICAgICAgfQogICAgfQogIH0KfQo=" title="Try it on GraphiQL" class="graphiql" >}}
{{< external-link href="https://ethq.app/search?q=input.0%3A0x84ae8708798c74ef8d00f540c4012963955106ff%20to%3A0x06012c8cf97bead5deae237070f9587f8e7a266d" title="Try it on ETHQ" class="ethq" >}}
</div>

* To search for transactions with an EVM call that tweaked storage for a given key in a contract (that's very specific!):

{{< highlight ruby >}}
# with indexName = CALLS
to:0xa327075af2a223a1c83a36ada1126afe7430f955 storageChange:0x3
{{< / highlight >}}
<div style="text-align: right">
{{< external-link href="https://mainnet.eth.dfuse.io/graphiql/?query=c3Vic2NyaXB0aW9uIHsKICBzZWFyY2hUcmFuc2FjdGlvbnMoaW5kZXhOYW1lOiBDQUxMUywgcXVlcnk6ICJ0bzoweGEzMjcwNzVhZjJhMjIzYTFjODNhMzZhZGExMTI2YWZlNzQzMGY5NTUgc3RvcmFnZUNoYW5nZToweDMiLCBsb3dCbG9ja051bTogMCwgaGlnaEJsb2NrTnVtOiAtMSwgc29ydDogQVNDLCBsaW1pdDogMSkgewogICAgY3Vyc29yCiAgICB1bmRvCiAgICBub2RlIHsKICAgICAgaGFzaAogICAgICBub25jZQogICAgICBnYXNMaW1pdAogICAgICBnYXNQcmljZQogICAgICB0bwogICAgICBibG9jayB7CiAgICAgICAgbnVtYmVyCiAgICAgICAgaGFzaAogICAgICAgIGhlYWRlciB7CiAgICAgICAgICB0aW1lc3RhbXAKICAgICAgICB9CiAgICAgIH0KICAgICAgbWF0Y2hpbmdDYWxscyB7CiAgICAgICAgaW5kZXgKICAgICAgICBwYXJlbnRJbmRleAogICAgICAgIGNhbGxUeXBlCiAgICAgICAgZnJvbQogICAgICAgIHRvCiAgICAgICAgdmFsdWUoZW5jb2Rpbmc6IEVUSEVSKQogICAgICAgIHN0b3JhZ2VDaGFuZ2VzIHsKICAgICAgICAgIGtleQogICAgICAgICAgYWRkcmVzcwogICAgICAgICAgb2xkVmFsdWUKICAgICAgICAgIG5ld1ZhbHVlCiAgICAgICAgfQogICAgICB9CiAgICB9CiAgfQp9Cg==" title="Try it on GraphiQL" class="graphiql" >}}
</div>

* To search for transactions that match a specific topic in the **logs** of an EVM call

{{< highlight ruby >}}
# with indexName = LOGS
topic.0:0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef
{{< / highlight >}}
<div style="text-align: right">
{{< external-link href="https://mainnet.eth.dfuse.io/graphiql/?query=c3Vic2NyaXB0aW9uIHsKICBzZWFyY2hUcmFuc2FjdGlvbnMoaW5kZXhOYW1lOiBMT0dTLCBxdWVyeTogInRvcGljLjA6MHhkZGYyNTJhZDFiZTJjODliNjljMmIwNjhmYzM3OGRhYTk1MmJhN2YxNjNjNGExMTYyOGY1NWE0ZGY1MjNiM2VmIiwgbG93QmxvY2tOdW06IDAsIGhpZ2hCbG9ja051bTogLTEsIHNvcnQ6IERFU0MsIGxpbWl0OiAxKSB7CiAgICBjdXJzb3IKICAgIHVuZG8KICAgIG5vZGUgewogICAgICBoYXNoCiAgICAgIG5vbmNlCiAgICAgIGdhc0xpbWl0CiAgICAgIGdhc1ByaWNlCiAgICAgIHRvCiAgICAgIGJsb2NrIHsKICAgICAgICBudW1iZXIKICAgICAgICBoYXNoCiAgICAgICAgaGVhZGVyIHsKICAgICAgICAgIHRpbWVzdGFtcAogICAgICAgIH0KICAgICAgfQogICAgICBtYXRjaGluZ0xvZ3MgewogICAgICAgIGFkZHJlc3MKICAgICAgICB0b3BpY3MKICAgICAgICBkYXRhCiAgICAgICAgYmxvY2tJbmRleAogICAgICAgIHRyYW5zYWN0aW9uSW5kZXgKICAgICAgfQogICAgfQogIH0KfQo=" title="Try it on GraphiQL" class="graphiql" >}}
</div>

* To search for transactions that match a specific data chunk (32-bytes) in the **logs** of an EVM call (that's very specific!):

{{< highlight ruby >}}
# with indexName = LOGS
data.0:0x0000000000000000000000004a220e6096b25eadb88358cb44068a3248254675
{{< / highlight >}}
<div style="text-align: right">
{{< external-link href="https://mainnet.eth.dfuse.io/graphiql/?query=c3Vic2NyaXB0aW9uIHsKICBzZWFyY2hUcmFuc2FjdGlvbnMoaW5kZXhOYW1lOiBMT0dTLCBxdWVyeTogImRhdGEuMDoweDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDRhMjIwZTYwOTZiMjVlYWRiODgzNThjYjQ0MDY4YTMyNDgyNTQ2NzUiLCBsb3dCbG9ja051bTogMCwgaGlnaEJsb2NrTnVtOiAtMSwgc29ydDogREVTQywgbGltaXQ6IDEpIHsKICAgIGN1cnNvcgogICAgdW5kbwogICAgbm9kZSB7CiAgICAgIGhhc2gKICAgICAgbm9uY2UKICAgICAgZ2FzTGltaXQKICAgICAgZ2FzUHJpY2UKICAgICAgdG8KICAgICAgYmxvY2sgewogICAgICAgIG51bWJlcgogICAgICAgIGhhc2gKICAgICAgICBoZWFkZXIgewogICAgICAgICAgdGltZXN0YW1wCiAgICAgICAgfQogICAgICB9CiAgICAgIG1hdGNoaW5nTG9ncyB7CiAgICAgICAgYWRkcmVzcwogICAgICAgIHRvcGljcwogICAgICAgIGRhdGEKICAgICAgICBibG9ja0luZGV4CiAgICAgICAgdHJhbnNhY3Rpb25JbmRleAogICAgICB9CiAgICB9CiAgfQp9Cg==s" title="Try it on GraphiQL" class="graphiql" >}}
</div>


## Learn more

* [dfuse Platform: GraphQL Semantics](/platform/public-apis/graphql)
* [dfuse Platform: Search Query Language](/platform/public-apis/search-query-language)
* [Reference: Ethereum GraphQL API](/ethereum/public-apis/reference/graphql-api)
* [Reference: Ethereum Search Terms]({{< ref "/ethereum/public-apis/reference/search/terms" >}})
