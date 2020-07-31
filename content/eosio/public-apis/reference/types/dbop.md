---
weight: 20
title: DBOp
aliases:
  - /reference/eosio/types/dbop/

---

## Type `DBOp`

A `DBOp` represents a database operation.  They appear in the `table_delta` and `table_snapshot` WS responses. They are also found in the responses from the REST [/v0/state/table]({{< ref "../rest/get-state-table" >}}).

#### Properties

{{< method-list-item name="op" type="String" required="true" >}}
  Operation. One of `REM` (removal), `UPD` (update) or `INS` (insertion)
{{< /method-list-item >}}

{{< method-list-item name="action_idx" type="Number (uint16)" required="true" >}}
  Position of the action within the transaction, going depth-first in `inline_actions`. 0-based index.
{{< /method-list-item >}}

{{< method-list-item name="account" type="[AccountName](/eosio/public-apis/reference/types/accountname)" required="true" >}}
  Contract account in which this database operation occurred.
{{< /method-list-item >}}

{{< method-list-item name="scope" type="[Name](/eosio/public-apis/reference/types/name)" required="false" >}}
  Scope within the contract account, in which the database operation occurred. Not repeated within a Table, the table specifies the `scope`.
{{< /method-list-item>}}

{{< method-list-item name="key" type="[Name](/eosio/public-apis/reference/types/name)" required="false" >}}
  Represents the *primary key* of the row in the table.
{{< /method-list-item>}}

{{< method-list-item name="old" type="[DBRow](/eosio/public-apis/reference/types/dbrow)" >}}
  Might be required, depending on `op`. Contents of the row before a `REM` or `UPD` operation.
{{< /method-list-item>}}

{{< method-list-item name="new" type="[DBRow](/eosio/public-apis/reference/types/dbrow)" >}}
  Might be required, depending on `op`. Contents of the row after an `INS` or `UPD` operation.
{{< /method-list-item>}}
