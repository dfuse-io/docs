---
weight: 15
title: Ethereum
sideNavRoot: false
---

The **goal of this page** is to give you a reference page for the config files of each component on a highly available, and scaled out setup. The config files given here is based on a basic understanding of Kubernetes and/or containerized deployment. It will instruct you how to have an instance that is resilient to crashes of the machine and replacement of the machine on which you run it, and allows you to start scaling out some components.

### Premise

* Each component is decoupled as an independent microservice, and is scaled separately.
* Merged blocks are available on a shared fashion with a single data stores URL access point.
* Internal network routing works using a DNS that load balances between available instances (for example, a Kubernetes `ClusterIP` service).
* External network routing using a load balancer is possible, we give general route mapping and protocol types.

Here some general values that will need to be replaced in the flags below, they are deployment dependent. Throughout this reference document, we will use some common shared config values that will need to be adapted to your specific deployment setup.

{{< alert type="important" >}}
The following element below are placeholder that you will need to find and replace in the flags provided below.

- One blocks `gs://acme-blocks/eth-name-here/v1-oneblock`
- Merged blocks `gs://acme-blocks/eth-name-here/v1`

Do a search/replace in the config to replace all occurrences.
{{< /alert >}}

The components presented below are loosly ordered by dependencies, the most low-level dependency listed first climbing to the top of the dependencies tree up to the API level component which is Firehose itself.

### Running

All the example config presented here can be run by following these step:

- Copy the relevant config to your working directory, use the component name like `mindreader.yaml`
- Run `sfeth` binary pointing it to the config and picking a unique data directory

    {{< highlight bash >}}
sfeth start -c mindreader.yaml -d data/mindreader -v{{< /highlight >}}

    {{< alert type="note" >}}
If you run into a problem, you can add more `-vvv` to the end of the command to increase the logger verbosity. If nothing seems to standout, it's possible to also active tracing by preprending the command with `TRACE=true` (a specific component can be specified here like `TRACE=mindreader` to restrict a bit the verbosity).
{{< /alert >}}

The default logger configured for each service is to use the `json` logging format. If you are running on GCP and want to collect logs into StackDriver, you can use `log-format: stackdriver` everywhere instead.

#### Flag Help

There is multiple flags defined for each component and we giving full description of each field within this documentation would generate too much noise for the config files to be readable. As such, we give inline explanation as YAML comments for the most important ones. The comment is always attached on top of the field in question. If a field does not have any comment attached, you can also rely on the `sfeth start --help` command and do a `grep` invocation to find the documention for a particular field.

As an example, let's say you want to better understand what is the purpose of the **mindreader-node-log-to-zap* field of the `mindreader` component, then you would do this

```bash
sfeth start --help | grep mindreader-node-log-to-zap
```

Which would yield the following result:

```bash
--mindreader-node-log-to-zap  Enable all node logs to transit into node's logger directly, when false, prints node logs directly to stdout (default true)
```

### Components

#### Mindreader

The `mindreader` component is responsible of generating Firehose Blocks. When catching up with the chain and block time are earlier than 12 hours ago (customizable), `mindreader` generates merged blocks (a bundle of 100 blocks in a single compressed file) and otherwise, it generates one block that are later merged together in bundle of 100 blocks by the `merger` components.

The `mindreader` component uses a node manager, which roles is to wrap and supervised `geth` process and providing a admin HTTP API that can be used to perform some operational task like stopping `geth`, starting back `geth` and other such maintenance tasks.

{{< alert type="note" >}}
To sync with high traffic chains like Ethereum Mainnet or BSC Mainnet, a fast frequency CPU is required, the biggest clock frequency the faster transactions will be ingested by `mindreader`. A too slow CPU on a high traffic chain will make `mindreader` slowly drift or never catch up.
{{< /alert >}}

###### `sts/mindreader-v1`

