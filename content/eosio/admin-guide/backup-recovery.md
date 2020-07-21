---
weight: 140

pageTitle: Backup & Recovery
pageTitleIcon: eosio

sideNav: true
sideNavTitle: System Admin Guide
sideNavLinkRename: Backup & Recovery

BookToC: false
#release: stable

---

{{< alert type="warning" >}}
This section is incomplete and is still being worked on.
{{< /alert >}}


{{< alert type="note" >}}
The **goal of this page** is to help you
understand the components that require backup/recovery to ensure
smooth operation, and how these are implemented in dfuse and what can
be/is done automatically.
{{< /alert >}}


// TODO: finish

## `nodeos` node backup

* detail APIs available to do those things (node-manager)
* detail the flags to do those things automatically
* describe the automatic recovery behavior of `node-manager`.

# `pitreos`

* insert the link to the video about pitreos
* describe the benefits
* link to repo

# peering nodes

* setup of a peering / backup node with full blocks.log for quick access

# backup node

* blocks.log maintenance, describe how we can purge them
* how we need a full copy somewhere (backup node?)

# other components

* all other components, sourcing their data from object stores, don't need backup/recovery.
