---
weight: 10
pageTitle: Push notifications from the chain

---

## Token Management

Once you have signed up at our self-service API management portal ({{< external-link href="https://app.dfuse.io">}}), you will be able to create long-term API keys. (See [Working With Your Free Account]({{< ref "/eosio/public-apis/getting-started/how-to-work-with-your-free-account" >}}) for more info if needed).

Once you have this API key, call the  endpoint {{< external-link href="https://auth.dfuse.io/v1/auth/issue">}} to get a fresh Authentication Token (JWT).

{{< tabs "authentication" >}}
{{< tab lang="go" >}}
payload := `{"api_key":"YOUR_API_KEY_HERE"}`

httpResp, err := http.Post("https://auth.dfuse.io/v1/auth/issue", "application/json", bytes.NewBuffer([]byte(payload)))
if err != nil {
    return nil, fmt.Errorf("request creation: %s", err)
}
defer httpResp.Body.Close()

{{< /tab >}}
{{< /tabs >}}

As documented {{< external-link href="https://docs.dfuse.io/#rest-api-post-https-auth-dfuse-io-v1-auth-issue" title="here">}}, the returned payload is composed of a {{< external-link href="https://jwt.io" title="JWT token">}} and the expiration timestamp.

{{< tabs "jwt-token" >}}
{{< tab lang="json" >}}
{
  "token": "eyJhbGciOiJLTVNFUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NTA2OTIxNzIsImp0aSI6IjQ0Y2UzMDVlLWMyN2QtNGIzZS1iN2ExLWVlM2NlNGUyMDE1MyIsImlhdCI6MTU1MDYwNTc3MiwiaXNzIjoiZGZ1c2UuaW8iLCJzdWIiOiJ1aWQ6bWRmdXNlMmY0YzU3OTFiOWE3MzE1IiwidGllciI6ImVvc3EtdjEiLCJvcmlnaW4iOiJlb3NxLmFwcCIsInN0YmxrIjotMzYwMCwidiI6MX0.k1Y66nqBS7S6aSt-zyt24lPFiNfWiLPbICc89kxoDvTdyDnLuUK7JxuGru9_PbPf89QBipdldRZ_ajTwlbT-KQ",
  "expires_at": 1550692172
}{{< /tab >}}
{{< /tabs >}}

## Refreshing your JWT token
Tokens have a life span of 24h (that can vary) and need to be refreshed before they expire. Please see {{< external-link href="https://docs.dfuse.io/#authentication" title="Lifecycle of short-lived JWTs">}}

https://auth.dfuse.io/v1/auth/issue endpoint is rated limited. Full documentation can be found here {{< external-link href="https://docs.dfuse.io/#authentication" title="API key types & Rate limiting">}}

{{< tabs "jwt-refresh" >}}
{{< tab lang="go" >}}
func (jwt JWT) NeedRefresh() bool {
	exp := jwt["exp"].(float64)
	iat := jwt["iat"].(float64)

	lifespan := exp - iat
	threshold := float64(lifespan) * 0.05
	fmt.Println("lifespan:", lifespan)
	fmt.Println("refresh threshold:", threshold)

	expireAt := time.Unix(int64(exp), 0)
	now := time.Now()

	timeBeforeExpiration := expireAt.Sub(now)
	if timeBeforeExpiration < 0 {
		return true
	}

	return timeBeforeExpiration.Seconds() < threshold
}
{{< /tab >}}
{{< /tabs >}}

## Getting the dfuse GraphQL gRPC client
- Take a look at gRPC {{< external-link href="https://grpc.io/docs/quickstart/go.html" title="Go Quick Start">}}
- You can retrieve `graphql.proto` running `curl -O http://mainnet.eos.dfuse.io/graphql/graphql.proto`
- execute `protoc -I pb/ pb/graphql.proto --go_out=plugins=grpc:graphql`


## Initiating dfuse Graphql Server Connection
Sever addresses can be found at [EOSIO API Endpoints]({{< ref "eosio/public-apis/reference/endpoints" >}}).

{{< tabs "grpc-oauth" >}}
{{< tab lang="go" >}}
...
credential := oauth.NewOauthAccess(authToken)
opts := []grpc.DialOption{
    grpc.WithTransportCredentials(credentials.NewClientTLSFromCert(nil, "")),
    grpc.WithPerRPCCredentials(credential),
}

connection, err := grpc.Dial("kylin.eos.dfuse.io:443", opts...)
if err != nil {
    return fmt.Errorf("run: grapheos connection connection: %s", err)
}

ctx := context.Background()
graphqlClient := pbgraphql.NewGraphQLClient(connection)
...
{{< /tab >}}
{{< /tabs >}}

