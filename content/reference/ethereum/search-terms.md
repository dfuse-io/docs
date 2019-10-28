---
weight: 20
---

# Search Terms for Ethereum

The dfuse Search Query Language resembles the one exposed by Kibana or GitHub for sifting through issues. It is a simple, flat `key1:value1 key2:value2` string, yet allows negation clauses and combinations of `OR` clauses.

dfuse Search indexes each EVM call on the blockchain, as well as each Log, giving unprecedented granularity to your queries.

## Querying EVM Calls

To return all transactions signed by a specific address, use:

`signer:0x59a5208B32e627891C389EbafC644145224006E8`

To get all calls to a given contract (as opposed to delegate calls, or callcodes), run:

`callType:call to:0x5df9b87991262f6ba471f09758cde1c0fc1de734`

To match transactions that provided a given input to a contract, use:

`input.0:00000000000000000000000084ae8708798c74ef8d00f540c4012963955106ff to:0x06012c8cf97bead5deae237070f9587f8e7a266d`

To match any transactions that invoked a given method on a contract:

`method:a9059cbb to:0x8fdcc30eda7e94f1c12ce0280df6cd531e8365c5`

Or you can use an alternate form:

`method:'transfer(address,uint256)'`

To match any EVM call that tweaked storage for a given key in a contract:

`to:0xa327075af2a223a1c83a36ada1126afe7430f955 storageChange:0x3`

You can also use `value` to match the amount of value transferred from a call to another, use `nonce` and `from` to find a specific transaction from a user, and then start mixing and matching.

## Querying Logs

When searching for logs, try the following queries:

`address:dac17f958d2ee523a2206206994597c13d831ec7`

Search by indexed topics or data directly:

`data.0:1eda1ceca1274d6ab9101c30abd6b8b205861286`

Or using `topic.0`:

`topic.0:ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef`

Or a combination of such things, to find transfers relevant to you:

`topic.0:ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef (topic.1:91b356c3e5e0d7cbe261dfa29e11a554b7bc6406 OR topic.2:91b356c3e5e0d7cbe261dfa29e11a554b7bc6406)`

Mix and match with `signer` and a few other fields.
