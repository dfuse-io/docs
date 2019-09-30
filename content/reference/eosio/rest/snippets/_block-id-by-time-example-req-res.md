---
---

{{< tabs "example-req" >}}

{{< tab lang="shell" title="Shell" >}}
curl -H "Authorization: Bearer web_abcdef12345678900000000000" \
  "https://mainnet.eos.dfuse.io/v0/block_id/by_time?time=2019-03-04T10:36:14.5Z&comparator=gte"
{{< /tab >}}

{{< tab lang="javascript" title="Javascript" >}}
fetch('https://mainnet.eos.dfuse.io/v0/block_id/by_time?time=2019-03-04T10:36:14.5Z&comparator=gte', {
  headers: {
    'Authorization': 'Bearer web_abcdef12345678900000000000'
  }
}).then(console.log)
{{< /tab >}}

{{< tab lang="python" title="Python" >}}
headers = { 'Authorization' : 'Token web_abcdef12345678900000000000' }
r = requests.get('https://address.of.opengear/api/v1/serialPorts/', headers=headers, verify=False)
j = json.loads(r.text)
print(json.dumps(j, indent=4))
{{< /tab >}}

{{< tab lang="go" title="Go" >}}
req, err := http.NewRequest("GET", "https://mainnet.eos.dfuse.io/v0/block_id/by_time?time=2019-03-04T10:36:14.5Z&comparator=gte", nil)
if err != nil {
	// handle err
}
req.Header.Set("Authorization", "Bearer web_abcdef12345678900000000000")

resp, err := http.DefaultClient.Do(req)
if err != nil {
	// handle err
}
defer resp.Body.Close()
{{< /tab >}}

{{< /tabs >}}


{{< tabs "example-res" >}}
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