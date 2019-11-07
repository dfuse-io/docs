---
weight: 50
title: Never Missing a Beat
protocol: EOS
---

Sometimes, disconnections happen. Indeed, you will want to plan for disconnections.

Thankfully, the **dfuse** API has you covered, with the following WebSocket parameters:

* `with_progress`: allowing you to keep tabs on what you have seen up to the second
* `start_block`: allowing you to restart from where you left off

## Using `with_progress`

When you specify `with_progress` as part of the
[request message]({{< ref "/request-message-format" >}}), you will start
receiving messages of type `progress` when blocks arrive. The value
you pass is interval of blocks you want to get that message, or the
precision.  A value of `5` means you will receive one `progress`
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
