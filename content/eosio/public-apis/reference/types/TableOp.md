---
title: TableOp
---

# `TableOp`

A `TableOp` represents a table operation, creation or removal of a contract's table. The table is represents as
triplet `<account>/<table>/<scope>`. No two tables can exist at the same time with the same triplet.

#### Properties

{{< method-list-item name="op" type="String" required="true" >}}
  Operation, one of `REM` (removal) or `INS` (insertion).
{{< /method-list-item >}}

{{< method-list-item name="action_idx" type="Number (uint16)" required="true" >}}
  Position of the action within the transaction, going depth-first in `inline_actions`. 0-based index.
{{< /method-list-item >}}

{{< method-list-item name="account" type="[AccountName](/eosio/public-apis/reference/types/accountname)" required="true" >}}
  Contract account in which this table operation occurred.
{{< /method-list-item >}}

{{< method-list-item name="table" type="[TableName](/eosio/public-apis/reference/types/tablename)" required="true" >}}
  Contract account's table affected by this table operation.
{{< /method-list-item >}}

{{< method-list-item name="scope" type="[Name](/eosio/public-apis/reference/types/name)" required="true" >}}
  Table's scope affected by this table operation.
{{< /method-list-item >}}

{{< method-list-item name="payer" type="[AccountName](/eosio/public-apis/reference/types/accountname)" required="true" >}}
  Represents the payer of this table, i.e. the table represented by the `account/table/scope` triplet.
{{< /method-list-item >}}
