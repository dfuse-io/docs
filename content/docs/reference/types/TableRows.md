---
title: TableRows
---

# `TableRows`

Name | Type | Options | Description
-----|------|---------|------------
`account` | [AccountName](#type-AccountName) | optional, required* | Contract account this table is a representation of.
`scope` | [Name](#type-Name) | optional, required* | Scope in contract account this table is a representation of.
`rows` | array&lt;[DBRow](#type-DBRow)&gt; | required | An array of rows in the table.

The `account` and `scope` fields will not be present when the request context makes it obvious what they should be (ex: in the context of a `get_table_rows`). They will however always be present when querying [multi accounts `/v0/state/tables/accounts`](#rest-get-v0-state-tables-accounts) or [multi accounts `/v0/state/tables/scopes`](#rest-get-v0-state-tables-scopes) endpoints.
