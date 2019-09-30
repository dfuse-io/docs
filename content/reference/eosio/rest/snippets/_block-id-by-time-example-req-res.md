---
---

{{< tabs "example-req-res" >}}
{{< tab lang="shell" title="Request" >}}
curl -H "Authorization: Bearer $TOKEN" \
  "https://mainnet.eos.dfuse.io/v0/block_id/by_time?time=2019-03-04T10:36:14.5Z&comparator=gte"
{{< /tab >}}

{{< tab lang="json" title="Response" >}}
{
  "block": {
    "id": "02bb43ae0d74a228f021f598b552ffb1f8d2de2c29a8ea16a897d643e1d62d62",
    "num": 45826990,
    "time": "2019-03-04T10:36:15Z"
  }
}
{{< /tab >}}
{{< /tabs >}}