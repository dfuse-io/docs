---
weight: 1
title: State Transaction Tracker
---

# Ethereum Transaction Lifecycle
## How TransactionLifecycle Works
### Transaction State

An ethereum transaction progresses through a series of states, starting with the unknown state, until it is in block

__Unknown__
A transaction that has not been seen or processed by dfuse trx lifecycle will start in the unknown state

__Pending__
A transaction is in the pending state when it is waiting to be picked and processed by miners. Miners usually select transactions with higher gas prices first, thus lower gas price transaction main remain in the pending state for longer. Transactions with the lowest gas prices may never get picked up, which would result in them getting “stuck” in pending state.

__In Block__
A transaction moves to the in block state when a miner has successfully selected said transaction and mined it within a block. Once in block a transaction may move back to the pending state  if block has been forked

__Shadowed__
A transaction can move to the shadowed state from the pending state when either of these events occurs:

- Another transaction originating from the same sender with the same nonce enters the in block state, or
- Another transaction originating from the same sender with the same nonce with a 12% higher gas price enters the pending state

### State Transitions
The transitions between states also have names.

__Pooled__
A transaction in the unknown state that enters the pool of transactions waiting to be selected by miners is said to be pooled and enters the pending state.

__Mined__
A mined transaction is one that has been processed by a miner within a block. Once mined a transaction is said to be in the in block state. Due to the peer-to-peer  nature of the ethereum network, a transaction can move from the unknown state directly to the in block state without passing through the pending state.  Describe how a transaction goes from shadowed to inblock

__Replaced__
A transaction that moves from the pending state to the shadowed state is said to be replaced.  As described above, this occurs when:

 - Another transaction originating from the same sender with the same nonce enters the in block state
 - A transaction originating from the same sender with the same nonce with a 12% higher gas price enters the pending state

The initial transaction that has been replaced is said to be shadowed by the replacer.

__Forked__
A forked transaction occurs when a mined transaction, in other words a transaction in the in block state, is part of a block that gets reversed by the network. All transactions within the reversed block will subsequently be forked thus moving them from the in block state to the pending.state. 

__Unshadowed__
A transaction can be unshawdowed when the conditions that caused it to be shawdowed are no more.

__Confirmed__
A transaction in the in block state is confirmed every time subsequent, child block gets created. 

## How Transaction Lifecycle Is Used:

With GraphQL you can subscribe to transitions of a specific ethereum transaction in real-time. Furthermore, you have the ability to define precisely the data you want per transition. 

### Subscriptions

Stream all transition for transaction `0x3be3b44ae48a074d3b79e3054bb3b62b5c5e5a8fc2210cd1dc7c7932ae5addcd` in real-time. Do not be scared we will breakdown the query

{{< tabs "issuing-long-jwt">}}
{{< tab title="full-query" lang="graphql" >}}
subscription{
  trackTransactionState(hash: "0x3be3b44ae48a074d3b79e3054bb3b62b5c5e5a8fc2210cd1dc7c7932ae5addcd"){
    previousState
    currentState
    transition{
    	__typename
      ... on Init {
        transaction {
          ...transactionFields
        }
        blockHeader {
          ...bloackHeaderFields
        }
        traces {
          ...transactionTraceFields
        }
        confirmations
        shadowedById
      }
      
      ...on Received {
        transaction {
          ...transactionFields
        }
      }
      
      ...on Mined {
        blockHeader {
          ...bloackHeaderFields
        }
        traces {
          ...transactionFields
        }
        confirmations
      }
      
      ...on Forked {
        transaction {
          ...transactionFields
        }
      }
      
      ...on Confirmed {
        confirmations
      }
      
      ...on Replaced {
        shadowedById
      }
      
    }
  }
}


fragment transactionFields on Transaction {
  hash
  from
  to
  nonce
  gasPrice
  gasLimit
  value
  input
  signature {
    v
    s
    r
  }
}

fragment transactionTraceFields on TransactionTrace {
  hash
  from
  to
  nonce
  gasPrice
  gasLimit
  value
  input
  signature {
    v
    s
    r
  }
  cumulativeGasUsed
	publicKey
	index
	create
  outcome
}


fragment bloackHeaderFields on BlockHeader {
  parentHash
	unclesHash
	coinbase
	stateRoot
	transactionsRoot
	receiptRoot
	logsBloom
	difficulty
	number
	gasLimit
	gasUsed
	timestamp
	extraData
	mixHash
	nonce
	hash
}
{{< /tab >}}


{{< tabs "issuing-long-jwt">}}
{{< tab title="full-query" lang="graphql" >}}
subscription{
  trackTransactionState(hash: "0x3be3b44ae48a074d3b79e3054bb3b62b5c5e5a8fc2210cd1dc7c7932ae5addcd"){
    previousState
    currentState
    transition{
    	__typename
      ... on Init {
        transaction {
          ...transactionFields
        }
        blockHeader {
          ...bloackHeaderFields
        }
        traces {
          ...transactionTraceFields
        }
        confirmations
        shadowedById
      }
      
      ...on Received {
        transaction {
          ...transactionFields
        }
      }
      
      ...on Mined {
        blockHeader {
          ...bloackHeaderFields
        }
        traces {
          ...transactionFields
        }
        confirmations
      }
      
      ...on Forked {
        transaction {
          ...transactionFields
        }
      }
      
      ...on Confirmed {
        confirmations
      }
      
      ...on Replaced {
        shadowedById
      }
      
    }
  }
}


fragment transactionFields on Transaction {
  hash
  from
  to
  nonce
  gasPrice
  gasLimit
  value
  input
  signature {
    v
    s
    r
  }
}

fragment transactionTraceFields on TransactionTrace {
  hash
  from
  to
  nonce
  gasPrice
  gasLimit
  value
  input
  signature {
    v
    s
    r
  }
  cumulativeGasUsed
	publicKey
	index
	create
  outcome
}


fragment bloackHeaderFields on BlockHeader {
  parentHash
	unclesHash
	coinbase
	stateRoot
	transactionsRoot
	receiptRoot
	logsBloom
	difficulty
	number
	gasLimit
	gasUsed
	timestamp
	extraData
	mixHash
	nonce
	hash
}
{{< /tab >}}




