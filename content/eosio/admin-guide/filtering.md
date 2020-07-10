---
title: Filtering
---

Goal: understand the filtering capabilities, data flows, and impact on different services.

## Filtering language

Filtering in the dfuse platform uses the Common Expression Language, developed by Google, and used in high throughput environments (like their ACL checking routers).

It is a very simple, yet powerful language. It resembles all the languages you already know (Java, JavaScript, C, C++, etc.)


## Components

Filtering is applied on certain components, while other components are happy to accept filtered data and process it.


### `relayer`

The `relayer` is where filtering happens in a deployment. It uses primitives available to all components, but when the `relayer` does the filtering, it cuts on much of the network traffic that follows, thereby shrinks much of the RAM needs of all components downstream (like `search-live`, `dgraphql`, `blockmeta`, etc...)


// TODO: HOW to,
// TODO: examples


### `trxdb`

// TODO: insert considerations
// blocks will appear less full than they actually are

### `fluxdb`

// filter intelligently if you want your tables to be consistent

// filtering can be done on tables (soon, when a `panic()` is removed), so you can be sure to have all mutations for the tables you need.
