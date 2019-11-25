---
weight: 40
title: Search Query Language
---

**dfuse Search** uses a simplified query language to reach unparalleled and predictable performances.

It is similar to GitHub's query language for issues and pull requests, and similiar also to Kibana's language over ElasticSearch's:

* it has a default `AND` operator between each query term.
* it adds a simple, one-level `OR` layer enclosed in parentheses.
* it supports negation with the `-` prefix, in front of the terms or `OR` groups (within `()` parentheses)
* it supports _boolean_ values: `true` and `false` have special meaning when not using quotes: `term:true` queries for a boolean value, while `term:"true"` searches for a string value.

You can enclose parameters using double-quotes after the `:`, or use a
single keyword. For example: `term:value` or `term:"value"`.

**dfuse Search** on all chains are aware of the chain's particular
consensus rules (like longest chain), and allow you to navigate any
forks, through the use of [cursors]({{< ref "/guides/core-concepts/cursors" >}}).

## Supported search terms

* [Ethereum search terms reference]({{< ref "reference/ethereum/search-terms" >}}).
* [EOSIO search terms reference]({{< ref "reference/eosio/search-terms" >}}).




## Operators

### Implicit `AND`

Merely separating fields by a space imply an `AND` clause.  Therefore:

{{< highlight ruby >}}
term1:value term2:"another value"
{{< / highlight >}}

is equivalent to:

{{< highlight javascript >}}
(term1 == "value") && (term2 == "another value")
{{< / highlight >}}

### `OR`

The `OR` operator is supported within parentheses, as a single depth level.  For example:

{{< highlight ruby >}}
(term1:value1 OR term2:value2)
{{< / highlight >}}

which is equivalent to:

{{< highlight javascript >}}
(term1 == "value1") || (term2 == "value2")
{{< / highlight >}}

### Mixed `AND` and `OR`

A combination of the two previous operators would look like:

{{< highlight ruby >}}
term1:value1 (term2:value2 OR term3:value3)
{{< / highlight >}}

which would be equivalent to:

{{< highlight javascript >}}
(term1 == "value1") && ((term2 == "value2" || term3 == "value3"))
{{< / highlight >}}


### `NOT`

The `NOT` operator is specified with a dash prefix (`-`) in front of the term to negate, or the `OR` group to negate. For example:

{{< highlight ruby >}}
-term1:"undesired"
{{< / highlight >}}

which is equivalent to:

{{< highlight javascript >}}
(term1 != "undesired")
{{< / highlight >}}

or more generally:

{{< highlight javascript >}}
!(term1 == "undesired")
{{< / highlight >}}

You can negate an `OR` group by prefixing the group with a dash (`-`) as such:

{{< highlight ruby >}}
term1:value1 -(term2:"value2" OR term3:value3)
{{< / highlight >}}

which is equivalent to:

{{< highlight javascript >}}
(term1 == "value1") && ((term2 != "value2") && (term3 != "value3"))
{{< / highlight >}}

or more generally:

{{< highlight javascript >}}
(term1 == "value1") && !((term2 == "value2") || (term3 == "value3"))
{{< / highlight >}}

Take out your logic textbook to flip `AND`s and `OR`s!


## Block Range

Searching through dfuse is always performed in term of a certain block range, that could be open
ended in the upper boundary to perform an infinite streaming.

{{< alert type="note" >}}
Only ascending search (i.e. forward from low to high) can be open ended. A backward search must
always have a fixed upper boundary.
{{< /alert >}}

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

{{< alert type="note" >}}
While the cursor affects the block range, it's still actually transaction aware. This means that
would jump to block as well as skipping all transactions that were before the cursor, thus already sent
to you.
{{< /alert >}}

Resolution of block range in regards to search inputs has difference depending on the chain you are
using. Refers to the following specific search range pages for the blockchain you want to work with:

- [EOSIO]({{< ref "/guides/eosio/concepts/search-ranges" >}})
- [Ethereum]({{< ref "/guides/ethereum/concepts/search-ranges" >}})
