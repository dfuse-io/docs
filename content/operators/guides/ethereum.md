---
weight: 10
title: Ethereum
showH2InSideNav: true
---

In this guide, we'll show you how to use [Firehose](/operators/concepts/) to sync and stream Ethereum Mainnet.

## Installing Instrumented Geth Binary

The first step is to install, a StreamingFast Instrumented version of Geth. [Geth](https://github.com/ethereum/go-ethereum) is the official Golang
implementation of the Ethereum Protocol. We have instrumented Geth to have the ability to extract the
raw blockchain data from the node. The instrumented version source code can be found [here](https://github.com/streamingfast/go-ethereum).

Download the latest release of [Geth for Ethereum networks](https://github.com/streamingfast/go-ethereum/releases?q=geth-&expanded=true) You will find a `linux` and `mac` version

The releases for Other supported EVM chains can be found here:
- [Polygon](https://github.com/streamingfast/go-ethereum/releases?q=polygon-&expanded=true)
- [BSC](https://github.com/streamingfast/go-ethereum/releases?q=bsc-&expanded=true)

Once your binary downloaded you must make them into an executable

```bash
chmod +x geth_linux
```

To verify the installation was successfully, run

```bash
geth_linux version
```

You should see an output that contains

```bash
Geth
Version: 1.10.16-dm-stable
...
```

It is important to note that you may have a different version then `1.10.16`. The important thing is the `dm` in the version name. `dm` stands for DeepMind and denotes our instrumented version of Geth.

{{< alert type="important" >}}
If you are on Mac OS X you could see a warning saying the binary is not signed, or it could actually do nothing at all when ran from your terminal. To fix the problem, remove the quarantine attribute on the flile using the following command against the binary:

```bash
xattr -d com.apple.quarantine geth_mac
```

That is needed only once.
{{< /alert >}}

## Installing Ethereum on StreamingFast a.k.a sfeth

`sfeth` us an application that runs a few small, isolated processes, that together form the Firehose stack. You can deep dive into the different processes and how the data flows from one to the other in [Concepts & Architecture]({{< ref "/operators/concepts" >}}). Needless to say this you must run `sfeth` to run a Firehose locally.


You can download the latest version of [`sfeth` here](https://github.com/streamingfast/sf-ethereum/releases/latest)

Once downloaded you must untar the bundle

```bash
tar -xvzf sf-ethereum_0.9.0_linux_x86_64.tar.gz
```

To verify the installation was successful, run

```bash
sfeth --version
```

{{< alert type="important" >}}
If you are on Mac OS X you could see a warning saying the binary is not signed, or it could actually do nothing at all when ran from your terminal. To fix the problem, remove the quarantine attribute on the flile using the following command against the binary:

```bash
xattr -d com.apple.quarantine sfeth
```

That is needed only once.
{{< /alert >}}

Great! At this point we have installed our instrumented `Geth` application as well as our `sfeth` application. In the following steps we will setup configuration files so that you can start syncing & running a Ethereum Mainnet Firehose!

## Set up your configuration files

We will start off by creating a working directory where we will copy our 2 binaries that we have setup on the prior steps

```bash
mkdir sf-firehose
cp <path-to-binary>/geth_linux ./sf-firehose/geth_linux
cp <path-to-binary>/sfeth ./sf-firehose/sfeth
```

*note* All future commands should be run inside the working directory we just created

We are going to create a configuration file that will help us setup `sfeth`. Copy the following content to an `eth-mainnet.yaml` file in your working directory
```yaml
start:
  args:
  - mindreader-node
  flags:
    verbose: 2
    data-dir: eth-data
    log-to-file: false
    common-chain-id: "1"
    common-network-id: "1"
    mindreader-node-path: ./geth_linux
    # You can tweaks command line arguments like syncing with Ropsten, like in the
    # example below (don't forget to update `data-dir`, `common-chain-id` and `common-chain-id`)
    # mindreader-node-arguments: "+--ropsten"
    mindreader-node-merge-and-store-directly: true

    # Once fully live with chain, those should be removed, they are used so that Firehose serves
    # blocks even if the chain is not live yet.
    firehose-realtime-tolerance: 999999999s
    relayer-max-source-latency: 999999999s
```

In the above configuration file you will notice a line that says `mindreader-node-path: ./geth_linux`. This configuration specifies the path of the `geth` binary we downloaded
in step 1, We will go through the individual configs shortly.

## Running and syncing Ethereum Mainnet

Launch `sfeth` to start indexing the chain.

```bash
./sfeth -c eth-mainnet.yaml start mindreader-node
```

You should start seeing logs similar to this:
```bash
2022-02-17T08:40:49.807-0500 (api) registering development exporters from environment variables (dtracing/api.go:139)
2022-02-17T08:40:49.809-0500 (mindreader-node) creating operator (operator/operator.go:81) {"options": {"Bootstrapper":null,"EnableSupervisorMonitoring":true,"ShutdownDelay":0}}
2022-02-17T08:40:49.810-0500 (dfuse) launching app (launcher/launcher.go:110) {"app": "mindreader-node"}
2022-02-17T08:40:50.816-0500 (mindreader-node) creating new command instance and launch read loop (superviser/superviser.go:160) {"binary": "./geth_linux", "arguments": ["--networkid=1", "--datadir=/Users/julien/codebase/sf/firehose-test/eth-data/mindreader/data", "--ipcpath=/Users/julien/codebase/sf/firehose-test/eth-data/mindreader/ipc", "--port=30305", "--http", "--http.api=eth,net,web3", "--http.port=8547", "--http.addr=0.0.0.0", "--http.vhosts=*", "--firehose-deep-mind"]}
2022-02-17T08:40:50.816-0500 (mindreader-node) starting consume flow (mindreader/mindreader.go:252)
2022-02-17T08:40:50.816-0500 (mindreader-node) starting one block(s) uploads (mindreader/archiver_selector.go:343)
2022-02-17T08:40:50.820-0500 (mindreader-node) successfully start service (operator/operator.go:425)
2022-02-17T08:40:50.820-0500 (mindreader-node) operator ready to receive commands (operator/operator.go:138)
2022-02-17T08:40:50.820-0500 (mindreader-node) starting merged blocks(s) uploads (mindreader/archiver_selector.go:345)
2022-02-17T08:40:50.892-0500 (mindreader-node) INFO [02-17|08:40:50.892] Initializing deep mind  (log_plugin/to_zap_log_plugin.go:131)
2022-02-17T08:40:50.892-0500 (mindreader-node) INFO [02-17|08:40:50.892] Deep mind initialized                    enabled=true sync_instrumentation_enabled=true mining_enabled=false block_progress_enabled=false compaction_disabled=false archive_blocks_to_keep=0 (log_plugin/to_zap_log_plugin.go:131)
2022-02-17T08:40:50.894-0500 (mindreader-node) INFO [02-17|08:40:50.894] Maximum peer count                       ETH=50 LES=0 total=50 (log_plugin/to_zap_log_plugin.go:131)
2022-02-17T08:40:50.896-0500 (mindreader-node) INFO [02-17|08:40:50.896] Set global gas cap                       cap=50,000,000 (log_plugin/to_zap_log_plugin.go:131)
2022-02-17T08:40:50.896-0500 (mindreader-node) INFO [02-17|08:40:50.896] Allocated trie memory caches             clean=154.00MiB dirty=256.00MiB (log_plugin/to_zap_log_plugin.go:131)
2022-02-17T08:40:50.896-0500 (mindreader-node) INFO [02-17|08:40:50.896] Allocated cache and file handles         database=/Users/julien/codebase/sf/firehose-test/eth-data/mindreader/data/geth/chaindata cache=512.00MiB handles=5120 (log_plugin/to_zap_log_plugin.go:131)
2022-02-17T08:41:45.834-0500 (consolereader) mindreader block stats (codec/consolereader.go:76) {"block_num": 1, "duration": 1467834, "stats": {"balance_change":1,"created_account":1,"finalize_block":1}}
2022-02-17T08:41:45.836-0500 (consolereader) mindreader block stats (codec/consolereader.go:76) {"block_num": 2, "duration": 196333, "stats": {"balance_change":1,"created_account":1,"finalize_block":1}}
...
```

After a short delay, you should start to see the blocks syncing in. Once you have synced 100,000 blocks, you can run the following command in a separate terminal to introspects the block data
```bash
./sfeth tools print blocks --store ./eth-data/storage/merged-blocks 100000
```

{{< alert type="important" >}}
At any point in time you can stop the process with `Ctrl + C`. The process will shutdown gracefully and on restart it will continue where it left off.
{{< /alert >}}

## Overview and Explanation

As mentioned earlier `sfeth` Is an application that runs a few small, isolated processes.

```bash
./sfeth -c eth-mainnet.yaml start mindreader-node
```

The command above runs the `mindreader-node` process and supplies the config file `eth-mainet.yml`.

Let's walk through the different flags in our `eth-mainnet.yaml` configuration file

- `verbose: 2` : Sets the verbosity of the application
- `data-dir: eth-data` : Specifies the path where `sfeth` will store all data for all sub processes
- `common-chain-id: "1"` :  ETH chain ID (from EIP-155) as returned from JSON-RPC 'eth_chainId' call
- `common-network-id: "1"` : ETH network ID as returned from JSON-RPC 'net_version' call
- `mindreader-node-path: ./geth_linux` : Path to the Geth binary
- `mindreader-node-merge-and-store-directly: true` : Indicates to the `mindreader-node` to skip writing individual one block files and merge the block data into 100-blocks merged files
- `firehose-realtime-tolerance: 999999999s` : Block time delay that is used to determine if the data is realtime. While synching from block 0 we want these to be massive. Once the chain is fully synced we can remove this flag
- `relayer-max-source-latency: 999999999s` : Block time delay that is used to determine if the data is realtime. While synching from block 0 we want these to be massive. Once the chain is fully synced we can remove this flag

The `mindreader-node` is a process that runs and manages the `blockchain` node `Geth`. It consumes the blockchain data that is extracted from our instrumented `Geth` node. The instrumented Geth node outputs individual block data.
The `mindreader-node` process will either write individual block data into separate files called one-block files or merge 100 blocks data together and write into a file called 100-block file.

This behaviour is configurable with the  `mindreader-node-merge-and-store-directly` flag.
When running the `mindreader-node` process with `mindreader-node-merge-and-store-directly` flag enable, we say the "mindreader is running in merged mode". When the flag is disabled, we will refer to the mindreader as running in its normal mode of operation.

In the scenario where the `mindreader-node` process stores one-block files. We can run a `merger` process on the side which would merge the one-block files into 100-block files. When we are syncing the chain we will run the `mindreader-node` process in merged mode.
When we are synced we will run the `mindreader-node` in it's regular mode of operation (storing one-block files)

The one-block files and 100-block files will be store in `data-dir/storage/merged-blocks` and  `data-dir/storage/one-blocks` respectively. The naming convention of the file is the number of the first block in the file.

Lastly, we have built tools that allows your to introspec the block files:

```bash
./sfeth tools print blocks --store ./eth-data/storage/merged-blocks 100000
```

```bash
./sfeth tools print one-block --store ./eth-data/storage/one-blocks 100000
```

## Launching And Testing Firehose

The current state of affairs is that we have an `sfeth` running a `mindreader-node` process. The process is extract and merging 100-bock data. While still running the `mindreader-node` process in a separate terminal (still in the working directory) launch the firehose

```bash
./sfeth -c eth-mainnet.yaml start relayer firehose
```

The `sfeth` command launches 2 processes the `relayer` and `firehose` both processes work together to provide the Firehose data stream. Once the firehose process is running, it will be listenning on port `13042`. At it's core the `firehose` is a gRPC stream. We can list the available gRPC service

```bash
grpcurl -plaintext localhost:13042 list
```

We can start streaming blocks with `sf.firehose.v1.Stream` Service:

```bash
grpcurl -plaintext -d '{"start_block_num": 10}' localhost:13042 sf.firehose.v1.Stream.Blocks
```

You should see block streaming. Like so

```json
{
  "block": {
    "@type": "type.googleapis.com/sf.ethereum.codec.v1.Block",
    "balanceChanges": [
      {
        "address": "KJIeTiydhPTA8MDOuZH0V1Gg/pM=",
        "oldValue": {
          "bytes": "M//VkvdcOeAA"
        },
        "newValue": {
          "bytes": "NEU5JHmhLeAA"
        },
        "reason": "REASON_REWARD_MINE_BLOCK"
      }
    ],
    "hash": "rWCqFYquYxvCh1Iy3w4OPNjtdRWloidwH+aAy7Cp6I8=",
    "header": {
      "parentHash": "2UDI+9iNUQ6fR13LTotFhgw9tYW3AP7gIjSNAIo/MWg=",
      "uncleHash": "HcxN6N7HXXqrhbVntszUGtMSRRuUinQT8KFC/UDUk0c=",
      "coi^Cnbase": "KJIeTiydhPTA8MDOuZH0V1Gg/pM=",
      "stateRoot": "RSVmg4SxOM9mawD5Z4isp+mRTPmb+gxfAmNu00UBEog=",
      "transactionsRoot": "VugfFxvMVab/g0XmksD4bltI4BuZbK3AAWIvteNjtCE=",
      "receiptRoot": "VugfFxvMVab/g0XmksD4bltI4BuZbK3AAWIvteNjtCE=",
      "logsBloom": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==",
      "difficulty": {
        "bytes": "CDbKnao="
      },
      "number": "1488",
      "gasLimit": "5000",
      "timestamp": "2015-07-30T16:20:30Z",
      "extraData": "R2V0aC92MS4wLjAvbGludXgvZ28xLjQuMg==",
      "mixHash": "zMVn27pvcFYbAQsBJNFNjsQCIOV03Wv5s2z6QBuIV5c=",
      "nonce": "8306990282153570439",
      "hash": "rWCqFYquYxvCh1Iy3w4OPNjtdRWloidwH+aAy7Cp6I8="
    },
    "number": "1488",
    "size": "539",
    "ver": 1
  },
  "step": "STEP_NEW",
  "cursor": "CFAZVtrTEjPGpZJWNJE2h6WwLpcyB15nXQG0fhdB1Nr39XqUjMigA2AnOx_Yl6zy3he_HVr53orORypzp5RXudDvkr017yM_QXstxdzo87S8KqHyaANOebM0VeuMat_RXT_eZw3_frMD5tSzMqWPbkI1NsEgL2exiWwBotRdc6ESu3E0xD71c8aE0amR8oJA-LNxRbepkymgBzZ8fx0Maw=="
}
```

## What's next

