---
weight: 20
title: POST /v1/chain/push_transaction
release: stable
aliases:
  - /reference/eosio/rest/push-transaction/
---

Drop-in replacement for submitting a transaction to the network, but can optionally block the request until the transaction is either in a block or in an irreversible block.

## Usage

**/v1/chain/push_transaction**

Pushes a transaction to the blockchain, with the possibility to request
additional guarantees:

  * With HTTP Header: `X-Eos-Push-Guarantee: in-block`, the call is *blocking* until the transaction makes it into a valid block

  * With HTTP Header: `X-Eos-Push-Guarantee: handoff:1`, the call is *blocking* until the transaction makes it into a block that is still in the longest chain after block production got handed off to a different BP 1, 2 or 3 times (with `handoffs:2` and `handoffs:3`)

  * With HTTP Header: `X-Eos-Push-Guarantee: irreversible`, the call is *blocking* until the block in which the transaction was inserted becomes irreversible.

The content of the request and response is identical to the regular
"push_transaction" endpoint, except:

  * The response will contain those extra fields: `block_id` and
    `block_num` to inform you of the actual block containing the
    transaction.

  * The traces returned (under `processed`) are from *the actual
    execution* of the block, instead of being speculative traces of
    the edge node (like it is normally).

The endpoint also implement intelligent retry mechanisms to overcome some small network hiccups that happen from time to time like increased block forking. If the transaction is accepted by the peer but does not go through, it is retried, over and over (with increased delay) up to 16 attempts over 30 seconds.
it will stop in one of those conditions is met:

 1. The transaction is seen in a block -> you get back the block number and the actual traces.
 1. Those 30 seconds have passed.
 1. The transaction is getting rejected (ex: from an assertion in the transaction that makes it fail, or its expiration is passed -- default is 30 seconds when created with cleos).
 1. The transaction is seen as duplicate (meaning it's in a block according to some BPs, but not according to our system -- this is an unusual scenario but can happen when network is forking a lot).

There is no known problem with increasing the retries further, but you may want to keep some control over transactions and not have them "floating in limbo" waiting to get on the chain. 30 seconds was set, as this is the default set by cleos as well, and has shown to be very effective over the past couple of years of users utilizing it.

Only a few retries (1 or 2) are enough to catch the most frequent case where a transaction was accepted on the API node, and when the time came to get into a block, failed because of an assertion (ex: insufficient funds)

The retry mechanism only applies to the transaction until it passes in one of our API nodes, or if there is no push-guarantee (just using our endpoint as a pass thru to the network).
Then at that point, it waits for the transaction for a longer duration, which depends on the guarantee that you requested:

 * `in-block` -> 2 minutes
 * `handoffs:1`, `handoffs:2` or `handoffs:3` -> 3 minutes
 * `irreversible` -> 8 minutes

During that period, it retries every ~8 seconds until the is seen in a block with the given requirements. If the transaction is expired during the second phase (with wait times between 2->8 minutes), or if the transaction becomes unacceptable (because of an assertion that now makes it fail) the call will return with failure right away. This way, your system is notified whether your transaction is part of the chain, or needs to be repushed on your part.

**For more information, see the [in depth tutorial]({{< ref "/eosio/public-apis/tutorials/writing-on-chain" >}})**

## Status of support for `cleos`

{{< highlight shell >}}
cleos --header "X-Eos-Push-Guarantee: in-block" --header "Authorization: Bearer YOURTOKENHERE" push transaction mytx.json
cleos --header "X-Eos-Push-Guarantee: handoffs:2" --header "Authorization: Bearer YOURTOKENHERE" push transaction mytx.json
{{< /highlight >}}

You need **cleos version 1.4.1** or higher to use the `X-Eos-Push-Guarantee` feature.

Older version of `cleos` have
{{< external-link href="https://github.com/EOSIO/eos/pull/6265" title="an issue addressed in this PR">}}

{{< highlight shell >}}
eosc -H "Authorization: Bearer YOURTOKENHERE" -H "X-Eos-Push-Guarantee: irreversible" -u "https://mainnet.eos.dfuse.io" tx push mytx.json
eosc -H "Authorization: Bearer YOURTOKENHERE" -H "X-Eos-Push-Guarantee: handoffs:3" -u "https://mainnet.eos.dfuse.io" transfer sourceaccount destination 5
{{< /highlight >}}

You can always use `eosc` to use the feature:


## Deferred transactions

In the case of a transaction set with a non-zero `delay_sec`, the guarantee
is set on the "scheduling" step of that transaction, not its execution
(which could be far off in the future.)

The returned traces are also the traces of that "scheduling" step,
from the block, and not the speculative execution of the edge node.
