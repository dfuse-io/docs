---
weight: 1
title: Work with your free Account
---
{{< row-wrapper >}}
{{< sub-section-title title="How to Work with your Free dfuse Account" protocol="ETH" >}}
## 1. Create a free dfuse account

Visit {{< externalLink href="https://app.dfuse.io">}} to create an account.

## 2. Create an api key

Visit {{< externalLink href="https://app.dfuse.io/keys">}} to create your first api key.

![](/img/api_key_creation.png)

To create a new API key for your application:

* API Key Name: Used to identify your key in the portal. It should refer to your application.
* Category:
  - Web: You want to embed your API key in the client-side of a web application. Specify your website as the origin {{< externalLink title="as it will appear in the HTTP header" href="https://tools.ietf.org/html/rfc6454#section-7">}}
  - Mobile: You want to embed your API key in a mobile application deployed on an app store.
  - Server: You want to connect your server backend directly with our service.

## 3. Obtaining a Short-Lived JWT

Once you have this API key, call the [`https://auth.dfuse.io/v1/auth/issue` endpoint](#post-v1-auth-issue) to obtain a fresh authentication token using the following command. **Do not forget to replace the API key by your own!**

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

## 4. What's next? 

* [Review Authentication Guide]({{< ref "/guides/core-concepts/authentication" >}})

{{< row-wrapper-end >}}
