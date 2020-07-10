---
title: Backup & Recovery
---

Goal: components that require backup/recovery to ensure smooth
operation, as well how these are implemented in dfuse

* backup of `nodeos`
* setup of a peering / backup node with full blocks.log for quick access
* purge of blocks.log on `mindreader`, as they aren't required.
* all other components, sourcing their data from object stores, don't need backup/recovery.
