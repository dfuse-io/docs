---
weight: 20
#same weight for all pages in this section to auto-order them A->Z
pageTitle: RAMOp
pageTitleIcon: eosio

sideNav: true
sideNavTitle: Public APIs
sideNavLinkRename: RAMOp

BookToC: true
#release: stable

aliases:
  - /reference/eosio/types/ramop/

---

## Type `RAMOp`

A `RAMOp` is a modification to the RAM consumed by an account. RAM operations on dfuse are scoped down to the `action`.

#### Properties

{{< method-list-item name="op" type="String" required="true" >}}
  Operation. See enum below.
{{< /method-list-item >}}

{{< method-list-item name="action_idx" type="Number (uint16)" required="true" >}}
  Position of the action within the transaction, going depth-first in `inline_actions`. 0-based index.
{{< /method-list-item >}}

{{< method-list-item name="payer" type="[AccountName](/eosio/public-apis/reference/types/accountname)" required="true" >}}
  Payer that is credited or debited some RAM usage
{{< /method-list-item >}}

{{< method-list-item name="delta" type="Number (int64)" required="true" >}}
  Number of bytes freed (negative) or consumed (positive) by `payer`.
{{< /method-list-item >}}

{{< method-list-item name="usage" type="Number (uint64)" required="true" >}}
  Number of bytes available to `payer` *after* this operation affects his RAM balance.
{{< /method-list-item >}}

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
