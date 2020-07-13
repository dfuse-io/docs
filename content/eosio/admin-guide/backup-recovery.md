---
title: Backup & Recovery
weight: 120
---

Goal: understand components that require backup/recovery to ensure
smooth operation, how these are implemented in dfuse and what can
be/is done automatically.


* backup of `nodeos`
* `pitreos`
* setup of a peering / backup node with full blocks.log for quick access
* purge of blocks.log on `mindreader`, as they aren't required.
* all other components, sourcing their data from object stores, don't need backup/recovery.

## `nodeos` node backup

##

# `pitreos`
