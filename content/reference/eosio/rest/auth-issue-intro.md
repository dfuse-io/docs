---
weight: 1
title: POST /v1/auth/issue
---

Exchange a long-term API key for a short-lived (24 hours) API Authentication Token (JWT).


## Usage

First, obtain a long-term API key (go to https://app.dfuse.io).

Sample request:

{{< tabs "abi-decode" >}}
{{< tab lang="shell" >}}
curl -XPOST \
  -H "Content-Type: application/json" \
  --data '{"api_key":"web_ebf6733085d83117b0ad7f9999bd169c"}' \
  "https://auth.dfuse.io/v1/auth/issue"
{{< /tab >}}

{{< tab lang="javascript" >}}
fetch("https://auth.dfuse.io/v1/auth/issue", {
  method: "POST",
  body: JSON.stringify({
    api_key: "web_ebf6733085d83117b0ad7f9999bd169c"
  }),
  headers: {
    "Content-Type": "application/json"
  }
}).then(console.log)
{{< /tab >}}

{{< tab lang="python" >}}
import requests

headers = {
    'Content-Type': 'application/json',
}

data = '{"api_key":"web_ebf6733085d83117b0ad7f9999bd169c"}'

response = requests.post('https://auth.dfuse.io/v1/auth/issue', headers=headers, data=data)
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
	var data = []byte(`{{"api_key":"web_ebf6733085d83117b0ad7f9999bd169c"}}`)
	req, err := http.NewRequest("POST", "https://auth.dfuse.io/v1/auth/issue", data)
	if err != nil {
		log.Fatal(err)
	}
	req.Header.Set("Content-Type", "application/json")
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

{{< alert type="note" >}}
This method is called on a different domain: <strong>https://auth.dfuse.io/v1/auth/issue</strong>
{{< /alert >}}

#### Input parameters

{{< method-list-item name="api_key" type="String" required="true" >}}
  Long-term API key
{{< /method-list-item >}}

#### Response

Returns an [AuthTokenResponse]({{< ref "../types/AuthTokenResponse" >}}).
