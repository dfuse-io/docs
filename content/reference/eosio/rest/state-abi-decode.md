---
weight: 1
title: POST /v0/state/abi/bin_to_json
---

# POST `/v0/state/abi/bin_to_json`

Decode binary rows (in hexadecimal string) for a given table against
the ABI of a given contract account, at any block height.


## Usage

Sample request:

{{< tabs "abi-decode" >}}
{{< tab lang="shell" >}}
curl -X POST -H "Authorization: Bearer web_abcdef12345678900000000000" \
    -d '{"account":"eosio.token","table":"accounts","block_num":2500000,"hex_rows":["aa2c0b010000000004454f5300000000"]}' \
    "https://mainnet.eos.dfuse.io/v0/state/abi/bin_to_json"
{{< /tab >}}

{{< tab lang="javascript" >}}
fetch("https://mainnet.eos.dfuse.io/v0/state/abi/bin_to_json", {
  method: "POST",
  body: JSON.stringify({
    account: "eosio.token",
    table: "accounts",
    block_num: 2500000,
    hex_rows: ["aa2c0b010000000004454f5300000000"]
  }),
  headers: {
    Authorization: "Bearer web_abcdef12345678900000000000",
    "Content-Type": "application/x-www-form-urlencoded"
  }
}).then(console.log)
{{< /tab >}}

{{< tab lang="python" >}}
import requests

headers = {
  'Authorization': 'Bearer web_abcdef12345678900000000000',
}

data = '{"account":"eosio.token","table":"accounts","block_num":2500000,"hex_rows":["aa2c0b010000000004454f5300000000"]}'

response = requests.post('https://mainnet.eos.dfuse.io/v0/state/abi/bin_to_json', headers=headers, data=data)
{{< /tab >}}

{{< tab lang="go" >}}
package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
)

func main() {
	client := &http.Client{}
	var data = []byte(`{{"account":"eosio.token","table":"accounts","block_num":2500000,"hex_rows":["aa2c0b010000000004454f5300000000"]}}`)
	req, err := http.NewRequest("POST", "https://mainnet.eos.dfuse.io/v0/state/abi/bin_to_json", data)
	if err != nil {
		log.Fatal(err)
	}
	req.Header.Set("Authorization", "Bearer web_abcdef12345678900000000000")
	resp, err := client.Do(req)
	if err != nil {
		log.Fatal(err)
	}
	bodyText, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%s\n", bodyText)
}
{{< /tab >}}
{{< /tabs >}}

## Requesting past blocks

The `block_num` parameter determines for which block you want to decode rows
against. This can be anywhere in the chain's history.

If the requested `block_num` is irreversible, decoding will be performed
against an immutable ABI. If the ABI has changed while still in a reversible
chain, decoding will be performed against this new ABI, but it is not guaranteed
to be the view that will pass irreversibility. Inspect the returned `block_num`
parameter of the response to understand from which longest chain the returned ABI is from.

## Input Parameters

The input body must be a valid JSON object. Here are the fields accepted in this JSON
object.

Name | Type | Options | Description
-----|------|---------|------------
`account` | [AccountName](#type-AccountName) | required | Contract account targeted by the action.
`table` | [TableName](#type-TableName) | required | The _name-encoded_ table name you want to retrieve. For example, user balances for tokens live in the `accounts` table. Refer to the contract's ABI for a list of available tables. This is contract dependent.
`hex_rows` | array&lt;string&gt; | required | An array of hexadecimal rows to decode. Each row must be a valid hexadecimal string representation of the row to decode against the ABI.
`block_num` | number | optional, _defaults_ to head block num | The block number for which you want to retrieve the ABI. The returned ABI will be the one that was active at this given `block_num`.

## Response

Here is a sample response, for a request at `block_num: 8000`:

{{< highlight json >}}
{
  "block_num": 181,
  "account": "eosio.token",
  "table": "accounts",
  "rows": [
    {
      "balance": "1750.9546 EOS"
    },
    ...
  ]
}
{{< /highlight >}}

Name | Type | Options | Description
-----|------|---------|------------
`block_num` | string | required | Block number closest to `block_num` at which the ABI was put on chain. For example, if ABI was last changed at block 1000 and you used a `block_num` of 20000 in the request, the response `block_num` will be 1000.
`account` | [AccountName](#type-AccountName) | required | Contract account this ABI is active for.
`table` | [TableName](#type-TableName) | required | Contract table the rows were decoded against.
`rows` | array&lt;object&gt; | required | An array of decoded rows. Each element in the array is the decoded JSON representation of the encoded data against the active ABI at the requested `block_num`. Order of `hex_rows` request parameter is preserved.