---
weight: 40
---

# Search Features/Language

**dfuse Search** on all chains are aware of the chain's particular
consensus rules (like longest chain), and allow you to navigate any
forks, through the use of [cursors]({{< ref "cursors" >}})

## Implicit `AND`

## `OR` operator

## `NOT` operator

## Block Range

Searching through dfuse is always performed in term of a certain block range, that could be open
ended in the upper boundary to perform an infinite streaming.

{{< note >}}
Only ascending search (i.e. forward from low to high) can be open ended. A backward search must
always have a fixed upper boundary.
{{< /note >}}

While date range is more intuitive, the block range more closely follows the blockchain concept
which resolves around blocks. Furthermore, we went the block range way over the date range to
make clearer the boundaries that are search for, reducing potential off by one errors that could
happen more often when using a date range.

All searches are performed within the range boundary, and the navigation is either from lower boundary
to upper boundary when doing an ascending (a.k.a forward) search and from upper boundary to lower
boundary when doing a descending (a.k.a backward) search.

Cursor and block range are closely coupled concept since when providing a cursor value to our search
endpoints, it will affect the actual block range queried. Indeed, a cursor value will override the
lower boundary on ascending search while overriding the upper boundary when doing a descending search.

{{< note >}}
While the cursor affects the block range, it's still actually transaction aware. This means that
would jump to block as well as skipping all transactions that were before the cursor, thus already sent
to you.
{{< /note >}}

Resolution of block range in regards to search inputs has difference depending on the chain you are
using. Refers to the following specific search range pages for the blockchain you want to work with:

- [EOSIO]({{< ref "/guides/eosio/concepts/search-ranges" >}})
- [Ethereum]({{< ref "/guides/ethereum/concepts/search-ranges" >}})
