---
weight: 1
menuTitle: Search Ranges
title: Ethereum Search Ranges
---

This page gives information about the searched range for various combinations of `lowBlockNum` and
`highBlockNum` when using our search engine as well as the implications of using a `cursor` or deciding
about the `sort` order, either ascending (`ASC`) or descending (`DESC`).

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
- The value `Any` means can be any valid value for this field
- Variable `C` represents the block number encoded in the cursor
- Variable `L` represents a dynamic value passed in `lowBlockNum` field, could be positive or negative
- Variable `H` represents a dynamic value passed in `highBlockNum` field, could be positive or negative
- Special variable `HEAD` means the head block of the chain, as seen by our search engine

### Search Transactions (Query)

| Sort       | Cursor | Low    | High   | Range                  |
|------------|--------|--------|--------|------------------------|
| `Any`      | `None` | `None` | `None` | `[0, HEAD]`            |
| `Any`      | `None` | `L`    | `H`    | `[L, H]`               |
| `Any`      | `None` | `0`    | `0`    | `[0, 0]`               |
| `Any`      | `None` | `-1`   | `-1`   | `[HEAD, HEAD]`         |
| `Any`      | `None` | `-L`   | `-H`   | `[HEAD - L, HEAD - H]` |
|||||
| `ASC`      | `C`    | `None` | `None` | `[C, HEAD]`            |
| `ASC`      | `C`    | `L`    | `H`    | `[C, H]`               |
| `ASC`      | `C`    | `0`    | `0`    | `[C, 0]`               |
| `ASC`      | `C`    | `-1`   | `-1`   | `[C, HEAD]`            |
| `ASC`      | `C`    | `-L`   | `-H`   | `[C, HEAD - H]`        |
|||||
| `DESC`     | `C`    | `None` | `None` | `[0, C]`               |
| `DESC`     | `C`    | `L`    | `H`    | `[L, C]`               |
| `DESC`     | `C`    | `0`    | `0`    | `[0, C]`               |
| `DESC`     | `C`    | `-1`   | `-1`   | `[HEAD, C]`            |
| `DESC`     | `C`    | `-L`   | `-H`   | `[HEAD - L, C]`        |

### Search Transactions (Subscription)

| Sort       | Cursor | Low    | High   | Range                  |
|------------|--------|--------|--------|------------------------|
| `ASC`      | `None` | `None` | `None` | `[0, ∞`                |
| `ASC`      | `None` | `L`    | `H`    | `[L, H]`               |
| `ASC`      | `None` | `0`    | `0`    | `[0, 0]`               |
| `ASC`      | `None` | `-1`   | `-1`   | `[HEAD, HEAD]`         |
| `ASC`      | `None` | `-L`   | `-H`   | `[HEAD - L, HEAD - H]` |
|||||
| `ASC`      | `C`    | `None` | `None` | `[C, ∞`                |
| `ASC`      | `C`    | `L`    | `H`    | `[C, H]`               |
| `ASC`      | `C`    | `0`    | `0`    | `[C, 0]`               |
| `ASC`      | `C`    | `-1`   | `-1`   | `[C, HEAD]`            |
| `ASC`      | `C`    | `-L`   | `-H`   | `[C, HEAD - H]`        |
|||||
| `DESC`     | `None` | `None` | `None` | `[0, HEAD]`            |
| `DESC`     | `None` | `L`    | `H`    | `[L, H]`               |
| `DESC`     | `None` | `0`    | `0`    | `[0, 0]`               |
| `DESC`     | `None` | `-1`   | `-1`   | `[HEAD, HEAD]`         |
| `DESC`     | `None` | `-L`   | `-H`   | `[HEAD - L, HEAD - H]` |
|||||
| `DESC`     | `C`    | `None` | `None` | `[0, C]`               |
| `DESC`     | `C`    | `L`    | `H`    | `[L, C]`               |
| `DESC`     | `C`    | `0`    | `0`    | `[0, C]`               |
| `DESC`     | `C`    | `-1`   | `-1`   | `[HEAD, C]`            |
| `DESC`     | `C`    | `-L`   | `-H`   | `[HEAD - L, C]`        |
