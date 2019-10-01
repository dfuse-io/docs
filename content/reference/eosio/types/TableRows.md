---
title: TableRows
---

# `TableRows`

Name | Type | Options | Description
-----|------|---------|------------
`account` | [AccountName]({{< ref "./AccountName" >}}) | optional, required* | Contract account this table is a representation of.
`scope` | [Name]({{< ref "./Name" >}}) | optional, required* | Scope in contract account this table is a representation of.
`rows` | Array&lt;[DBRow]({{< ref "./DBRow" >}})&gt; | required | An array of rows in the table.

The `account` and `scope` fields will not be present when the request context makes it obvious what they should be (ex: in the context of a `get_table_rows`). They will however always be present when querying [multi accounts /v0/state/tables/accounts]({{< ref "../rest/state-tables-accounts" >}}) or [multi accounts /v0/state/tables/scopes]({{< ref "../rest/state-tables-scopes" >}}) endpoints.
