# Authentication

There are two sorts of keys in the dfuse ecosystem:

* A long-lived API key, which looks like `server_abcdef123123123000000000000000000`, used to get short-lived JWT.

* A short-lived JWT, used to do any call on the dfuse Platform, which looks like: `eyJhbGciOiJLTVNFUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NTYxMzI4MjAsImp0aSI6IjQwNWVmOTUxLTAwZTYtNGJmNC1hZWMxLTU0NTU1ZWMzMTUwMiIsImlhdCI6MTU1NjA0NjQyMCwiaXNzIjoiZGZ1c2UuaW8iLCJzdWIiOiJ1aWQ6MHdlbnU2NmUwNzU4OWRhODY4MWNlIiwiYWtpIjoiM2NhYWEzYzA3M2FlZjVkMmYxOGUwNjJmZDkzYzg3YzMzYWIxYzA1YzEzNjI3NjU2OTgzN2Y5NDc5NzZlMjM0YSIsInRpZXIiOiJmcmVlLXYxIiwic3RibGsiOi0zNjAwLCJ2IjoxfQ.000HeTujIuS_LRvvPN6ZRCmtoZqZyV6P1enNBviwK8v7Tf7BLHJIrEpQoEREKSIMdZWPrMQl_OE55yJP0MxUDA`

## Issuing a Short-Lived JWT

> Generate a short-lived JTW from your API key (Do not forget to replace the API key by your own.)

{{< highlight shell >}}
$ curl https://auth.dfuse.io/v1/auth/issue \
       -s --data-binary '{"api_key":"web_abcdef12345678900000000000"}'
{{< /highlight >}}

If you haven't already, head out to our
[self-service API management portal](https://app.dfuse.io), sign up
and create a long-term API key.

Once you have this API key, call the
[`https://auth.dfuse.io/v1/auth/issue` endpoint](#post-v1-auth-issue)
to get a fresh Authentication Token (JWT).

See <a href="https://jwt.io/introduction/" target="_blank">https://jwt.io/introduction/</a> to learn more about JWTs.

By default, each JWT is **valid for a period of 24 hours**. Make sure
you cache those values to avoid hitting rate limiting on JWT issuance.

## Lifecycle of Short-Lived JWTs

> Sample response from `/v1/auth/issue`

{{< highlight json >}}
{
  "token":"eyJhbGciOiJLTVNFUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NTYxMzI4MjAsImp0aSI6IjQwNWVmOTUxLTAwZTYtNGJmNC1hZWMxLTU0NTU1ZWMzMTUwMiIsImlhdCI6MTU1NjA0NjQyMCwiaXNzIjoiZGZ1c2UuaW8iLCJzdWIiOiJ1aWQ6MHdlbnU2NmUwNzU4OWRhODY4MWNlIiwiYWtpIjoiM2NhYWEzYzA3M2FlZjVkMmYxOGUwNjJmZDkzYzg3YzMzYWIxYzA1YzEzNjI3NjU2OTgzN2Y5NDc5NzZlMjM0YSIsInRpZXIiOiJmcmVlLXYxIiwic3RibGsiOi0zNjAwLCJ2IjoxfQ.000HeTujIuS_LRvvPN6ZRCmtoZqZyV6P1enNBviwK8v7Tf7BLHJIrEpQoEREKSIMdZWPrMQl_OE55yJP0MxUDA",
  "expires_at":1556132820
}
{{< /highlight >}}

The best way to handle each JWT's lifecycle is, before doing calls to _dfuse_:

* Get JWT + Expiration time from cache (localStorage, disk, etc..)
* If token is expired, is near expiration or is absent from cache, fetch a new token through `/v1/auth/issue`, and cache the response.
* Call _dfuse_ with a JWT token.

Each time you get a fresh JWT, you get the expiration and the token itself.

Once a connection is established using a JWT, it will *not* be shutdown, even though the JWT expires during the session.

## Key Types & Rate Limiting

There are 3 api key types: `mobile`, `web` and `server`. The type is the first part of the key.

Each key time has different rate limiting characteristics, to prevent abuse - similar to Google Maps' (and other) APIs. Pick your API key type according to your usage pattern.

* `server`: rate limits _JWT issuance_ aggressively; low number of IPs; accepts large number of calls per IP.
* `mobile`: adapts rate limits _JWT issuance_ to normal growth of new users, eventually manageable by yourself; large number of IPs; rate limits the number of calls per IP.
* `web`: adapts rate limits _JWT issuance_ to normal growth, eventually manageable by yourself; enforces `Origin`; each JWT is limited to a tiny amount of IPs; heavily rate limits the number of calls per IP.

You can safely publish `web` and `mobile` keys inside your mobile app or web application.

## REST Authentication

> Pass `Bearer` token in the `Authorization` header

{{< highlight shell >}}
eosc -H "Authorization: Bearer eyJ...YOURTOKENHERE..." -u https://mainnet.eos.dfuse.io [ ... ]
{{< /highlight >}}

Specify the `Authorization: Bearer [token]` header in the HTTP request. See [more details](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization).

Replace `[token]` by a valid JWT, retrieved using [`/v1/auth/issue`](#post-v1-auth-issue)

## WebSocket Authentication

> This example uses the [https://github.com/hashrocket/ws](https://github.com/hashrocket/ws) command-line WebSocket program.
> To authenticate with query string, use this code:

{{< highlight shell >}}
ws -o https://b2b.dfuse.io wss://mainnet.eos.dfuse.io/v1/stream?token=eyJ..YOURTOKENHERE...
{{< /highlight >}}

With browser-based WebSocket connections, it is not possible to specify additional headers. In this situation, pass your JWT as the `token` query string parameter.

You can pass the `token` query string parameter to authenticate REST or WebSocket requests.

### The `Origin` Header

When the `Origin` header is present in a WebSocket connection, it it must match the `origin` provided in your API header key.

An `Origin` HTTP request header (ex. `Origin: https://yourcompany.com`) is **mandatory** when initiating a WebSocket connection to our endpoints. A `403` error being returned when not present. Expect that `Origin` header requirement will start to be enforced as we transition from the initial Beta phase to General Availability in the near future. As the `Origin` header becomes enforced, it will need to match the origins you will register along with your API key identity. More details will come soon.

## GraphQL Authentication

Using the [apollo-client](https://www.apollographql.com/docs/react/) websocket protocol, the INIT message should
contain an `Authorization` key, with the same format as the REST
authentication (bearer token).

When doing `POST` calls to the `/graphql` endpoint, specify the
`Authorization` header, exactly like any other REST calls.

## GraphQL over gRPC Authentication

Using the language of your choice, use the `OAuth2` authentication
method with gRPC.  Set the `OAuth2 Access Token` to be your JWT, and
if required, specify `Bearer` as the method, then proceed normally.
This will set the `authorization` gRPC header, similiar to the HTTP
header of the same name.