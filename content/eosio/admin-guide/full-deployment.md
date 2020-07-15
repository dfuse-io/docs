---
pageTitle: Large-scale Highly Available Deployment
weight: 90
---

{{< alert type="note" >}}
The **goal of this page** is to give you an idea of what a highly available, and scaled out setup looks like. The example given here is based on a basic understanding of Kubernetes and/or containerized deployment.
{{< /alert >}}

The premise here is:

* Each component is decoupled as an independent microservice, and is scaled separately.
* This is a sample Kubernetes deployment for Kylin:
  * Pods (containers) ending with `-XYXYX` are stateless
  * Those ending with `-0`, then `-1`, etc.. are stateful, potentially have an SSD associated, or are processes that we do not want more than one to be running at any given time.


{{< highlight bash >}}
$ kubectl get pods
NAME                                         READY   STATUS
abicodec-v3-6c74fc64df-c6t56                 1/1     Running
abicodec-v3-6c74fc64df-kqqx4                 1/1     Running
blockmeta-v3-568bf46696-n2vmz                1/1     Running
blockmeta-v3-568bf46696-xjvns                1/1     Running
devproxy-v3-8656f9dfb9-4srrd                 1/1     Running
dgraphql-v3-c76c679c9-675db                  1/1     Running
dgraphql-v3-c76c679c9-9p795                  1/1     Running
eosq-v3-6454d75f5d-rdhwb                     1/1     Running
eosq-v3-6454d75f5d-zn2dk                     1/1     Running
eosrest-v3-74d96dc95-ppq47                   1/1     Running
eosrest-v3-74d96dc95-xldt8                   1/1     Running
eosws-v3-5db85bb974-w66gk                    1/1     Running
eosws-v3-5db85bb974-z7mbt                    1/1     Running
fluxdb-inject-v3-0                           1/1     Running
fluxdb-server-v3-5d647cc4fc-584ps            1/1     Running
fluxdb-server-v3-5d647cc4fc-zsxq5            1/1     Running
merger-v3-0                                  1/1     Running
mindreader-v3-0                              1/1     Running
mindreader-v3-1                              1/1     Running
peering-0                                    1/2     Running
peering-1                                    2/2     Running
relayer-v3-6f77d64fb8-gx4kf                  1/1     Running
relayer-v3-6f77d64fb8-tb5mp                  1/1     Running
search-v3-d0-forkresolver-7457cf86c8-tr7jq   1/1     Running
search-v3-d0-hybrid-758d7c498b-gfn8v         1/1     Running
search-v3-d0-hybrid-758d7c498b-kvhqc         1/1     Running
search-v3-d0-indexer-50-0                    1/1     Running
search-v3-d0-indexer-5000-0                  1/1     Running
search-v3-d0-router-7f85db9ff6-cnp9p         1/1     Running
search-v3-d0-router-7f85db9ff6-kjqdd         1/1     Running
search-v3-d0-t10-0-106m4-50000-0             1/1     Running
search-v3-d0-t10-0-106m4-50000-1             1/1     Running
search-v3-d0-t20-106m4-head-5000-0           1/1     Running
search-v3-d0-t20-106m4-head-5000-1           1/1     Running
search-v3-memcache-cb98db48-57q6k            1/1     Running
tokenmeta-v3-0                               1/1     Running
tokenmeta-v3-1                               1/1     Running
trxdb-loader-v3-b9d67d857-n2vsl              1/1     Running
{{< /highlight >}}

NOTE:

* Not shown here is a small `etcd` cluster, deployed through the `etcd-operator`.  See [search-etcd component]({{< ref "./components" >}}#search-etcd) for more details.
* The single `fluxdb-inject`.  The individual `fluxdb-server`s will sustain a crash/restart of `fluxdb-inject` because they themselves are fed with block data, and will cover the gap between what `inject` has written, and the HEAD of the chain.
* Structure in the `search-v3` section:
  * `d0` means the revision of the _data_, if we index new things or remove things from our indexes, we'll roll out a new series of pods, which can run the same revision of the software (`v3`), but with new data. We often can mix data revisions in the same deployment for some time, so the upgrade path is more seamless.
  * `t10` and `t20` are the search tiers, they are all registered in `dmesh` (which in this case lives in another Kubernetes namespace)`, and cover different chain segments.
    * here `t10` is a fixed size tier, with blocks ranging from 0 to 106M, it is not written to (no moving head), and consumes `50000` blocks indexes. No live indexer of `50000` is necessary in this situation, provided they were all processed before and exist in the _search indexes object store_ already.
    * `t20` is a tier with a moving head, with indexes 5000 blocks in size, meaning it will keep watching for new indexes produced by the `indexer-5000`, with blocks ranging from 106M to the current chain head.
* There is a single `merger`, which can go offline for some time. It produces merged blocks files once each 100 blocks anyway, and all processes have an internal memory with a segment of the head down to the last merged block. You don't want to keep your `merger` for too long, because it will put RAM pressure on other systems that wait for a merged block before purging their internal memory for the segment of the chain in th
