---
weight: 20
#same weight for all pages in this section to auto-order them A->Z
pageTitle: GET /v0/state/table_scopes
pageTitleIcon: eosio

sideNav: true
sideNavTitle: Public APIs
sideNavLinkRename: GET /state/table_scopes

BookToC: true
release: stable

aliases:
  - /reference/eosio/rest/state-table-scopes/

---

Fetches a list of scopes, for a given table on a contract account, at any block height.

{{< alert type="note" >}}
Not to be confused with [/v0/state/tables/scopes]({{< ref "./get-state-tables-scopes.md" >}}) which retrieves the actual _tables_. Paired with this endpoint, you can get a consistent view of all tables in a contract.
{{< /alert >}}

## Usage

Sample request:

{{< example-request id="search-transactions" url="https://mainnet.eos.dfuse.io/v0/state/table_scopes?account=eosforumdapp&table=proposal" >}}

## Requesting past blocks

The `block_num` parameter determines for which block you want the list
of scopes for the given contract account's table. This can be anywhere
in the chain's history.

If the requested `block_num` is irreversible, you will get an
immutable list of accounts. Otherwise, there are chances that the
returned value moves as the chain reorganizes.

## Input parameters

{{< method-list-item name="account" type="[AccountName](/eosio/public-apis/reference/types/accountname)" required="true" >}}
  Contract account holding the requested table.
{{< /method-list-item >}}

{{< method-list-item name="table" type="[TableName](/eosio/public-apis/reference/types/tablename)" required="true" >}}
  The _name-encoded_ table name you want to retrieve scopes from.  Refer to the contract's ABI for a list of available tables.  This is contract dependent.
{{< /method-list-item >}}

{{< method-list-item name="block_num" type="Number" require="false" >}}
  Defaults to head block num. The block number for which you want to retrieve the consistent table scopes snapshot.
{{< /method-list-item >}}


#### Response

{{< method-list-item name="block_num" type="Number" require="true" >}}
  Block number used to serve your request. Will be the head `block_num` if it was not provided or `0` was passed as `block_num`, otherwise, will be the `block_num` you've passed in the request.
{{< /method-list-item >}}

{{< method-list-item name="scopes" type="Array&lt;[Name](/eosio/public-apis/reference/types/name)&gt;" require="true" >}}
  Block number used to serve your request. Will be the head `block_num` if it was not provided or `0` was passed as `block_num`, otherwise, will be the `block_num` you've passed in the request.
{{< /method-list-item >}}

Here is a sample response, for a request at `block_num: 9000000`:

{{< tabs "state-table-scopes-response" >}}
{{< tab lang="json" >}}
{
  "block_num": 9000000,
  "scopes": [
    "aus1genereos",
    "eoscanadacom"
  ]
}
{{< /tab >}}
{{< /tabs >}}
