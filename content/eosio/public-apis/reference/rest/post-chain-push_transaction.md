---
weight: 20
#same weight for all pages in this section to auto-order them A->Z
pageTitle: POST /v1/chain/push_transaction
pageTitleIcon: eosio

sideNav: true
sideNavTitle: Public APIs
sideNavLinkRename: POST /chain/push_transaction

BookToC: true
release: stable

---
Drop-in replacement for submitting a transaction to the network, but can optionally block the request until the transaction is either in a block or in an irreversible block.

## Usage

**/v1/chain/push_transaction**

Pushes a transaction to the blockchain, with the possibility to request
additional guarantees:

  * with HTTP Header: `X-Eos-Push-Guarantee: in-block`, the call is *blocking* until the transaction makes it into a valid block

  * with HTTP Header: `X-Eos-Push-Guarantee: handoff:1`, the call is *blocking* until the transaction makes it into a block that is still in the longest chain after block production got handed off to a different BP 1, 2 or 3 times (with `handoffs:2` and `handoffs:3`)

  * with HTTP Header: `X-Eos-Push-Guarantee: irreversible`, the call is *blocking* until the block in which the transaction was inserted becomes irreversible.

The content of the request and response is identical to the regular
"push_transaction" endpoint, except:

  * The response will contain those extra fields: `block_id` and
    `block_num` to inform you of the actual block containing the
    transaction.

  * The traces returned (under `processed`) are from *the actual
    execution* of the block, instead of being speculative traces of
    the edge node (like it is normally).

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
