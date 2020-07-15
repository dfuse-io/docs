---
weight: 40

pageTitle: WebSocket API
pageTitleIcon: eosio

sideNav: true
sideNavTitle: Public APIs
sideNavLinkRename: WebSocket API

BookToC: false
#release: stable

---

The WebSocket-based API fuses batch processing and streaming
capabilities to give you one single endpoint with strong guarantees.

{{< alert type="note">}}
For `get_action_traces` and `get_table_rows` streams, we **strongly suggest** new development
to use [GraphQL Subscription searchTransactionsForward]({{< ref "/eosio/public-apis/reference/graphql#subscription-searchTransactionsForward" >}}) instead of `get_action_traces` and `get_table_rows`. Advantages of using the GraphQL API:

- Possibility to also perform a paginated query instead of streaming.
- Possibility to greatly reduce bandwidth transfer & cost (ingress to your server) by specifying the exact trimmed down data payload you need (excellent for browser & mobile usage).
- A much cleaner interface to query by block range (`lowBlockNum` and `highBlockNum` instead of harder to reason about `startBlock` and `blockCount`)
- On-the-fly ABI decode to JSON smart contract database rows that changed due to the execution of the transaction.

And it's quite easy to convert them to a GraphQL streaming call.

- [Convert `get_action_traces` to GraphQL API]({{< ref "./req-get-action-traces#conversion-to-graphql-api" >}})
- [Convert `get_table_rows` to GraphQL API]({{< ref "./req-get-table-rows#conversion-to-graphql-api" >}})
{{</ alert >}}

Most operations can fetch a first state (with `fetch: true`), and can then
stream subsequent changes (with `listen: true`).

All of our WebSocket stream supports the following common features:

* `req_id`: multiplex multiple stream within a single WebSocket connection, identifying each of them uniquely
* `with_progress`: allowing you to keep tabs on what you have seen up to the second
* `start_block`: allowing you to restart from where you left off

## Requests

Sample request message:

{{< highlight json >}}
{
 "type": "[REQUEST_NAME]",
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

#### Request Format

{{< method-list-item name="type" type="String" required="true" >}}
  The type of the message.
{{< /method-list-item >}}

{{< method-list-item name="type" type="Object" required="true" >}}
  A free-form object, specific to the `type` of request.
{{< /method-list-item >}}

{{< method-list-item name="req_id" type="String" required="false" >}}
  An ID to associate responses back with the request, required if multiplexing multiple stream inside a single WebSocket connection.
{{< /method-list-item >}}

{{< method-list-item name="fetch" type="Boolean" required="false" >}}
  Defaults to `false`. Whether to fetch an initial snapshot of the requested entity.

  {{< alert type="warning" >}}Only supported on `get_table_rows` and `get_transaction`.{{</ alert >}}
{{< /method-list-item >}}

{{< method-list-item name="listen" type="Boolean" required="false" >}}
  Defaults to `false`. Whether to start listening on changes to the requested entity.
{{< /method-list-item >}}

{{< method-list-item name="start_block" type="Number" required="false" >}}
  Block at which you want to start processing. It can be an absolute block number, or a negative value, meaning how many blocks from the current head block on the chain. Ex: `-2500` means 2500 blocks in the past, relative to the head block. 0 means the beginning of the chain. See [Using `start_block`]({{< ref "#using-start-block" >}}) section on usage pattern.
{{< /method-list-item >}}

{{< method-list-item name="with_progress" type="Number" required="false" >}}
  Frequency of the progress of blocks processing (within the scope of a `req_id`). See [Using `with_progress`]({{< ref "#using-with-progress" >}}) section on usage pattern.
{{< /method-list-item >}}

{{< method-list-item name="irreversible_only" type="Boolean" required="false" >}}
  Defaults to `false`. Limits output to events that happened in irreversible blocks.

  {{< alert type="warning" >}}Only supported on `get_action_traces`.{{</ alert >}}
{{< /method-list-item >}}

## Responses

These are the messages you can receive from the server.

* [`listening`](#listening)
* [`progress`](#progress)
* [`error`](#error)
* [`ping`](#ping)

### `listening`

{{< highlight json >}}
{
  "type":"listening",
  "req_id": "your-request-id",
  "data":{
   "next_block":26736683
  }
}
{{< /highlight >}}

Confirmation that server will continue processing block with height starting at next_block and emit more messages on current stream.

Use `unlisten` request to stop streaming for `req_id`

### `progress`

{{< highlight json >}}
{
 "type":"progress",
 "req_id": "your-request-id",
 "data": {
    "block_num": 29351730,
    "block_id": "01bfdf32469f6f48ca2e5e5c755422c7da0bbc33f1e470c034daffd460a2a58d"
 }
}
{{< /highlight >}}

Confirmation that server will continue processing block with height starting at next_block and emit more messages on current stream.

Use `unlisten` request to stop streaming for `req_id`

### `error`

{{< highlight json >}}
{
  "type": "error",
  "data": {
   "code": "tx_not_found",
   "message": "transaction_lifecycle 'abcdef123123123...' not found, or error fetching transaction",
   "details": {"tx_id": "abcdef123123123..."}
  }
}
{{< /highlight >}}

If an error occurs during the request, you'll get an error response

### `ping`

Once connected to the WebSocket, every 10 seconds, you get a `ping` response from the server.

{{< alert type="note">}}
Please note that each `ping` response is billed as one document.

{{< highlight json >}}
{"type":"ping","data":"2018-01-01T00:00:10.526391919Z"}
{{< /highlight >}}

## Using `with_progress`

When you specify `with_progress` as part of the
[request message]({{< ref "#request-format" >}}), you will start
receiving messages of type `progress` when blocks arrive. The value
you pass is interval of blocks you want to get that message, or the
precision. A value of `5` means you will receive one `progress`
message each 5 blocks. Set it to `1` to receive a message for each
block.

For a given `req_id` stream, you are guaranteed to see the `progress`
message **after** you have received any matching data within that
block.

Also, you will receive *one* notification each 250 milliseconds at
maximum. This means you will not get one `progress` message per block
when doing massive historical reprocessing.

{{< alert type="warning" >}}
Even with a value of `1`, it is possible that you do *not* get a
message for *each block*, if there is a slight network congestion
which brings two blocks within 250ms of propagation.
{{< /alert >}}

## Using `start_block`

By specifying `start_block`, you can request that the stream of events
starts in the past. You might need API keys that allow such
reprocessing (until we have a self-serve portal, contact us if such is
the case).

Possible values:

* A negative value will start you in the past, relative to the current
  head block of the chain. Ex: `-50` would start at block `25000100`
  if the head block was `25000150`

* A value of `0` means to start streaming at the head block, feeding
  real-time data through the socket.

* A positive value will start at the given block. Ex: `10000` will
  start feeding (almost) the whole chain history into your
  socket. Contact us for keys with that feature enabled.

Standard keys can process `3600` blocks in the past by default.
