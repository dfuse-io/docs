---
weight: 10
title: Authentication
---

If you're working with the _dfuse Cloud_ service, take a look at
the [Authentication](/platform/dfuse-cloud/authentication/) page in the [dfuse Platform &mdash; dfuse Cloud](/platform/dfuse-cloud/)
section for more information about authenticating with dfuse.

## REST Authentication - EOSIO specific

To authenticate REST requests, specify an `Authorization: Bearer [JWT token]` header in the HTTP request. See {{< external-link title="more details" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization" >}}

{{< tabs "rest-auth" >}}
{{< tab title="curl" lang="bash" >}}
curl -H "Authorization: Bearer YOURTOKENHERE" -u https://testnet.eos.dfuse.io/v0/state/... [ ... ]
{{< /tab >}}
{{< tab title="eosc" lang="bash" >}}
eosc -H "Authorization: Bearer YOURTOKENHERE" -u https://testnet.eos.dfuse.io [ ... ]
{{< /tab >}}
{{< /tabs >}}

Don't forget to replace the token in the above command with a valid JWT, retrieved using [`/v1/auth/issue`](#obtaining-a-short-lived-jwt)

## WebSocket Authentication - EOSIO specific

This example uses the <https://github.com/hashrocket/ws> command-line WebSocket program. To authenticate with query string, use this code:

{{< tabs "websocket-auth" >}}
{{< tab lang="shell" >}}
ws wss://testnet.eos.dfuse.io/v1/stream?token=YOURTOKENHERE
{{< /tab >}}
{{< /tabs >}}

With browser-based WebSocket connections, it is not possible to specify additional headers. In this situation, pass your JWT as the `token` query string parameter.

You can pass the `token` query string parameter to authenticate REST or WebSocket requests.

### The `Origin` Header

The `Origin` header is currently not mandatory on websocket connections.

It will, however, become mandatory at a later date, but only for `web_` keys. It will then need to match the origin that you registered along with your API key identity. In a web environment, this is usually added automatically from the client's browser without requiring extra work.
