---
weight: 1
title: Transaction Lifecycle
---

{{< row-wrapper >}}

{{< sub-section-title title="Ethereum Transaction Lifecycle" awesome-icon="far fa-book-spells" icon-link="/img/icon-crypto-currency-ethereum-01.svg" >}}

## How Transaction Lifecycle Works
### Transaction State

An ethereum transaction progresses through a series of states, starting with the unknown state, until it is in block

__Unknown__: A transaction that has not been seen or processed by dfuse trx lifecycle will start in the unknown state

__Pending__: A transaction is in the pending state when it is waiting to be picked and processed by miners. Miners usually select transactions with higher gas prices first, thus lower gas price transaction main remain in the pending state for longer. Transactions with the lowest gas prices may never get picked up, which would result in them getting “stuck” in pending state.

__In Block__
A transaction moves to the in block state when a miner has successfully selected said transaction and mined it within a block. Once in block a transaction may move back to the pending state  if block has been forked

__Shadowed__: A transaction can move to the shadowed state from the pending state when either of these events occurs:

- Another transaction originating from the same sender with the same nonce enters the in block state, or
- Another transaction originating from the same sender with the same nonce with a 12% higher gas price enters the pending state

### State Transitions
The transitions between states also have names.

__Pooled__: A transaction in the unknown state that enters the pool of transactions waiting to be selected by miners is said to be pooled and enters the pending state.

__Mined__: A mined transaction is one that has been processed by a miner within a block. Once mined a transaction is said to be in the in block state. Due to the peer-to-peer  nature of the ethereum network, a transaction can move from the unknown state directly to the in block state without passing through the pending state.  Describe how a transaction goes from shadowed to inblock

__Replaced__: A transaction that moves from the pending state to the shadowed state is said to be replaced.  As described above, this occurs when:

 - Another transaction originating from the same sender with the same nonce enters the in block state
 - A transaction originating from the same sender with the same nonce with a 12% higher gas price enters the pending state

The initial transaction that has been replaced is said to be shadowed by the replacer.

__Forked__: A forked transaction occurs when a mined transaction, in other words a transaction in the in block state, is part of a block that gets reversed by the network. All transactions within the reversed block will subsequently be forked thus moving them from the in block state to the pending.state.

__Unshadowed__: A transaction can be unshawdowed when the conditions that caused it to be shawdowed are no more.

__Confirmed__: A transaction in the in block state is confirmed every time subsequent, child block gets created.

## How Transaction Lifecycle Is Used:
With GraphQL you can subscribe to transitions of a specific ethereum transaction in real-time. Furthermore, you have the ability to define precisely the data you want per transition.
### Subscriptions
Stream all transition for transaction `0x3be3b44ae48a074d3b79e3054bb3b62b5c5e5a8fc2210cd1dc7c7932ae5addcd` in real-time. Do not be scared we will breakdown the query

