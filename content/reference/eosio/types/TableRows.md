---
title: TableRows
---

# `TableRows`

#### Properties

{{< method-list-item name="account" type="[AccountName](/reference/eosio/types/accountname)" required="false" >}}
  Optional, required*. Contract account this table is a representation of.
{{< /method-list-item >}}

{{< method-list-item name="scope" type="[Name](/reference/eosio/types/name)" required="false" >}}
  Optional, required*. Scope in contract account this table is a representation of.
{{< /method-list-item >}}

{{< method-list-item name="rows" type="Array&lt;[DBRow](/reference/eosio/types/dbrow)&gt;" required="true" >}}
  An array of rows in the table.
{{< /method-list-item >}}

The `account` and `scope` fields will not be present when the request context makes it obvious what they should be (ex: in the context of a `get_table_rows`). They will however always be present when querying [multi accounts /v0/state/tables/accounts]({{< ref "../rest/state-tables-accounts" >}}) or [multi accounts /v0/state/tables/scopes]({{< ref "../rest/state-tables-scopes" >}}) endpoints.