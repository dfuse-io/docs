---
title: Cursors
weight: 1
---

# Cursors

<!--

TODO: describe what a cursor is in other database technologies, link Wikipedia, etc..

Its use as a pointer in an interrupted search query.

Describe how it applies to our technology, where it's used:
  * In search,


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
