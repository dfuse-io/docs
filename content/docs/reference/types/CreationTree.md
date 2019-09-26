### `CreationTree`

A `CreationTree` represents the creation-ordered tree of notifications (`require_recipient` calls),
inline actions (`send_inline` calls) and context free inline actions (`send_context_free_inline` calls) as defined
in the smart contract. The `CreationTree` is per transaction and might not be present in the returned response. In
this case, it means the creation tree is exactly the same as the execution one.

**Restrictions** The opposite is not true however, it is possible to get a `CreationTree` and it will still be
the same as the execution tree. We trim off the `CreationTree` as a best effort, it still possible to get a
`CreationTree` mapping 1-to-1 with the execution tree. We suggest computing the tree and checking if there are
any differences on the client side if you need to be 100% sure they are different in the presence of the field.

The actual creation order can be different than the execution order, this is because the `EOSIO` platforms
first collect the creation of actions and then execute them, some within a totally new context like
`send_inline` or within the current execution context `require_recipient`. Moreover, the order in which
the execution order is performed is fixed, notifications are executed first (as well as the notifications created
as a side-effect of the on-going execution of the notification) then context free inline actions and last
the inline actions.

> Assuming that you have in your smart contract the following sequence of operations:

{{< highlight text >}}
send_context_free_inline(...)
require_recipient(...)
send_inline(...)
{{< /highlight >}}

The creation order is `send_context_free_inline`, `require_recipient`, `send_inline` but the actual execution
order and the corresponding execution traces will be in order `require_recipient`, `send_context_free_inline`
and `send_inline` instead, quite different!

The `CreationTree` represents this full ordered hierarchy of actions creation. The tree is encoded as a flat-list
each array element being a triplet (encoded in an array): `[nodeId, parentId, actionIndex]`. Each triplet in
the list represents a tree node. The first element of the triplet is a unique id for the node among all nodes
in the tree. The second is the parent's node id, a value of `-1` means it's a root node. The third is the
action index within the transaction to map this creation node to, going depth-first in `inline_actions`,
0-based indexed.

> Here an example of creation tree's flat list, an execution tree and its corresponding creation tree.

{{< highlight text >}}
CreationTree flat-list received as response from us

[
    [0, -1, 0],
    [1, 0, 1],
    [2, 1, 3],
    [3, 1, 9],
    [4, 0, 2],
    [5, 0, 4],
    [6, 0, 5],
    [7, 0, 7],
    [8, 6, 8],
    [9, 6, 6],
]
{{< /highlight >}}

{{< highlight text >}}
Execution traces within the transaction

Execution Tree              (actionIndex 0)
    ├── notify1             (actionIndex 1)
    ├── notify2             (actionIndex 2)
    ├── notify3             (actionIndex 3)
    ├── cf_inline1          (actionIndex 4)
    ├── inline1             (actionIndex 5)
    │   ├── notify4         (actionIndex 6)
    │   ├── cf_inline2      (actionIndex 7)
    │   └── inline3         (actionIndex 8)
    └── inline2             (actionIndex 9)
{{< /highlight >}}

{{< highlight text >}}
Represented creation tree, constructed using `CreationTree` flat-list and execution traces

Creation Tree               (0, -1, actionIndex 0)
    ├── notify1             (1, 0, actionIndex 1)
    │   ├── notify3         (2, 1, actionIndex 3)
    │   └── inline2         (3, 1, actionIndex 9)
    ├── notify2             (4, 0, actionIndex 2)
    ├── cf_inline1          (5, 0, actionIndex 4)
    └── inline1             (6, 0, actionIndex 5)
        ├── cf_inline2      (7, 6, actionIndex 7)
        ├── inline3         (8, 6, actionIndex 8)
        └── notify4         (9, 6, actionIndex 6)
{{< /highlight >}}

### Creation Tree Node

Index | Symbolic Name | Type | Description
-----|------|---------|------------
0 | `nodeId` | int | Unique id for the node among all nodes in the tree.
1 | `parentId` | int | Parent's node id, a value of `-1` means it's a root node.
2 | `actionIndex` | int | Action index within the transaction to map this creation node to, going depth-first in `inline_actions`, 0-based indexed.
