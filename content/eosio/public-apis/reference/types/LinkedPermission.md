---
weight: 1
title: LinkedPermission
---

# `LinkedPermission`

#### Properties

{{< method-list-item name="contract" type="[AccountName](/eosio/reference/types/accountname)" required="true" >}}
  Contract's account on which the permission is applied.
{{< /method-list-item >}}

{{< method-list-item name="action" type="[ActionName](/eosio/reference/types/actionname)" required="true" >}}
  Action on which the permission is applied.
{{< /method-list-item >}}

{{< method-list-item name="permission_name" type="[PermissionName](/eosio/reference/types/permissionname)" required="true" >}}
  Permission name that is required to perform the contract/action pair above.
{{< /method-list-item >}}
