---
weight: 20
title: GET /v0/transactions
release: stable
aliases:
  - /reference/eosio/rest/fetch-transaction/
---

Fetching the transaction lifecycle associated with the provided parameter `:id`.


## Usage

{{< example-request id="search-transactions" url="https://testnet.eos.dfuse.io/v0/transactions/1d5f57e9392d045ef4d1d19e6976803f06741e11089855b94efcdb42a1a41253" >}}

This method returns transaction information regardless of the actual lifecycle
state be it deferred, executed, failed or cancelled. This means that deferred
transactions are handled by this method, via a transaction with a `delay_sec`
argument pushed to the chain or created by a smart contract.

Refers to the [TransactionLifecycle]({{< ref "../types/TransactionLifecycle" >}}) to have a better
overview of lifecycle related properties that are available in the response.

#### Input parameters

{{< method-list-item name="id" type="String" required="true" >}}
  Contract account targeted by the action.
{{< /method-list-item >}}

#### Response

Here is a sample response, for transaction id `4844708BA8CBDF30F75B856BAE8A7B15A3898A1CA9F0FB9A5FBA897C1E975A5C` on EOSIO Testnet:

{{< tabs "fetch-transaction-example" >}}
{{< tab lang="json" >}}
{
  "transaction_status": "executed",
  "id": "4844708BA8CBDF30F75B856BAE8A7B15A3898A1CA9F0FB9A5FBA897C1E975A5C",
  "transaction": {
    "expiration": "2019-04-16T14:36:11",
    ...,
    "actions": [
      {
        "account": "eosio.token",
        "name": "transafer",
        ...,
      }
    ],
  },
  "execution_trace": {
    "id": "4844708BA8CBDF30F75B856BAE8A7B15A3898A1CA9F0FB9A5FBA897C1E975A5C",
    ...,
    "receipt": {
      "status": "executed",
      "cpu_usage_us": 1191,
      "net_usage_words": 12
    },
    "elapsed": 85570,
    "net_usage": 96,
    "scheduled": false,
    "action_traces": [
      {
        "receipt": {
          "receiver": "eosio.token",
          ...,
        },
        ...,
        "inline_traces": [
          ...,
        ]
      }
    ]
  }
}
{{< /tab >}}
{{< /tabs >}}

Returns a [TransactionLifecycle]({{< ref "../types/TransactionLifecycle" >}}).
