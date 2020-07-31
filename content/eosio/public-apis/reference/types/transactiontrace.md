---
weight: 20
title: TransactionTrace
aliases:
  - /reference/eosio/types/transactiontrace/

---

## Type `TransactionTrace`

See this {{< external-link title="source code for reference" href="https://github.com/dfuse-io/eosws-go/blob/master/mdl/v1/transaction.go#L11" >}}.

#### Properties

{{< method-list-item name="id" type="String" required="true" >}}
  <!-- TODO: required or not? + Add description -->
{{< /method-list-item >}}

{{< method-list-item name="block_num" type="Number (uint32)" required="true" >}}
  <!-- TODO: required or not? + Add description -->
{{< /method-list-item >}}

{{< method-list-item name="block_time" type="DateTime" required="true" >}}
  <!-- TODO: required or not? + Add description -->
{{< /method-list-item >}}

{{< method-list-item name="producer_block_id" type="String" required="true" >}}
  <!-- TODO: required or not? + Add description -->
{{< /method-list-item >}}

{{< method-list-item name="receipt" type="TransactionReceiptHeader" required="true" >}}
  <!-- TODO: required or not? + Add description -->
{{< /method-list-item >}}

{{< method-list-item name="elapsed" type="Number (int64)" required="true" >}}
  <!-- TODO: required or not? + Add description -->
{{< /method-list-item >}}

{{< method-list-item name="net_usage" type="Number (uint64)" required="true" >}}
  <!-- TODO: required or not? + Add description -->
{{< /method-list-item >}}

{{< method-list-item name="scheduled" type="Boolean" required="true" >}}
  <!-- TODO: required or not? + Add description -->
{{< /method-list-item >}}

{{< method-list-item name="action_traces" type="Array&lt;[ActionTrace](/eosio/public-apis/reference/types/actiontrace)&gt;" required="true" >}}
  <!-- TODO: required or not? + Add description -->
{{< /method-list-item >}}

{{< method-list-item name="failed_dtrx_trace" type="[TransactionTrace](/eosio/public-apis/reference/types/transactiontrace)" required="true" >}}
  <!-- TODO: required or not? + Add description -->
{{< /method-list-item >}}

{{< method-list-item name="except" type="JSON" required="true" >}}
  <!-- TODO: required or not? + Add description -->
{{< /method-list-item >}}
