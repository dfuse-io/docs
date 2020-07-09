---
title: Rate Limiting
weight: 100
---

## Acceptable use limits

In order to guarantee great performance and reliability for all of our users, we reserve the right to throttle certain API requests.

As such, REST APIs may received HTTP Status 429 `Too Many Requests`({{< external-link title="as per `RFC6585` Section 4" href="https://tools.ietf.org/html/rfc6585#section-4)" >}} along with `X-RateLimit-Limit` / `X-RateLimit-Remaining` / `X-RateLimit-Reset` HTTP response headers. A well behaved client application should pause for the prescribed amount of time as the request will be dropped and no response will be returned.

## Authentication (auth.dfuse.io)

Because we expect well behaved clients applications to request only one JWT, cache it and use it for up to 24 hours, we do not allow more than a handful of JWTs to be issued per user. At the moment this limit is counted `Per IP Address / Per Minute` (allowing you to do load balancing), but we reserve the right to adjust this over time.

## REST endpoints

At the moment we do not have any rate limiting in place for those endpoints.

## Websocket endpoints

At the moment we do not have any rate limiting in place for those endpoints.

## GraphQL (WebSocket and gRPC)

At the moment we do not have any rate limiting in place for those endpoints.
