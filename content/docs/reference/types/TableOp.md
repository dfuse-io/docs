
### `TableOp`

A `TableOp` represents a table operation, creation or removal of a contract's table. The table is represents as
triplet `<account>/<table>/<scope>`. No two tables can exist at the same time with the same triplet.

Name | Type | Options | Description
-----|------|---------|------------
`op` | string | **required** | Operation, one of `REM` (removal) or `INS` (insertion).
`action_idx` | number (uint16) | **required** | Position of the action within the transaction, going depth-first in `inline_actions`. 0-based index.
`account` | [AccountName](#type-AccountName) | **required** | Contract account in which this table operation occurred.
`table` | [TableName](#type-TableName) | **required** | Contract account's table affected by this table operation.
`scope` | [Name](#type-Name) | **required** | Table's scope affected by this table operation.
`payer` | [AccountName](#type-AccountName) | **required** | Represents the payer of this table, i.e. the table represented by the `account/table/scope` triplet.
