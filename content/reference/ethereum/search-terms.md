---
weight: 20
title: Search Terms
---
{{< row-wrapper >}}
{{< sub-section-title title="Search Terms for Ethereum"  protocol="ETH" >}}

The dfuse Search Query Language resembles the one exposed by Kibana or GitHub for sifting through issues. It is a simple, flat `key1:value1 key2:value2` string, yet allows negation clauses and combinations of `OR` clauses.

dfuse offers two indexes for searching ETH transactions

 * EVM call (`indexName: "call"`)
 * Log (`indexName: "log"`)

## Searching by EVM Call

The following terms are supported:

### `callType` _string_

* description: type of this EVM **call**
* accepted values: `CALL`, `CALLCODE`, `DELEGATE`, `STATIC` or `CREATE`

### `callIndex` _uint_

* description: Index of this call in the transaction. The transaction's `to` and `from` fields will match the call's `to` and `from` fields at callIndex=0
* example: `callIndex:0 from:0x59a5208B32e627891C389EbafC644145224006E8`


### `signer` _address_

* description: address used to sign the **transaction**
* example: `signer:0x59a5208B32e627891C389EbafC644145224006E8`

### `nonce` _uint_

* description: nonce of the **transaction**
* example: `nonce:80023`

### `to` _address_

* description: address of the called contract or target account of a transfer **call**
* example: `to:0x774af44fc5ad4eab986e989fa274b0dd2159be7b`

### `from` _address_

* description: the account performing the **call**. This can be an Externally Owned Account, in the case of the top-level transaction, or another contract account, in the case of internal transactions
* example: `from:0x774af44fc5ad4eab986e989fa274b0dd2159be7b`

### `value` _integer_ or _hex_

* description: Ether value of a transfer **call** in WEI
* example: `value:60000000000` or `value:0xdf8475800`

### `method` _string_ or _4-bytes hexdata_

* description: either the signature in ascii form or the first 4 bytes (in hex format) of the keccak-256 of that signature (which can be found in the first 4 bytes of the `input`) of the **method called**
* example: `method:transfer(address,uint256)` or `method:a9059cbb`

### `balanceChange` _address_

* description: address that has its balance affected by the **call**
* example: `balanceChange:0x8cb02139d217b2fce7940902e6826cae8366d358`

### `storageChange` _hexdata_

* description: storage key that was written to by the **call**
* example: `storageChange:0x3`

### `input` _32-bytes hexdata_

* description: bytes that are passed to the **call**
* example: `balanceChange:0x8cb02139d217b2fce7940902e6826cae8366d358`

## Searching by Log

The following terms are supported:

### `topic` _32-bytes hexdata_

* description: hex data output as a topic in the log. Request will be 0-padded to 32 bytes. The index must be appended to the 'topic' term, as seen in the following examples.
* example: `topic.0:0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef` or `topic.1:0x91b356c3e5e0d7cbe261dfa29e11a554b7bc6406`

### `data` _32-bytes hexdata_

* description: hex data output as 'data' in the log, truncated to 32-bytes chunks. Request will be 0-padded to 32 bytes. The index of those chunks of 32 bytes must be appended to the 'data' term, as seen in the following examples.
* example: `data.0:1eda1ceca1274d6ab9101c30abd6b8b205861286`

### `address` _address_

* description: address of the contract in the **call**
* example: `address:0x774af44fc5ad4eab986e989fa274b0dd2159be7b`

### `signer` _address_

* description: address used to sign the **transaction**
* example: `signer:0x59a5208B32e627891C389EbafC644145224006E8`

### `method` _string_ or _4-bytes hexdata_

* description: either the signature in ascii form or the first 4 bytes (in hex format) of the keccak-256 of that signature (which can be found in the first 4 bytes of the `input`) of the **method called**
* example: `method:transfer(address,uint256)` or `method:a9059cbb`


{{< row-wrapper-end >}}