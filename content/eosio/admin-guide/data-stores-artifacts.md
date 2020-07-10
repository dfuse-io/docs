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

TODO: describe all of this

## Stores

These are the object (larger files) storage types that dfuse uses:
* [dstore][https://github.com/dfuse-io/dstore], with support for Azure, GCP, AWS, Minio, and local filesystems
* `kvdb` for key/value storage
* backends

* one-block files in `dstore`
* merged blocks files in `dstore`
* search indexes in `dstore`
* abicodec ABI cache in `dstore`
* database: fluxdb in `kvdb`
* database: trxdb (where transactions and blocks can be split) in `kvdb`
