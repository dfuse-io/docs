# Get started with dfuse.io GraphQL API over gRPC

## Push notification example

### Token Management
First, head on to our self-service API management portal (https://app.dfuse.io), after signing up you will be able to create long-term API keys.

Once you have this API key, call the https://auth.dfuse.io/v1/auth/issue endpoint to get a fresh Authentication Token (JWT). 

```go
...

payload := `{"api_key":"YOUR_API_KEY_HERE"}`

httpResp, err := http.Post("https://auth.dfuse.io/v1/auth/issue", "application/json", bytes.NewBuffer([]byte(payload)))
if err != nil {
    return nil, fmt.Errorf("request creation: %s", err)
}
defer httpResp.Body.Close()

...

```

Has documented [here](https://docs.dfuse.io/#rest-api-post-https-auth-dfuse-io-v1-auth-issue). The return payload is composed of a [JWT token](https://jwt.io) and the expiration timestamp.
```json
{
  "token": "eyJhbGciOiJLTVNFUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NTA2OTIxNzIsImp0aSI6IjQ0Y2UzMDVlLWMyN2QtNGIzZS1iN2ExLWVlM2NlNGUyMDE1MyIsImlhdCI6MTU1MDYwNTc3MiwiaXNzIjoiZGZ1c2UuaW8iLCJzdWIiOiJ1aWQ6bWRmdXNlMmY0YzU3OTFiOWE3MzE1IiwidGllciI6ImVvc3EtdjEiLCJvcmlnaW4iOiJlb3NxLmFwcCIsInN0YmxrIjotMzYwMCwidiI6MX0.k1Y66nqBS7S6aSt-zyt24lPFiNfWiLPbICc89kxoDvTdyDnLuUK7JxuGru9_PbPf89QBipdldRZ_ajTwlbT-KQ",
  "expires_at": 1550692172
}
```
### When to refresh your JWT token
Tokens have a life span of 24h (that can vary) and need to be refreshed before they expire. Please see [Lifecycle of short-lived JWTs](https://docs.dfuse.io/#authentication)

https://auth.dfuse.io/v1/auth/issue endpoint is rated limited. Full documentation can be found here [API key types & Rate limiting](https://docs.dfuse.io/#authentication)
                                                                          

```go
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
```
### Getting the dfuse Graphql gRPC client
- Take a look at gRPC [Go Quick Start](https://grpc.io/docs/quickstart/go.html)
- You can retrieve `graphql.proto` running `curl -O http://testnet.eos.dfuse.io/graphql/graphql.proto`
- execute `protoc -I pb/ pb/graphql.proto --go_out=plugins=grpc:graphql`

### Initiating dfuse Graphql Server connection
Sever addresses can be found at [dfuse enpoints !!!need to add gRPC addresses!!!](https://docs.dfuse.io/#endpoints)   
```go
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
```
### GraphQL query
- dfuse GraphQL documention can be found [here](https://docs.dfuse.io/#graphql)
- If you are not familiar with GraphQL. Take a look at [Introduction to GraphQL](https://graphql.org/learn/) 
- To help you construct your query and access our api documentation you can use [GraphiQL](https://testnet.eos.dfuse.io/graphiql/) _"A graphical interactive in-browser GraphQL IDE."_ 
https://testnet.eos.dfuse.io/graphiql/
### Executing a query 
```go
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
```
This query `account:eosio.msig action:propose` will stream transactions containing action of type `propose` action for the account `eosio.msig`

Take a look at [Search query language specs](https://docs.dfuse.io/#search-query-language-specs) for complete documentation.   
 
### Cursor and block numbers management
Complete api documentation is accessible through [GraphiQL](https://mainnet.eos.dfuse.io/graphiql/)
- `lowBlockNum` parameter is the lower block num boundary, inclusively. A zero or negative value means a block relative to the head or last irreversible block (depending on irreversibleOnly).
- `cursor` parameter is an opaque data piece that you can pass back to continue your search if it ever disconnected. Retrieve it from the cursor field in the responses of this call. It is safe to use the same cursor in BOTH directions (forward and backward).

The cursors are part of each responses stream from server and should always store on reception. When your process/server is restarted, you should retrieve the last cursor received from server and use it in your next query. [See more](https://docs.dfuse.io/#searching-through-graphql)
   
```go
...

cursor := s.db.LoadCursor()

... 

// execute your query and read response

...

cursor := gjson.Get(response.Data, "data.searchTransactionsForward.cursor").Str
fmt.Println("Cursor:", cursor)
s.db.StoreCursor(cursor)

...
```  
 
### Reading server response
```go

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
```    
### Handling fork

see [handling fork](https://docs.dfuse.io/#searching-through-graphql)

```go
...

undo := gjson.Get(response.Data, "data.searchTransactionsForward.undo").Bool()
var message string
if !undo {
    message = fmt.Sprintf("Please approve '%s' proposed by %s", proposal.Name, proposal.Proposer)
} else {
    message = fmt.Sprintf("Proposal '%s' proposed by %s has been cancel", proposal.Name, proposal.Proposer)
}
...
```
