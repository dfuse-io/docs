---
title: Simplest Long-Running non-HA Deployment
weight: 80
draft: true
TODO: true
---

{{< alert type="note" >}}
The **goal of this page** is to instruct you how to have an instance that is resilient to crashes of the machine and replacement of the machine on which you run it, and allows you to start scaling out some components (albeit not with zero downtime).
{{< /alert >}}

// TODO: complete this page,
// Separate storage from local storage. Badger to netkv minimally.
// Put merged files to network storage
// Put one-block files to network storage
// Put search indexes to network storage
