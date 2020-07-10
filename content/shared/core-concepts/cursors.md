---
weight: 30
title: Cursors
---

## All About Cursors

A cursor is a control structure that enables traversal over records. Cursors facilitate subsequent processing of the traversal. It is akin to the programming language concept of iterator. Cursors are a core concept within the dfuse ecosystem and is heavily used in dfuse Search.

Besides pagination, cursors are instrumental when using subscriptions to deal with network disconnections. By using the cursor of your last successful request, you can reconnect and continue streaming without missing any documents.

We have designed our cursor as an opaque but data rich structure that enables your query to sequentially process the rows in your result set. This design gives us flexibility that if the pagination model changes in the future, the cursor format will remain compatible.

## Features

#### Precise

Our cursor is a chain-wide cursor. In other words they point to an exact location within a stream of documents returned to you by
one of our APIs. For example, in a search stream, it's the last transaction sent, in a query of the most recent blocks, it's the last block of the page. This idea of a cursor can they be used in different contexts.

- When iterating through results of a paginated query, simply return us your last seen cursor and we will give you the next page.
- When streaming results to you via GraphQL subscription, keep your last seen cursor. If the stream disconnects for any reason, simply send us back your last seen cursor and we will start back at the exact location where you were disconnected.

#### Fork Aware

In addition, all of our cursors are fork aware (where it makes sense). They know the exact branching where you were and are able to
determine if the block was forked. In this eventuality, we notify you about this.

<!--
Insert JC Diagram
-->
