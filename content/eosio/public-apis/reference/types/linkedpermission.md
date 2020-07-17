---
weight: 20
#same weight for all pages in this section to auto-order them A->Z
pageTitle: LinkedPermission
pageTitleIcon: eosio

sideNav: true
sideNavTitle: Public APIs
sideNavLinkRename: LinkedPermission

BookToC: true
#release: stable

aliases:
  - /reference/eosio/types/linkedpermission/

---

## Type `LinkedPermission`

#### Properties

{{< method-list-item name="contract" type="[AccountName](/eosio/public-apis/reference/types/accountname)" required="true" >}}
  Contract's account on which the permission is applied.
{{< /method-list-item >}}

{{< method-list-item name="action" type="[ActionName](/eosio/public-apis/reference/types/actionname)" required="true" >}}
  Action on which the permission is applied.
{{< /method-list-item >}}

{{< method-list-item name="permission_name" type="[PermissionName](/eosio/public-apis/reference/types/permissionname)" required="true" >}}
  Permission name that is required to perform the contract/action pair above.
{{< /method-list-item >}}
