# Responses

These are the messages you can receive from the server.

* [`listening`](#websocket-resp-listening)
* [`progress`](#websocket-resp-progress)
* [`error`](#websocket-resp-error)

## `listening`

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

## `progress`

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

## `error`

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
