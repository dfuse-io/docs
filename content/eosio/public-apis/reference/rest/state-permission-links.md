---
weight: 1
pageTitle: GET /v0/state/permission_links
---
Fetches snapshots of any account’s linked authorizations on the blockchain, at any block height.

## Usage

Sample request:

{{< example-request id="search-transactions" url="https://mainnet.eos.dfuse.io/v0/state/permission_links?account=eoscanadacom&block_num=10000000" >}}

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

#### Input parameters

{{< method-list-item name="account" type="[AccountName](/eosio/public-apis/reference/types/accountname)" required="true" >}}
  Account to query linked permissions from.
{{< /method-list-item >}}

{{< method-list-item name="block_num" type="Number (uint32)" required="false" >}}
  Defaults to head block num. The block number for which you want to retrieve the consistent linked permissions snapshot.
{{< /method-list-item >}}

#### Response

{{< method-list-item name="up_to_block_id" type="String" required="false" >}}
  Block ID at which the snapshot was taken when querying the reversible chain segment. This will not be present if querying blocks older than the last irreversible block.
{{< /method-list-item >}}

{{< method-list-item name="up_to_block_num" type="Number (uint32)" required="false" >}}
  Block number extracted from `up_to_block_id` if present, provided as a convenience so you don't need to extract it yourself.
{{< /method-list-item >}}

{{< method-list-item name="last_irreversible_block_id" type="String" required="false" >}}
  Last irreversible block considered for this request. The returned snapshot is still for the requested `block_num`, even though the irreversible block shown here is more recent.
{{< /method-list-item >}}

{{< method-list-item name="last_irreversible_block_num" type="Number (uint32)" required="false" >}}
  Block number extracted from `last_irreversible_block_num`, provided as a convenience so you don't need to extract it yourself.
{{< /method-list-item >}}

{{< method-list-item name="linked_permissions" type="Array&lt;[LinkedPermission](/eosio/public-apis/reference/types/linkedpermission)&gt;" required="true" >}}
  An array of linked permissions for the account, sorted by the `contract` field and on `action` when there is a tie at the `contract` level.
{{< /method-list-item >}}

Here is a sample response, for a request at `block_num: 8`:

{{< tabs "state-permission-links-response" >}}
{{< tab lang="json" >}}
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
{{< /tab >}}
{{< /tabs >}}
