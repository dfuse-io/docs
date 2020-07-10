---
title: DBRow
---

# `DBRow`

A `DBRow` represents the contents of a row in a [DBOp]({{< ref "./DBOp" >}}).

Only one of `hex` or `json` will be set. If you requested JSON but
ABI-decoding failed, you will receive the encoded binary data in
`hex` alongside an `error`.

#### Properties

{{< method-list-item name="payer" type="[AccountName](/eosio/public-apis/reference/types/accountname)" required="true" >}}
  The account which is billed RAM for the time this row stays in the blockchain state.
{{< /method-list-item >}}

{{< method-list-item name="hex" type="Hex-encoded byte array" required="false" >}}
  Hex-encoded string representing the binary data of the row
{{< /method-list-item >}}

{{< method-list-item name="json" type="Object" required="false" >}}
  Free-form JSON document representing the ABI-decoded row, with the ABI active at the time the operation occurred.
{{< /method-list-item >}}

{{< method-list-item name="error" type="String" required="false" >}}
  An error message specifying why the ABI decoding failed, when it did.
{{< /method-list-item >}}
