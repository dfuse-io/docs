---
weight: 1
menuTitle: Search Ranges
title: EOSIO Search Ranges
release: beta
---

This page gives information about the searched range for various combinations of `lowBlockNum` and
`highBlockNum` when using our search engine as well as the implications of using a Cursor or deciding
about the sort order, either ascending (i.e. forward) or descending (i.e. backward).

To complicate things a bit more, the actual resolution is different between a search query versus
a search subscription (i.e. streaming).

You will notice that not all possible combinations are displayed here, mainly because the matrix
of all combinations is too big for quick understanding of boundaries resolution. We put the most
important cases, the resolution for all other combinations can be inferred easily based on
the table below. For example, values `lowBlockNum: -50, highBlockNum: -1` would mean the range
`[HEAD - 50, HEAD]` so the last 50 blocks of the chain at time of query.

{{< note >}}
All the boundaries are inclusive, so a range `[HEAD, HEAD]` will only check a single block, the
`HEAD` block.
{{< /note >}}

{{< warning >}}
Not all combinations are valid, trying to query an upper boundary that is below boundary yields
an invalid range error, for example trying `lowBlockNum: -1, highBlockNum: -50` is doomed to failed
as it would always resolves to `[HEAD, HEAD - 50]` which means the upper boundary is below the lower
one.
{{< /warning >}}

In the tables that follow, we use a few semantics to make the table easier to read:

- The value `None` means the field was not present at all
- Variable `C` represents the block number encoded in the cursor
- Variable `L` represents a dynamic value passed in `lowBlockNum` field, could be positive or negative
- Variable `H` represents a dynamic value passed in `highBlockNum` field, could be positive or negative
- Special variable `HEAD` means the head block of the chain, as seen by our search engine

### SearchForward Query

| Cursor | Low    | High   | Range                  |
|--------|--------|--------|------------------------|
| `None` | `None` | `None` | `[1, HEAD]`            |
| `None` | `L`    | `H`    | `[L, H]`               |
| `None` | `0`    | `0`    | `[1, 1]`               |
| `None` | `-1`   | `-1`   | `[HEAD, HEAD]`         |
| `None` | `-L`   | `-H`   | `[HEAD - L, HEAD - H]` |
||||||
| `C`    | `None` | `None` | `[C, HEAD]`            |
| `C`    | `L`    | `H`    | `[C, H]`               |
| `C`    | `0`    | `0`    | `[C, 1]`               |
| `C`    | `-1`   | `-1`   | `[C, HEAD]`            |
| `C`    | `-L`   | `-H`   | `[C, HEAD - H]`        |

### SearchForward Subscription

| Cursor | Low    | High   | Range                          |
|--------|--------|--------|--------------------------------|
| `None` | `None` | `None` | `[HEAD, ∞`                     |
| `None` | `L`    | `H`    | `[L, H]`                       |
| `None` | `0`    | `0`    | `[HEAD - 1, HEAD - 1]`         |
| `None` | `-1`   | `-1`   | `[HEAD - 2, HEAD - 2]`         |
| `None` | `-L`   | `-H`   | `[HEAD - 1 - L, HEAD - 1 - H]` |
||||||
| `C`    | `None` | `None` | `[C, ∞`                        |
| `C`    | `L`    | `H`    | `[C, H]`                       |
| `C`    | `0`    | `0`    | `[C, HEAD - 1]`                |
| `C`    | `-1`   | `-1`   | `[C, HEAD - 2]`                |
| `C`    | `-L`   | `-H`   | `[C, HEAD - 1 - H]`            |

### SearchBackward Query

| Cursor | Low    | High   | Range                  |
|--------|--------|--------|------------------------|
| `None` | `None` | `None` | `[1, HEAD]`            |
| `None` | `L`    | `H`    | `[L, H]`               |
| `None` | `0`    | `0`    | `[1, 1]`               |
| `None` | `-1`   | `-1`   | `[HEAD, HEAD]`         |
| `None` | `-L`   | `-H`   | `[HEAD - L, HEAD - H]` |
||||||
| `C`    | `None` | `None` | `[1, C]`               |
| `C`    | `L`    | `H`    | `[L, C]`               |
| `C`    | `0`    | `0`    | `[1, C]`               |
| `C`    | `-1`   | `-1`   | `[HEAD, C]`            |
| `C`    | `-L`   | `-H`   | `[HEAD - L, C]`        |

### SearchBackward Subscription

| Cursor | Low    | High   | Range                          |
|--------|--------|--------|--------------------------------|
| `None` | `None` | `None` | `[HEAD - 1, HEAD - 1]`         |
| `None` | `L`    | `H`    | `[L, H]`                       |
| `None` | `0`    | `0`    | `[HEAD - 1, HEAD - 1]`         |
| `None` | `-1`   | `-1`   | `[HEAD - 2, HEAD - 2]`         |
| `None` | `-L`   | `-H`   | `[HEAD - 1 - L, HEAD - 1 - H]` |
||||||
| `C`    | `None` | `None` | `[HEAD - 1, C]`                |
| `C`    | `L`    | `H`    | `[L, C]`                       |
| `C`    | `0`    | `0`    | `[HEAD - 1, C]`                |
| `C`    | `-1`   | `-1`   | `[HEAD - 2, C]`                |
| `C`    | `-L`   | `-H`   | `[HEAD - 1 - L, C]`            |