## GraphQL Query

- dfuse GraphQL documentation can be found {{< external-link href="https://docs.dfuse.io/#graphql" title="here">}}
- If you are not familiar with GraphQL. Take a look at {{< external-link href="https://graphql.org/learn/" title="Introduction to GraphQL">}}
- To help you construct your query and access our api documentation you can use {{< external-link href="https://mainnet.eos.dfuse.io/graphiql/" title="GraphiQL">}} _"A graphical interactive in-browser GraphQL IDE."_
https://mainnet.eos.dfuse.io/graphiql/

## Executing a Query
{{< tabs "graphql-query" >}}
{{< tab lang="go" >}}
...
queryTemplate := `
    subscription ($query: String!, $cursor: String, $lowBlockNum: Int64) {
      searchTransactionsForward(query: $query, cursor: $cursor, lowBlockNum: $lowBlockNum) {
        cursor
        undo
        trace {
          matchingActions {
            receiver
            account
            name
            json
          }
        }
      }
    }
`
query := "account:eosio.msig action:propose"
vars := toVariable(query, cursor, 0)

executionClient, err := graphqlClient.Execute(ctx, &pbgraphql.Request{Query: queryTemplate, Variables: vars})
if err != nil {
    return fmt.Errorf("run: grapheos exec: %s", err)
}
...
{{< /tab >}}
{{< /tabs >}}

This query `account:eosio.msig action:propose` will stream transactions containing action of type `propose` action for the account `eosio.msig`

Take a look at {{< external-link href="https://docs.dfuse.io/#search-query-language-specs" title="Search query language specs">}} for complete documentation.

## Cursor and Block Numbers Management
Complete API documentation is accessible through {{< external-link href="https://mainnet.eos.dfuse.io/graphiql/" title="GraphiQL">}}
- `lowBlockNum` parameter is the lower block number boundary, inclusively. A zero or negative value means a block relative to the head or last irreversible block (depending on if your query contains the `irreversibleOnly` flag).
- `cursor` parameter is an opaque data piece that you can pass back to continue your search if it ever becomes disconnected. Retrieve it from the cursor field in the responses of this call. It is safe to use the same cursor in BOTH directions (forward and backward).

The cursors are part of each responses stream from the server and should always store on reception. When your process/server is restarted, you should retrieve the last cursor received from the server and use it in your next query. {{< external-link href="https://docs.dfuse.io/#searching-through-graphql" title="See more">}}

{{< tabs "load-cursor" >}}
{{< tab lang="go" >}}
...
cursor := s.db.LoadCursor()
...
// execute your query and read response
...
cursor := gjson.Get(response.Data, "data.searchTransactionsForward.cursor").Str
fmt.Println("Cursor:", cursor)
s.db.StoreCursor(cursor)
...
{{< /tab >}}
{{< /tabs >}}


## Reading Server Response
<!-- TODO: Need a quick description -->

{{< tabs "reading-server" >}}
{{< tab lang="go" >}}
...
 for {
 		fmt.Println("Waiting for response")
 		response, err := executionClient.Recv()
 		if err != nil {
 			if err != io.EOF {
 				return fmt.Errorf("receiving message from search stream client: %s", err)
 			}
 			fmt.Println("No more result available")
 			break
 		}
 		fmt.Println("Received response:", response.Data)

 		//Handling error from lib subscription

 		if len(response.Errors) > 0 {

 			for _, e := range response.Errors {
 				fmt.Println("Error:", e.Message)
 			}
 			return nil
 		}

 		cursor := gjson.Get(response.Data, "searchTransactionsForward.cursor").Str
 		fmt.Println("Cursor:", cursor)
 		s.storage.StoreCursor(cursor)

     ...
 }
 ...
{{< /tab >}}
{{< /tabs >}}

## Navigating Forks
If the `irreversibleOnly` flag is not passed and you are reading results near the tip of the chain, you will
encounter information that has not yet been deemed final. As a response you receive may be forked out of the chain,
you will need to handle navigating these forks.
See {{< external-link href="https://docs.dfuse.io/#searching-through-graphql" title="Navigating forks">}} in this page.

{{< tabs "handling-fork" >}}
{{< tab lang="go" >}}
...
undo := gjson.Get(response.Data, "data.searchTransactionsForward.undo").Bool()
var message string
if !undo {
    message = fmt.Sprintf("Please approve '%s' proposed by %s", proposal.Name, proposal.Proposer)
} else {
    message = fmt.Sprintf("Proposal '%s' proposed by %s has been cancel", proposal.Name, proposal.Proposer)
}
...
{{< /tab >}}
{{< /tabs >}}
