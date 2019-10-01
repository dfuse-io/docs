---
title: DBOp
---

# `DBOp`

A `DBOp` represents a database operation.  They appear in the `table_delta` and `table_snapshot` WS responses. They are also found in the responses from the REST [/v0/state/table]({{< ref "../rest/state-table" >}}).

Name | Type | Options | Description
-----|------|---------|------------
`op` | string | **required** | Operation. One of `REM` (removal), `UPD` (update) or `INS` (insertion)
`action_idx` | number (uint16) | **required** | Position of the action within the transaction, going depth-first in `inline_actions`. 0-based index.
`account` | [AccountName]({{< ref "./AccountName" >}}) | **required** | Contract account in which this database operation occurred.
`scope` | [Name]({{< ref "./Name" >}}) | not repeated within a Table,<br/>the table specifies the `scope` | Scope within the contract account, in which the database operation occurred.
`key` | [Name]({{< ref "./Name" >}}) | optional | Represents the *primary key* of the row in the table.
`old` | [DBRow]({{< ref "./DBRow" >}}) | optional, depending on `op` | Contents of the row before a `REM` or `UPD` operation.
`new` | [DBRow]({{< ref "./DBRow" >}}) | optional, depending on `op` | Contents of the row after an `INS` or `UPD` operation.
