---
weight: 20

pageTitle: Transaction Lifecycle
pageTitleIcon: eth

sideNav: true
sideNavTitle: Public APIs
sideNavLinkRename: Transaction Lifecycle

BookToC: false
#release: stable

aliases:
  - /guides/ethereum/concepts/trx_lifecycle/

---

## How Transaction Lifecycle Works

![](/img/eth_transaction_lifecycle_02.svg)

### Transaction State

An Ethereum transaction progresses through a series of states, starting with the unknown state, until it is in block being confirmed.

**Unknown**: A transaction that has not been seen nor processed by the network would be in the unknown state.

**Pending**: A transaction is in the pending state when it is waiting to be picked and processed by miners. They are in the so-called mempool. Miners usually select transactions with higher gas prices first, so transactions with lower gas prices may remain in the pending state for long periods. Transactions with the lowest gas prices may never get picked up, which would result in them getting “stuck” in the pending state indefinitely.

**In Block**: A transaction moves to the in block state when a miner has successfully selected the transaction and mined it within a block. Once in block, a transaction may move back to the pending state if the block is forked.

**Replaced**: A transaction can move to the replaced state from the pending state when either of these events occur:

- Another transaction originating from the same sender with the same nonce enters the in block state, or
- Another transaction originating from the same sender with the same nonce with a 12% higher gas price enters the pending state

### State Transitions

As shown in the diagram above, the transitions between states also have names:

**Pooled**: A transaction in the unknown state that enters the pool of transactions waiting to be selected by miners is said to be pooled and enters the pending state. It is also possible that a transaction in replaced state becomes pooled again, if the conditions for its replacement are no longer true (ex: in the rare case where a transaction with low gas price that was in block gets forked, and the replaced transaction with same nonce+sender with higher gas price was still floating around).

**Mined**: A mined transaction is one that has been processed by a miner, creating a block. Once mined, a transaction is said to be in the in block state. Due to the peer-to-peer nature of the Ethereum network, from the perspective of a given node a transaction can move from the unknown state directly to the in block state without visibly passing through the pending state. For the same reason, from the perspective of a given node a transaction may also pass from the replaced state to the in block state without passing through the pending state.

**Replaced**: A transaction that moves from the pending state to the replaced state is said to be replaced. As described above, this occurs when:

- Another transaction originating from the same sender with the same nonce enters the in block state, or
- Another transaction originating from the same sender with the same nonce with a 12% higher gas price enters the pending state

**Forked**: A forked transaction occurs when a mined transaction (i.e a transaction that is in the in block state) is part of a block that gets reversed by the network. All transactions within the reversed block will subsequently be forked, thus moving them from the in block state to the pending state.

**Confirmed**: A transaction in the in block state is confirmed every time a subsequent child block gets mined.

## How Transaction Lifecycle Is Used:

With GraphQL you can subscribe to transitions of a specific Ethereum transaction in real time. Furthermore, you have the ability to define precisely the data you want per transition.

### Subscriptions

Stream all transitions for transaction `0x3be3b44ae48a074d3b79e3054bb3b62b5c5e5a8fc2210cd1dc7c7932ae5addcd` in real time. Do not be scared, we will breakdown the query just below.

{{< tabs "trx-lifecycle-query">}}
{{< tab title="Graphql Query" lang="graphql" opts="linenos=table" >}}
{{< code-section "tutorials_eth_lifecycle_graphql_section1">}}
{{< /tab>}}
{{< /tabs >}}

## Breaking down the Graphql Query

### Filtering the Query

We filter our query by specifying a hash in the `transactionLifecycle` subscription connection.

{{< tabs "trx-lifecycle-query-hash">}}
{{< tab title="Graphql Query" lang="graphql" opts="linenos=table" >}}
{{< code-section "tutorials_eth_lifecycle_graphql_section2">}}
{{< /tab>}}
{{< /tabs >}}

### Specifying Fields

Next we specify the fields we want the subscription to return. In this example we are returning `previousState`, `currentState` and `transition`.

{{< tabs "trx-lifecycle-query-fields">}}
{{< tab title="Graphql Query" lang="graphql" delimeter="..." opts="linenos=table,hl_lines=4 5 6" >}}
{{< code-section "tutorials_eth_lifecycle_graphql_section3">}}
{{< /tab>}}
{{< /tabs >}}

`transition` is defined as a Union type in Graphql. This means that `transition` can be one of six different types:

- `TrxTransitionInit`: This transition is the first one you will receive **everytime** you initiate a `transaction` subscription. It can be used to initialize your system.
- `TrxTransitionPooled`: This transition will be sent when the transaction has first been seen in our memory pool.
- `TrxTransitionMined`: This transition occurs when the transaction has been mined in a block.
- `TrxTransitionForked`: This transition occurs when the transaction has been forked.
- `TrxTransitionConfirmed`: This transition will occur every time the mined transaction's block has a new child block.
- `TrxTransitionReplaced`: This transition occurs when another transaction replaces the transaction.

Each of these fields have specific attributes that you can choose to display

{{< tabs "trx-lifecycle-query-fields-transition">}}
{{< tab title="Graphql Query" lang="graphql" opts="linenos=table,hl_lines=10-12 14-16 18-20 22-24 26-28 30-32">}}
subscription{
transactionLifecycle(hash: "0x3be3b44ae48a074d3b79e3054bb3b62b5c5e5a8fc2210cd1dc7c7932ae5addcd"){
previousState
currentState
transitionName
transition {
\_\_typename

    ... on TrxTransitionInit {
        // insert desired TrxTransitionInit attributes
    }

    ...on TrxTransitionPooled {
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

Some of the attributes have the same attribute, for example `TrxTransitionInit`, `TrxTransitionPooled` and `TrxTransitionForked` all have a transaction attribute. Instead of repeating the attribute' struct 3 times we can create a fragment that will be used by all 3 transition types.

{{< tabs "trx-lifecycle-query-fields-transition-fragment">}}
{{< tab title="Graphql Query" lang="graphql" opts="linenos=table,hl_lines=4" >}}
{{< code-section "tutorials_eth_lifecycle_graphql_section4">}}
{{< /tab>}}
{{< /tabs >}}

The fragment can de defined like this:

{{< tabs "trx-lifecycle-query-fields-transition-fragment-defined">}}{{< tab title="Graphql Query" lang="graphql" >}}
{{< code-section "tutorials_eth_lifecycle_graphql_section5">}}
{{< /tab>}}
{{< /tabs >}}

Putting all of this together, we end up with the original query.
