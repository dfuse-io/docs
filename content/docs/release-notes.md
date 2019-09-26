---
weight: 50
---

# Release Notes

## 2019-08-07

* Added in **PREVIEW** mode: `GET /v0/state/table/row` to fetch a single row from a given table. The row
  fetched according to it's primary key.
* Added support for `symbol` and `symbol_code` `key_type` in state REST API calls.
* Added `POST` support for `/state/tables/scopes` and `/state/tables/accounts` which accepts a
  `application/x-www-form-urlencoded` content type.

## 2019-07-09

* Deprecation of non-`executed` transactions in Search:
  * According to our analysis, this change touches close to 0% of our userbase.
  * The `status:executed` constraint is still going to be implicit; querying the `status` field is therefore deprecated.
  * Leaving `status:executed` in the query will still be supported for a while, to not break existing queries, but will have no effect.
  * Querying `status:soft_fail` will now fail.
  * Using `status:` in an `OR` clause will now fail.
  * Deferred transaction failures are _not_ indexed anymore, and not searchable through the different search endpoints, following the principle of least surprise for most of our users.
  * Searches for `receiver:account` will now see `eosio:onerror` actions on that `account`. Those `onerror` actions, when `soft_fail`ed, are actually successfully executed, and can therefore mutate state and do other things, so thay are included, but the deferred transaction that failed (and which state's mutations were not applied), is not going to be indexed anymore.
  * Ram consumption reported by `ram.consumed:account` and `ram.released:account` will not cover the `status:expired` and `status:hard_fail`ed transactions. Note that `status:expired` was already previously absent, so an imbalance was possible if computing the full amount of RAM for a given `account`.


## 2019-05-07

* **Beta** dfuse Events is now live.

## 2019-04-24

* Added in **PREVIEW** mode: `GET /v0/transaction/:id` to fetch the transaction lifecycle
  associated with the `:id` path parameter.

## 2019-04-23

* **Breaking change**  : `/v1/chain/push_transation` with `in-block` guarantee now requires authentication.

## 2019-04-17

* **Beta** Brand new GraphQL interface to EOSIO chain
  data. [See documentation](#graphql) and
  [announcement](https://www.dfuse.io/en/blog/dfuse-brings-the-power-of-graphql-to-eos).

* New streaming search capabilities (through GraphQL):

    * You can now stream _dfuse Search_ query results in real-time.

    * It allows you to navigate forks with greater ease than before.

    * Provides a chain-wide cursor, that allows
      you to continue listing transactions from where you left off, with
      message-per-message granularity (instead of block granularity, as
      previously).

    * The cursor allows you to search backwards (to get recent
      transactions), and then flip the direction and listen to
      real-time events, guaranteeing there's no gaps.

    * See [announcement](https://www.dfuse.io/en/blog/avoid-refreshing-provide-instant-ux-with-dfuse-streaming-search)

## 2019-04-10

* **Breaking change** (low risk): Search requests that do not specify
  `status:` in the query will automatically search only for
  `status:executed` transactions. Some people were surprised to
  receive failed transactions. This protects you from making wrong
  decisions because of an oversight.


## 2019-03-21

* Added `irreversible_only` flag to `get_action_traces` websocket request.

## 2019-03-05

* Added in PREVIEW mode: `GET /v0/state/key_accounts` to fetch the list of accounts
  controlled by the given public key, at any block height.

* Added in PREVIEW mode: `GET /v0/state/table_scopes` to fetch the list of scopes of
  a given table on a contract's account, at any block height.

* Added `console` outputs to action traces throughout the dfuse platform.

* Added `creation_tree`, visible on
  eosq.app. [See announcement](https://www.dfuse.io/en/blog/eosq-removes-ambiguity-when-debugging-your-smart-contract)
  Best way to consume this is through the [GraphQL](#graphql)
  interface.


## 2019-01-29

* Clarified the use of `cursor`, and describe the behavior of `forked_head_warning`.

* Improved the documentation of the [query language](#ref-query-language).



## 2019-02-18

* `POST /v1/chain/push_transaction` now supports new push-guarantees:
  `handoff:1`, `handoffs:2` and `handoffs:3`, allowing more flexible
  rules to guarantee transaction delivery based on your application's
  requirements.  [See announcement](https://www.dfuse.io/en/blog/dfuse-adds-push-guarantee-producer-handoff)

## 2019-01-22

* Fully standardized error messages format returned to consumer.

  Our error message structure for both the REST API and WebSocket API is
  now fully standardized across all our endpoints.

  The format is as follow:

{{< highlight json >}}
{
  "code": "a_unique_error_code_for_this_specific_error",
  "trace_id": "unique_id_identifying_your_request",
  "message": "A descriptive error message about the problem.",
  "details": {
    "key": "contextual key/values pairs specific to each error"
  }
}
{{< /highlight >}}

  Each error returned to you has a unique `code` field which descriptively identifies
  the error. The error code is stable in time and can be programmatically relied upon
  in your code to process the error.

  The `trace_id` uniquely identifies your request, will change upon each request, being
  unique across all traces. This can be provided to our support team when investigating
  problems.

  The `message` is a human-readable english string about why the error happen and what was wrong
  exactly. It may change over time and should **not** be used to determine what the error was.
  Use the `code` field for that purpose.

  The `details` is a key/value pair object and is optional, so it might or might not be present.
  It contains error specific details about what went wrong for a given error code. It's unique
  per code, and can be used programmatically to extract information about the error.

## 2018-12-18

### REST API

* Released **PREVIEW** of **dfuse Structured Query Engine** or (**SQE**).
    * `GET /v0/search/transactions` to [query the whole blockchain in a swift](#rest-get-v0-search-transactions)

* Renamed `TableDelta` to `TableDeltaResponse`, and `TableDelta` is now the inner `data` field of that response.

* Renamed `TableSnapshot` to `TableSnapshotResponse`, and `TableRows` is now the inner `data` field of that response.

* Renamed `TransactionLifecycle` to `TransactionLifecycleResponse`, and `TransactionLifecycle` is now the inner `data` field of that response.


## 2018-12-13

### REST API

* Added in PREVIEW mode: `GET /v0/state/abi` to fetch the ABI of a given account
  (contract) at any given block height.

* Added in PREVIEW mode: `POST /v0/state/abi/bin_to_json` to decode hexadecimal
  raw data of multiple rows against the ABI of a given account (contract) at any
  given block height.

## 2018-12-12

### REST API

* Added in PREVIEW mode: `GET /v0/state/tables/scopes` to fetch a given
  table/scope pair for multiple contracts in a single command (up to 1500).

* Bumped `GET /v0/state/tables/accounts` limit on `accounts` to 1500.

## 2018-12-10

### REST API

* Added in PREVIEW mode: `GET /v0/state/permission_links` to fetch authorization
  linked to a particular account at any given point in time.

## 2018-11-28

### WebSocket

* DEPRECATED: The `eosws.mainnet.eoscanada.com` domain, which some users
  used at the very beginning of _dfuse_ will be shutdown in 7 days. Use
  the new [endpoints listed above](#endpoints).

* Added support to filter multiple `accounts`, `receivers` and
  `action_names` in the `get_action_traces` WS request.

  * The `account`, `receiver` and `action_name` parameters are still
    supported by DEPRECATED, and will be removed in a future release.

  * Please use that instead of doing multiple parallel
    `get_action_traces`


## 2018-11-22

### Breaking changes

* Breaking change `get_table_rows` listen response fields `undo: true`
  and `redo: true` are replaced by `step: "undo"` and `step: "redo"`

### REST API

* Added in PREVIEW mode: `GET /v0/state/tables/accounts` to fetch a given
  table/scope pair for multiple contracts in a single command (up to 500)

* `POST /v1/chain/push_transaction` supports anonymous access for
  `in-block` guarantees.

### WebSocket

* `get_transaction_lifecycle` now correctly sends an update upon
  irreversibility. It also contains a "transaction_status" parameter.

* Fixed `get_table_rows` encoding errors on some rows (that were in
  fact deleted)

* Added `get_head_info` to get current state of chain (last block,
  current producer, etc.)


## 2018-11-09

### Breaking changes (within reason, during beta period)

* `get_transaction` was renamed to: `get_transaction_lifecycle`
* `get_transaction_lifecycle`:
  * now returns `transaction_lifecycle`, a message format that has
    changed quite heavily to include information about deferred creation,
    deferred execution, irreversibility of the different blocks, etc.
    See docs for details.
* `get_actions` was renamed to: `get_action_traces`
* `get_action_traces`:
  * `with_deferred` was renamed to `with_dtrxops`
* `get_table_rows`:
  * `data.table_name` parameter renamed to `data.table` (for consistency with
    the REST API)
  * `data.verbose` option removed
  * the struture of the `rows` has changed in the
    `table_delta` message.
  * `dbop` is now a nested object
  * `dbop.key` is now a name-encoded value
  * `dbop.old` and `dbop.new` represent the old and new values, payers.zz

### New features

  * Added REST endpoint `/v0/state/table` added. See docs for details.
  * Added REST endpoint `/v1/chain` as passthrough to a reliable node
  * Added guarantees to REST endpoint `/v1/chain/push_transaction`.
    See docs for details.
  * `get_transaction_lifecycle`: now supports "fetch" AND "listen" modes,
    the listen mode will send updated objects when new block affects the trx.
  * `get_table_rows`: the `fetch: true` argument now returns a
    snapshot of the table at the block requested. Adding `listen:
    true` streams changes as they arrive.

  * `get_table_rows`: when switching longest chain, you will now
    receive `undo` and `redo` operations allowing you to stay
    completely in sync with the longest chain (provided you apply
    those deltas to a client-side full table state)

  * `action_trace` message now includes a `block_time`


## 2018-10-15

  * `get_actions` request: renamed parameter `with_ram_costs` to `with_ramops`
    (`get_actions` is now `get_action_traces`).
