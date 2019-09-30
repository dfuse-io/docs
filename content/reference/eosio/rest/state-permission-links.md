---
weight: 1
title: GET /v0/state/permission_links
---

# GET `/v0/state/permission_links`

Fetches snapshots of any account’s linked authorizations on the blockchain, at any block height.

## Usage

Sample request:

{{< exampleRequest id="search-transactions" url="https://mainnet.eos.dfuse.io/v0/state/permission_links?account=eoscanadacom&block_num=10000000" >}}

Fetches snapshots of any account's linked authorizations on the blockchain, at any block height.

## Requesting past blocks

The `block_num` parameter determines for which block you want a linked
authorizations snapshot. This can be anywhere in the chain's history.

If the requested `block_num` is irreversible, you will get an
immutable snapshot.  If the `block_num` is still in a reversible
chain, you will get a full consistent snapshot, but it is not
guaranteed to be the view that will pass irreversibility. Inspect the
returned `up_to_block_id` parameter to understand from which longest
chain the returned value is a snapshot of.

## Input parameters

Name | Type | Options | Description
-----|------|---------|------------
`account` | [AccountName](#type-AccountName) | required | Account to query linked permissions from.
`block_num` | number (uint32) | optional, _defaults_ head block num | The block number for which you want to retrieve the consistent linked permissions snapshot.

## Response

> Here is a sample response, for a request at `block_num: 8`:

{{< highlight json >}}
{
  "up_to_block_id": "0000001000000000000000000000000000000000000000000000000000000000",
  "up_to_block_num": 8,
  "last_irreversible_block_id": "0000000400000000000000000000000000000000000000000000000000000000",
  "last_irreversible_block_num": 4,
  "linked_permissions": [
    {
      "contract": "eosio",
      "action": "claimrewards",
      "permission_name": "claimer"
    }
  ]
}
{{< /highlight >}}

Name | Type | Options | Description
-----|------|---------|------------
`up_to_block_id` | string | optional | Block ID at which the snapshot was taken when querying the reversible chain segment. This will not be present if querying blocks older than the last irreversible block.
`up_to_block_num` | number (uint32) | optional | Block number extracted from `up_to_block_id` if present, provided as a convenience so you don't need to extract it yourself.
`last_irreversible_block_id` | string | optional | Last irreversible block considered for this request. The returned snapshot is still for the requested `block_num`, even though the irreversible block shown here is more recent.
`last_irreversible_block_num` | number (uint32) | optional | Block number extracted from `last_irreversible_block_num`, provided as a convenience so you don't need to extract it yourself.
`linked_permissions` | array&lt;[LinkedPermission](#type-state-LinkedPermission)&gt; | required | An array of linked permissions for the account, sorted by the `contract` field and on `action` when there is a tie at the `contract` level.

## `LinkedPermission`

Name | Type | Options | Description
-----|------|---------|------------
`contract`  | [AccountName](#type-AccountName) | required | Contract's account on which the permission is applied.
`action` | [ActionName](#type-ActionName) | required | Action on which the permission is applied.
`permission_name` | [PermissionName](#type-PermissionName) | required | Permission name that is required to perform the contract/action pair above.