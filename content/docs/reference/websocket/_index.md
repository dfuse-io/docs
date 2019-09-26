---
title: WebSocket API
---

# WebSocket API

The websocket-based API fuses batch processing and streaming
capabilities to give you one single endpoint with strong guarantees.

Most operations can fetch a first state (with `fetch: true`), and stream subsequent changes (with `listen: true`).

## Request Message Format

> Sample request message:

{{< highlight json >}}
{
 "type": "[REQUEST_NAME]"`,
 "req_id": "some-string-of-your-choosing",
 "fetch": true,
 "listen": true,
 "start_block": -500,
 "irreversible_only": true,
 "with_progress": 5,
 "data": {...}
}
{{< /highlight >}}

All requests are formed with these parameters, where `type` is the
type of the request, and `req_id` is a token referred to by future
commands (client or server).


These arguments are available for most commands (unless otherwise noted):

#### Arguments

`type` required string
{: .argument-title}

The type of the message. See [request types below](#websocket-request-types).

<div class="argument-separator"></div>

`data` required object
{: .argument-title}

A free-form object, specific to the `type` of request. See [request types below](#websocket-request-types).

<div class="argument-separator"></div>

`req_id` optional string
{: .argument-title}

An ID to associate responses back with the request.

<div class="argument-separator"></div>

`start_block` optional integer
{: .argument-title}

Block at which you want to start processing.  It can be an absolute block number, or a negative value, meaning how many blocks from the current head block on the chain. Ex: `-2500` means 2500 blocks in the past, relative to the head block. 0 means the beginning of the chain. See [Never missing a beat](#websocket-never-miss-a-beat).

<div class="argument-separator"></div>

`irreversible_only` optional boolean
{: .argument-title}

Defaults to `false`. Limits output to events that happened in irreversible blocks. Only supported on `get_action_traces`.

<div class="argument-separator"></div>

`fetch` optional boolean
{: .argument-title}

Defaults to `false`. Whether to fetch an initial snapshot of the requested entity.

<div class="argument-separator"></div>

`listen` optional boolean
{: .argument-title}

Defaults to `false`. Whether to start listening on changes to the requested entity.

<div class="argument-separator"></div>

`with_progress` optional integer
{: .argument-title}

Frequency of the progress of blocks processing (within the scope of a `req_id`). See [Never missing a beat](#websocket-never-miss-a-beat).