# Getting Started with Go

This simple program demonstrates how easy it is to query our GraphQL API over gRPC. It:

* Uses our `go client` to retrieve a JWT
* Creates a gRPC connection with credentials
* Instantiates a GraphQL client
* Executes a simple GraphQL query
* Prints the response

## Before you begin

- Visit [golang gRPC prerequisites](https://grpc.io/docs/quickstart/go.html#prerequisites)
- Then make sure that `protoc` is accessible from your $PATH

{{< tabs "uniqueid" >}}
{{< tab lang="go" >}}
import (
	"context"
	"fmt"
	"log"
	pbgraphql "main/graphql"
	"os"

	"github.com/dfuse-io/eosws-go"
	"golang.org/x/oauth2"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
	"google.golang.org/grpc/credentials/oauth"
	"io"
)

func main() {
	token, _, err := eosws.Auth(os.Args[1])
	if err != nil {
		log.Fatalf("cannot get auth token: %s", err)
	}

	credential := oauth.NewOauthAccess(&oauth2.Token{AccessToken: token, TokenType: "Bearer"})
	connection, err := grpc.Dial(
		"mainnet.eos.dfuse.io:443",
		grpc.WithPerRPCCredentials(credential),
		grpc.WithTransportCredentials(credentials.NewClientTLSFromCert(nil, "")),
	)
	graphqlClient := pbgraphql.NewGraphQLClient(connection)

	q := `subscription  {
		  searchTransactionsForward(query: "action:transfer", limit:10) {
			trace { matchingActions { receiver account name json }}}}`

	executionClient, err := graphqlClient.Execute(
		context.Background(),
		&pbgraphql.Request{Query: q},
	)
	if err != nil {
		log.Fatalf("execution error: %s", err)
	}

	for {
		response, err := executionClient.Recv()
		if err != nil {
			if err != io.EOF {
				fmt.Println("No more result available")
				break
			}

			log.Fatalf("reception error: %s", err)
		}

		fmt.Println("Received response:", response.Data)
	}
}
{{< /tab >}}
{{< /tabs >}}

## Get the source code

- `git clone https://github.com/dfuse-io/example-graphql-grpc.git`
- `git clone https://github.com/dfuse-io/graphql-over-grpc.git`

## Generate `graphql.pb.go`

- `protoc -I graphql-over-grpc graphql/graphql.proto --go_out=plugins=grpc:./example-graphql-grpc`

## Get project dependencies

- `cd example-graphql-grpc`
- `go mod init main`
- `go mod tidy`

## Run it!

- Visit [https://app.dfuse.io](https://app.dfuse.io) to get YOUR_API_KEY
- `go run main.go YOUR_API_KEY_HERE`

## Useful Links

- Docs: [dfuse Search query language](#dfuse-query-language)
- On mainnet: [GraphiQL](https://mainnet.eos.dfuse.io/graphiql/) A graphic graphql editor and API documentation browser.
- GitHub: [Push Notification Example](https://github.com/dfuse-io/example-push-notifications) A fully functional example sending push notifications base on a graphql query results.
- GitHub: [Protobuf service definition](https://github.com/dfuse-io/graphql-over-grpc/blob/master/graphql/graphql.proto) for GraphQL