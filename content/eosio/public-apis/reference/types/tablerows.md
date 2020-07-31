---
weight: 20
title: TableRows
aliases:
  - /reference/eosio/types/tablerows/

---

## Type `TableRows`

#### Properties

{{< method-list-item name="rows" type="Array&lt;[DBRow](/eosio/public-apis/reference/types/dbrow)&gt;" required="true" >}}
  An array of rows in the table.
{{< /method-list-item >}}

{{< method-list-item name="account" type="[AccountName](/eosio/public-apis/reference/types/accountname)" >}}
  Sometimes required*. Contract account this table is a representation of.
{{< /method-list-item >}}

{{< method-list-item name="scope" type="[Name](/eosio/public-apis/reference/types/name)" >}}
  Sometimes required*. Scope in contract account this table is a representation of.
{{< /method-list-item >}}

\* The `account` and `scope` fields will not be present when the request context makes it obvious what they should be (ex: in the context of a `get_table_rows`). They will however always be present when querying [multi accounts /v0/state/tables/accounts]({{< ref "../rest/get-state-tables-accounts" >}}) or [multi accounts /v0/state/tables/scopes]({{< ref "../rest/get-state-tables-scopes" >}}) endpoints.
