---
weight: 1
---

# How to Work with your Free dfuse Account

## Create a free dfuse account
Visite [https://app.dfuse.io](https://app.dfuse.io)

Meat here

## Create an api key
Visite [https://app.dfuse.io/keys](https://app.dfuse.io/keys)

Meat here 

## Obtaining a Short-Lived JWT

Once you have this API key, call the [`https://auth.dfuse.io/v1/auth/issue` endpoint](#post-v1-auth-issue) to obtain a fresh Authentication Token using the following command. **Do not forget to replace the API key by your own!**

{{< tabs "issuing-long-jwt">}}
{{< tab title="Request" lang="shell" >}}
curl https://auth.dfuse.io/v1/auth/issue -s --data-binary '{"api_key":"web_abcdef12345678900000000000"}'
{{< /tab >}}

{{< tab title="Response" lang="json" >}}
{       
  "token":"eyJhbGciOiJLTVNFUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NTYxMzI4MjAsImp0aSI6IjQwNWVmOTUxLTAwZTYtNGJmNC1hZWMxLTU0NTU1ZWMzMTUwMiIsImlhdCI6MTU1NjA0NjQyMCwiaXNzIjoiZGZ1c2UuaW8iLCJzdWIiOiJ1aWQ6MHdlbnU2NmUwNzU4OWRhODY4MWNlIiwiYWtpIjoiM2NhYWEzYzA3M2FlZjVkMmYxOGUwNjJmZDkzYzg3YzMzYWIxYzA1YzEzNjI3NjU2OTgzN2Y5NDc5NzZlMjM0YSIsInRpZXIiOiJmcmVlLXYxIiwic3RibGsiOi0zNjAwLCJ2IjoxfQ.000HeTujIuS_LRvvPN6ZRCmtoZqZyV6P1enNBviwK8v7Tf7BLHJIrEpQoEREKSIMdZWPrMQl_OE55yJP0MxUDA",
  "expires_at":1556132820
}
{{< /tab >}}
{{< /tabs >}}
### See our complete Authentication Guide [here]({{< ref "/guides/core-concepts/authentication" >}})