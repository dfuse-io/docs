---
title: Data Stores & Artifacts
weight: 60
---

Goal: understand all the data consumed and produced by dfuse, the different databases, the different types of storages.


## Artifacts

* nodeos blocks.log
* nodeos state
* nodeos portable state snapshots (links)
* dfuse one-block files
* dfuse merged blocks files (100-blocks files)
* dfuse search indexes (bleve indexes)
* dfuse abicodec ABI cache

## Stores

`dstore` for object storage
* backends

`kvdb` for key/value storage
* backends

* one-block files in `dstore`
* merged blocks files in `dstore`
* search indexes in `dstore`
* abicodec ABI cache in `dstore`
* database: fluxdb in `kvdb`
* database: trxdb (where transactions and blocks can be split) in `kvdb`