{{< highlight yaml >}}
# mindreader.yaml
start:
  args:
  - mindreader
  flags:
    log-format: json
    log-to-file: false
    common-network-id: 1
    common-oneblock-store-url: "gs://acme-blocks/eth-name-here/v1-oneblock"
    common-blocks-store-url: "gs://acme-blocks/eth-name-here/v1"
    # Persistent disk where `geth` blocks and state are stored, should be sized big enough to hold chain blocks & state
    mindreader-node-data-dir: /data
    mindreader-node-readiness-max-latency: 2700s
    mindreader-node-log-to-zap: false
    mindreader-node-debug-deep-mind: false
    mindreader-node-blocks-chan-capacity: 1000
    mindreader-node-merge-and-store-directly: false
    mindreader-node-discard-after-stop-num: false
    # Address serving a live stream of blocks, usually consumed by `relayer` to multiplex blocks into a single stream
    mindreader-node-grpc-listen-addr: :9000
    # The manager API port used to send HTTP maintenance command like `curl http://localhost:8080/v1/maintenance?sync=true` or `curl http://localhost:8080/v1/resume?sync=true`
    mindreader-node-manager-api-addr: :8080
    # Threshold of time within which blocks are automatically merged by `mindreader` component (e.g. if `now` - `block.time` > `threshold` then `merge blocks directly` else `generate one block files`)
    # Do not decrease the threshold below 1h, dealing with fork (e.g. uncle blocks) is not supported within this mode
    mindreader-node-merge-threshold-block-age: 3h
    # Extra flags passed to the Geth binary, if `+` is used at the start of the command, flags are appended to default ones determined by `mindreader` based on the various
    # other flags. You can ask the manager to give you the exact Geth command invocation with `curl http://localhost:8080/v1/start_command`.
    mindreader-node-arguments: "+--cache 8192 --maxpeers 100 --metrics --metrics.port 6061 --metrics.addr 0.0.0.0  --port=30303 --http.port=8545 --snapshot=false --txlookuplimit=1000"
    mindreader-node-bootstrap-data-url:
    # Location of the `geth` binary that should be invoked by the node manager
    mindreader-node-path: /app/geth
    mindreader-node-type: geth
{{< /highlight >}}

#### Merger

The `merger` is responsible of merging one blocks generated by `mindreader` components. When near live, the `mindreader` starts to produce one block files in a folder. The merge responsibility is to scan this folder and merged 100 blocks together ensuring that all forked versions that could happen are recorded together.

###### `sts/merger-v1`

{{< highlight yaml >}}
# merger.yaml
start:
  args:
  - merger
  flags:
    log-format: json
    log-to-file: false
    common-blocks-store-url: "gs://acme-blocks/eth-name-here/v1"
    common-oneblock-store-url: "gs://acme-blocks/eth-name-here/v1-oneblock"
    merger-time-between-store-lookups: 5s
    merger-grpc-listen-addr: :9000
    merger-writers-leeway: 20s
    # Persistent folder used to store a cache file of the blocks that where already merged
    merger-state-file: /data/merger.seen.gob
{{< /highlight >}}

#### Relayer

The `relayer` component is a multiplexer that receives blocks from multiple `mindreader` instances and join them in order to form a single stream of live blocks. All component that consumes live blocks (which is mostly all of them) connects to the `relayer`.

###### `deploy/relayer-v1`

{{< highlight yaml >}}
# relayer.yaml
start:
  args:
  - relayer
  flags:
    log-format: json
    log-to-file: false
    common-blocks-store-url: "gs://acme-blocks/eth-name-here/v1"
    relayer-buffer-size: 300
    relayer-max-source-latency: 5m
    # Load balanced endpoint where to reach the merger-v1 service. The `dns` schema works as long as the DNS is setup correctly and that
    # a A record exists for the specified entry. You might need to adjust the names here based on your setup.
    #
    # In our Kubernetes cluster, the `svc/merger-v1` is a ClusterIP service load balancing request across all registered and ready merger pods.
    relayer-merger-addr: "dns:///merger-v1:9000"
    relayer-grpc-listen-addr: :9000
    # Each mindreader is specified independently, we do not want to load balance here, we want to connect to each of them individually
    # The `dns` syntax works as long as the DNS is setup correctly and that a A record exists for the specified entry. You might need to
    # adjust the names here based on your setup.
    #
    # In our Kubernetes cluster, on the `eth-mainnet` namespace, your DNS is configured to search for `eth-mainnet.svc.cluster.local`
    # sub domains and `dig A mindreader-v1-0.mindreader-v1.eth-mainnet.svc.cluster.local` shows up the correct IP to reach the pod.
    relayer-source: "dns:///mindreader-v1-0.mindreader-v1:9000,dns:///mindreader-v1-1.mindreader-v1:9000"
{{< /highlight >}}

#### Firehose

