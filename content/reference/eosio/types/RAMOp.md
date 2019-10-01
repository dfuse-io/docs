---
title: RAMOp
---

# `RAMOp`

A RAM operation is a modification to the RAM consumed by an
account. RAM operations on dfuse are scoped down to the `action`.

Name | Type | Options | Description
-----|------|---------|------------
`op` | string | **required** | Operation. See enum below.
`action_idx` | number (uint16) | **required** | Position of the action within the transaction, going depth-first in `inline_actions`. 0-based index.
`payer` | [AccountName]({{< ref "./AccountName" >}}) | **required** | Payer that is credited or debited some RAM usage
`delta` | number (int64) | **required** | Number of bytes freed (negative) or consumed (positive) by `payer`.
`usage` | number (uint64) | **required** | Number of bytes available to `payer` *after* this operation affects his RAM balance.

Here is a list of operations with the reasons for the consumption:

* `create_table`: creation of a table
* `deferred_trx_add`: storing deferred transaction
* `deferred_trx_cancel`: canceling deferred transaction
* `deferred_trx_pushed`: creating deferred transaction
* `deferred_trx_removed`: executing deferred transaction. **NOTE:** that this one is the only one that is really scoped to the transaction, and not the action. You can ignore the value of `action_idx` when `op` is `deferred_trx_removed`.
* `deleteauth`: deleting authority
* `linkauth`: linking authority
* `newaccount`: creating new account
* `primary_index_add`: storing row (primary)
* `primary_index_remove`: removing row (primary)
* `primary_index_update`: updating row (primary)
* `primary_index_update_add_new_payer`: storing payer (primary)
* `primary_index_update_remove_old_payer`: removing payer (primary)
* `remove_table`: removing a table
* `secondary_index_add`: storing row (secondary)
* `secondary_index_remove`: removing row (secondary)
* `secondary_index_update_add_new_payer`: storing payer (secondary)
* `secondary_index_update_remove_old_payer`: removing payer (secondary)
* `setabi`: updating ABI for account
* `setcode`: updating contract for account
* `unlinkauth`: unlinking authority
* `updateauth_create`: creating new permission
* `updateauth_update`: updating permission
