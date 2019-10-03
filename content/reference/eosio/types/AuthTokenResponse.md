---
title: AuthTokenResponse
---

# `AuthTokenResponse`

#### Properties

{{< method-list-item name="token" type="String" >}}
  The JWT to be used with all API calls, including WebSocket.
{{< /method-list-item >}}

{{< method-list-item name="expires_at" type="Timestamp" >}}
  An UNIX timestamp (UTC) indicating when the JWT will expire.
{{< /method-list-item >}}

## Example payload

{{< highlight json >}}
{
  "token": "eyJhbGciOiJLTVNFUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NTA2OTIxNzIsImp0aSI6IjQ0Y2UzMDVlLWMyN2QtNGIzZS1iN2ExLWVlM2NlNGUyMDE1MyIsImlhdCI6MTU1MDYwNTc3MiwiaXNzIjoiZGZ1c2UuaW8iLCJzdWIiOiJ1aWQ6bWRmdXNlMmY0YzU3OTFiOWE3MzE1IiwidGllciI6ImVvc3EtdjEiLCJvcmlnaW4iOiJlb3NxLmFwcCIsInN0YmxrIjotMzYwMCwidiI6MX0.k1Y66nqBS7S6aSt-zyt24lPFiNfWiLPbICc89kxoDvTdyDnLuUK7JxuGru9_PbPf89QBipdldRZ_ajTwlbT-KQ",
  "expires_at": 1550692172
}
{{< /highlight >}}