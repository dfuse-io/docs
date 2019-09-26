---
weight: 1
title: POST /v1/auth/issue
---

# POST `/v1/auth/issue`

Exchange a long-term API key for a short-lived (24 hours) API Authentication Token (JWT).


## Usage

First, obtain a long-term API key (go to https://app.dfuse.io).

Sample request:

{{< highlight shell >}}
curl -XPOST \
  -H "Content-Type: application/json" \
  --data '{"api_key":"web_ebf6733085d83117b0ad7f9999bd169c"}' \
  "https://auth.dfuse.io/v1/auth/issue"
{{< /highlight >}}

{{< note >}}
This method is called on a different domain: <strong>https://auth.dfuse.io/v1/auth/issue</strong>
{{< /note >}}

## Input parameters

Name | Type | Options | Description
-----|------|---------|------------
`api_key` | string | **required** | Long-term API key

## Response

Returns an [AuthTokenResponse](#type-AuthTokenResponse).
