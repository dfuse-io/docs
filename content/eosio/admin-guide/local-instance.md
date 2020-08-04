---
weight: 50
title: Running a Local Instance
---

{{< alert type="note" >}}
The **goal of this page** is to help you launcher `dfuse for EOSIO` as quickly as possible, on your local machine.
{{< /alert >}}


<!-- TODO: complete these things:
// What you get with this. Limitations of a laptop-style deploy.
// What are the other deployment methods. Why you would choose other methods -->

1. Initialize a new `dfuse.yaml` file in the current working directory:

{{< highlight sh >}}
dfuseeos init
{{< /highlight >}}

2. Optionally copy over a boot sequence to have dfuse bootstraps your chain with accounts, system contracts to have a chain ready for development in matter of seconds:

{{< highlight sh >}}
wget -O bootseq.yaml https://raw.githubusercontent.com/dfuse-io/dfuse-eosio/develop/booter/examples/bootseq.dev.yaml
{{< /highlight >}}

**Note** Check [booter/examples](./booter/examples) for other boot sequence templates.

3. Boot your instance with:

{{< highlight sh >}}
dfuseeos start
{{< /highlight >}}

4. A terminal prompt will list the graphical interfaces with their relevant links:

{{< highlight sh >}}
Dashboard: http://localhost:8081
Explorer & APIs:  http://localhost:8080
GraphiQL:         http://localhost:8080/graphiql
{{< /highlight >}}

In this mode, two nodeos instances will now be running on your machine, a block producer node and a mindreader node, and the dfuse services should be ready in a matter of seconds.

### Limitations

EOSIO networks can grow substantially.  Running that on a laptop for a long period of time isn't sustainable.  Also, databases written with default values (for key value stores notably) can not be re-used for long-running deployments.

For a long-running instances, please refer to [long-running deployments]({{< ref "./long-running-deployment">}}) documentation.