{{< tabs "trx_lifecycle_graphql_a">}}
{{< tab title="Graphql Query" lang="graphql" >}}
subscription{
  trackTransactionState(hash: "0x3be3b44ae48a074d3b79e3054bb3b62b5c5e5a8fc2210cd1dc7c7932ae5addcd"){
      previousState
      currentState
      transition{
        __typename

      ... on TrxTransitionInit {
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

      ...on TrxTransitionReceived {
          transaction {
          ...transactionFields
          }
        }

      ...on TrxTransitionMined {
          blockHeader {
          ...bloackHeaderFields
          }
          traces {
          ...transactionFields
          }
          confirmations
        }

      ...on TrxTransitionForked {
          transaction {
          ...transactionFields
          }
        }

      ...on TrxTransitionConfirmed {
          confirmations
        }

      ...on TrxTransitionReplaced {
          shadowedById
        }

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
    inputData
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
    inputData
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
{{< /tabs >}}

## Breaking down the Graphql Query

### Filtering

We filter our query by specifying a hash in the `trackTransactionState` subscription connection:

{{< tabs "issuing-long-jwt">}}
{{< tab title="Graphql Query" lang="graphql" >}}
subscription{
  trackTransactionState(hash: "0x3be3b44ae48a074d3b79e3054bb3b62b5c5e5a8fc2210cd1dc7c7932ae5addcd"){
    ...
  }
}
{{< /tab >}}
{{< /tabs >}}

### Specifying Fields

Next we specify the fields we want the subscription to return, in this example we are returning `previousState`, `currentState` and `transition`.

{{< tabs "trx_lifecycle_graphql_b">}}
{{< tab title="Graphql Query" lang="graphql" >}}
subscription{
  trackTransactionState(hash: "0x3be3b44ae48a074d3b79e3054bb3b62b5c5e5a8fc2210cd1dc7c7932ae5addcd"){
    previousState
    currentState
    transition {
        ...
    }
  }
}
{{< /tab >}}
{{< /tabs >}}

`transition` is defined as a Union type in Graphql. This means that `transition` can be one of six different types:

- `TrxTransitionInit`: This transition is the first one you will received __everytime__ you initiate a `trackTransactionState` query. It can be used to intialize your sytstem.
- `TrxTransitionReceived`: This transition will be sent when the transaction has first been seen in our memory pool
- `TrxTransitionMined`: This transition occurs when the transaction has been mined in a block
- `TrxTransitionForked`: This transition occurs when the transaction has been forked.
- `TrxTransitionConfirmed`: This transition will occur everytime your mined transaction's block has a new child block.
- `TrxTransitionReplaced`: This transition occurs when another transaction shadows your transaction.

Each of these fields have specifc attributes that you can choose to display

{{< tabs "trx_lifecycle_graphql_c">}}
{{< tab title="Graphql Query" lang="graphql" >}}
subscription{
  trackTransactionState(hash: "0x3be3b44ae48a074d3b79e3054bb3b62b5c5e5a8fc2210cd1dc7c7932ae5addcd"){
    previousState
    currentState
    transition{
      __typename

    ... on TrxTransitionInit {
        // insert desired TrxTransitionInit attributes
    }

    ...on TrxTransitionReceived {
        // insert desired TrxTransitionReceived attributes
    }

    ...on TrxTransitionMined {
      // insert desired TrxTransitionMined attributes
    }

    ...on TrxTransitionForked {
        // insert desired TrxTransitionForked attributes
    }

    ...on TrxTransitionConfirmed {
        // insert desired TrxTransitionConfirmed attributes
    }

    ...on TrxTransitionReplaced {
        // insert desired TrxTransitionReplaced attributes
    }
  }
}
{{< /tab >}}
{{< /tabs >}}

Some of the attributes have a same attribute, for example `TrxTransitionInit`, `TrxTransitionReceived` and `TrxTransitionForked` all have a transaction attribute. Instead of repeating the attribute' struct 3 times we can create a fragment that will be used by all 3 transition types

{{< tabs "trx_lifecycle_graphql_d">}}
{{< tab title="Graphql Query" lang="graphql" >}}
subscription{
  trackTransactionState(hash: "0x3be3b44ae48a074d3b79e3054bb3b62b5c5e5a8fc2210cd1dc7c7932ae5addcd"){
    previousState
    currentState
    transition{
      __typename

    ... on TrxTransitionInit {
        transaction {
            ...transactionFields
        }
    }

    ...on TrxTransitionReceived {
        transaction {
          ...transactionFields
        }
    }

    ...on TrxTransitionMined {
      // insert desired TrxTransitionMined attributes
    }

    ...on TrxTransitionForked {
        transaction {
          ...transactionFields
        }
    }

    ...on TrxTransitionConfirmed {
        // insert desired TrxTransitionConfirmed attributes
    }

    ...on TrxTransitionReplaced {
        // insert desired TrxTransitionReplaced attributes
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
    inputData
    signature {
      v
      s
      r
    }
}

{{< /tab >}}
{{< /tabs >}}

Putting all this together we get the full query we started with.

{{< row-wrapper-end >}}
