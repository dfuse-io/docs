---
weight: 135
title: Monitoring
---

{{< alert type="note" >}}
The **goal of this page** is to help you understand how to monitor the availability and get some metrics from the different `dfuse for EOSIO` [components]({{< ref "./components" >}}).
{{< /alert >}}



## Component Readiness (health check)

Each [component]({{< ref "./components" >}}) has a notion of "readiness" (sometimes just referred to as health), meaning that it is currently able to do its job. Readiness should be used for the following purposes:

1. Generating an alert that something is wrong with one instance (or, more critically, when every instance of that component is not ready)
2. During rolling updates, when a component (ex: relayer) is "ready", the other relayers can be shutdown to continue the update.

Note that some components (ex: blockmeta) can be available (serving requests) without being ready. It usually means that they are degraded.

### gRPC Health check

Some dfuse components only expose a gRPC port, so their readiness must be checked using the [gRPC Health Checking Protocol](https://github.com/grpc/grpc/blob/master/doc/health-checking.md). 

1. Download grpc-health-probe https://github.com/grpc-ecosystem/grpc-health-probe/releases

```
curl -L -o grpc_health_probe https://github.com/grpc-ecosystem/grpc-health-probe/releases/download/v0.3.2/grpc_health_probe-linux-386 && chmod +x grpc_health_probe
```

2. Then, for each one of those services, you will need to run the following command on the listening gRPC port, which will respond with `SERVING` (zero exit code) or `NOT_SERVING` (non-zero exit code)

```
./grpc_health_probe -addr=localhost:9000
```

### HTTP Health check

Some dfuse components  only expose an HTTP port, so their readiness must be checked using an HTTP call to `/healthz`, looking for a response status 200 for `ok` and a response status >=500 for `not ready`

## List of components with their health check methods

The following components should be checked on their "gRPC listen adress":

* abicodec
* blockmeta
* merger
* relayer
* search-forkresolver
* search-router
* search-archive
* tokenmeta

The following components should be checked on their "HTTP listen address" on `/healthz`

* dgraphql
* eosq
* eosws (requires the queryparam `secret={value of param --eosws-healthz-secret}`)
* fluxdb
* mindreader
* node-manager
* search-indexer
* statedb


The following components *do not* have any health check implemented yet

* accounthist: (not implemented yet) meanwhile, do a simple TCP check on the gRPC port will say if the service is listening
* mindreader-stdin: (not implemented yet) you can check status from prometheus metric `head_block_time_drift{app="mindreader-stdin"}`
* trxdb-loader: (not implemented yet) you can check status from prometheus metric `head_block_time_drift{app="trxdb-loader"}`

* merged-filter: (not implemented yet)

## Prometheus-based useful metrics

Most dfuse components expose metrics in the Prometheus format, available through HTTP on port 9102.

Here is an example of useful metrics:

* head block drift (ex: `head_block_time_drift{app="live"} 0.544560016`)
* head block number (ex: `tail_block_number{app="live"} 1.40000999e+08`)
* is the search router serving all blocks from lowblocknum to head (for search router) `full_contiguous_block_range 1`