The `firehose` is the "user-facing" service that is serving all Firehose requests, consuming merged blocks for historical requests from the data storage location directly and live blocks from the `relayer` (itself connected to one or more `mindreader`instances) for live blocks.

###### `sts/firehose-v1`

{{< highlight yaml >}}
# firehose.yaml
start:
  args:
  - firehose
  flags:
    log-format: json
    log-to-file: false
    # Enables local cache layers for block data retrieved from the merged blocks data store. This setting should be used
    # to drastically increase the theorical maximum parallel requests `firehose` component without consuming an insane amount
    # of memory. We say theorically because it
    common-atm-cache-enabled: true
    # Persistent disk where cached blocks are stored, should be double the size of the `common-atm-max-recent-entry-bytes` config
    # value. You should use
    common-atm-cache-dir: /data
    common-atm-max-recent-entry-bytes: 4294967296
    common-atm-max-entry-by-age-bytes: 4294967296
    # Load balanced endpoint where to reach the relayer-v1 service. The `dns` schema works as long as the DNS is setup correctly and that
    # a A record exists for the specified entry. You might need to adjust the names here based on your setup.
    #
    # In our Kubernetes cluster, the `svc/relayer-v1` is a ClusterIP service load balancing request across all registered and ready merger pods.
    common-blockstream-addr: dns:///relayer-v1:9000
    # Optional dependency to speed up Firehose start up, must be defined to `""` to be ignored internally.
    common-blockmeta-addr: ""
    # When Ctrl-C is received to stop the component, the component is marked unhealthy and 30s graceful period is waited for proper orchestration in K8S and others
    common-system-shutdown-signal-delay: 30s
    firehose-blocks-store-urls: "gs://acme-blocks/eth-name-here/v1"
    # Host and port where Firehose will listen for incoming gRPC requests. The `*` at the end is used to listen over a TLS
    # connection (but the certificate itself is insecure because it's a snakeoil SSL certificate with the private key publicly
    # available to everyone at https://github.com/streamingfast/dgrpc/blob/develop/insecure/insecure.go#L59).
    #
    # If the `*` is omitted, Firehose is going to listen over a plain text connection instead.
    #
    # For proper SSL termination, you must use an external load balancer for now now that will do the SSL termination
    # and will forward traffic through the service.
    firehose-grpc-listen-addr: :9000*
{{< /highlight >}}

{{< alert type="note" >}}
It's possible to have a Firehose only for historical blocks, just use the empty string `""` for the live source:

{{< highlight yaml >}}
common-blockstream-addr: ""
{{< /highlight >}}
{{< /alert >}}

#### Routing

Here the list of routing paths and to which service they should point to. Each service hostname used here should load balance internally to all replicas of the given component.

- `/sf.firehose.v1.Stream/*` forwards gRPC (through HTTP2 protocol) traffic to `firehose-v1:9000`
- `/grpc.reflection.v1alpha.ServerReflection/* ` forwards gRPC (through HTTP2 protocol) traffic to `firehose-v1:9000`

{{< alert type="note" >}}
Adjust the port fit your actual deployment. The port shown here are the defaults one used in this section.
{{< /alert >}}

#### Sample Pods

<!-- Move this to a dedicated Kubernetes section when we have one -->

This is a sample Kubernetes deployment for Ethereum Mainnet:
 * Pods (containers) ending with `-XYXYX` are stateless
 * Those ending with `-0`, then `-1`, etc.. are stateful, potentially have an SSD associated, or are processes that we do not want more than one to be running at any given time.

{{< highlight bash >}}
$ kubectl get pods
NAME                                   READY   STATUS    RESTARTS   AGE
firehose-v1-0                          1/1     Running   0          5d5h
firehose-v1-1                          1/1     Running   0          5d5h
merger-v1-0                            1/1     Running   0          19d
mindreader-v1-0                        1/1     Running   0          32d
mindreader-v1-1                        1/1     Running   0          32d
relayer-v1-7d4bcb46bb-k52xs            1/1     Running   0          19d
relayer-v1-7d4bcb46bb-p6j54            1/1     Running   0          19d
{{< /highlight >}}

{{< alert type="note" >}}
* There is a single `merger`, which can go offline for some time. It produces merged blocks files once each 100 blocks anyway, and all processes have an internal memory with a segment of the head down to the last merged block. You don't want to keep your `merger` out for too long, because it will put RAM pressure on other systems that wait for a merged block before purging their internal memory for the segment of the chain.
{{< /alert >}}
