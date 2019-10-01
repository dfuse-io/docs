---
title: DBRow
---

# `DBRow`

A `DBRow` represents the contents of a row in a [DBOp]({{< ref "./DBOp" >}}).

Only one of `hex` or `json` will be set. If you requested JSON but
ABI-decoding failed, you will receive the encoded binary data in
`hex` alongside an `error`.

Name | Type | Options | Description
-----|------|---------|------------
`payer` | [AccountName]({{< ref "./AccountName" >}}) | **required** | The account which is billed RAM for the time this row stays in the blockchain state.
`hex` | hex-encoded byte array | optional | Hex-encoded string representing the binary data of the row
`json` | Object | optional | Free-form JSON document representing the ABI-decoded row, with the ABI active at the time the operation occurred.
`error` | string | optional | An error message specifying why the ABI decoding failed, when it did.
