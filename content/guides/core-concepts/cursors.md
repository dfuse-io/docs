---
title: Cursors
weight: 30
---
{{< row-wrapper >}}
{{< sub-section-title title="Cursors" >}}

## What is 
In general, we've found that cursor-based pagination is the most powerful of those designed. Especially if the cursors are opaque, either offset or ID-based pagination can be implemented using cursor-based pagination (by making the cursor the offset or the ID), and using cursors gives additional flexibility if the pagination model changes in the future. As a reminder that the cursors are opaque and that their format should not be relied upon, we suggest base64 encoding them.

That leads us to a problem; though; how do we get the cursor from the object? We wouldn't want cursor to live on the User type; it's a property of the connection, not of the object. So we might want to introduce a new layer of indirection; our friends field should give us a list of edges, and an edge has both a cursor and the underlying node:

In general, we've found that cursor-based pagination is the most powerful of those designed. Especially if the cursors are opaque, either offset or ID-based pagination can be implemented using cursor-based pagination (by making the cursor the offset or the ID), and using cursors gives additional flexibility if the pagination model changes in the future. As a reminder that the cursors are opaque and that their format should not be relied upon, we suggest base64 encoding them.

That leads us to a problem; though; how do we get the cursor from the object? We wouldn't want cursor to live on the User type; it's a property of the connection, not of the object. So we might want to introduce a new layer of indirection; our friends field should give us a list of edges, and an edge has both a cursor and the underlying node:

``
<!--

TODO: describe what a cursor is in other database technologies, link Wikipedia, etc..

Its use as a pointer in an interrupted search query.

Describe how it applies to our technology, where it's used:
  * In search,


searc range -> movement in time

search -> transaction base
streamblocks -> the cursor 
dernier element of the collection (exlusive)
query you continue with a new cursor
when you reconnect you give the cursor


cursor implication forks




-->

## In search

<!--

* Unlike other databases, our search cursor works in both direction.
* It's a pointer to a transaction within a block, within a range.
* It assumes the _same query_ is sent with the cursor.
* A cursor cannot be used if the query doesn't include the range where it left off.

-->

## In other pagination

<!--

* In general, we also use cursors in Connection objects in GraphQL
* Describe the general principles we use in our design.
* Link to Facebook's doc, and link to Pagination/Connection article in this section.

-->
{{< row-wrapper-end >}}