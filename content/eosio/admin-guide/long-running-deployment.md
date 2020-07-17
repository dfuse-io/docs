---
weight: 90

pageTitle: Simplest Long-Running Non-HA Deployment
pageTitleIcon: eosio

sideNav: true
sideNavTitle: System Admin Guide
sideNavLinkRename: Long-Running Non-HA Deployment

BookToC: false
#release: stable

---


{{< alert type="warning" >}}
This section is incomplete and is still being worked on.
{{< /alert >}}

{{< alert type="note" >}}
The **goal of this page** is to instruct you how to have an instance that is resilient to crashes of the machine and replacement of the machine on which you run it, and allows you to start scaling out some components (albeit not with zero downtime).
{{< /alert >}}

// TODO: complete this page,
// Separate storage from local storage. Badger to netkv minimally.
// Put merged files to network storage
// Put one-block files to network storage
// Put search indexes to network storage
