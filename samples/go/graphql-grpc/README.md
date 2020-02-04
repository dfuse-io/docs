# Get Started with dfuse graphQL API over gRPC

This simple programme demonstrates how easy it is to query our graphQL API over gRPC.

- It uses our `go client` to retrieve a JWT that will then be used to create the gRPC credential.
- Create a gRPC connection.
- Instantiate a graphQL client.
- Write a simple graphQL query
- Execute the query and wait for response

**Before you begin**

- Visit [golang gRPC prerequisites](https://grpc.io/docs/quickstart/go.html#prerequisites)
- Then make sure that `protoc` is accessible from your \$PATH

**Get the source code**

- `git clone https://github.com/dfuse-io/example-graphql-grpc.git`
- `git clone https://github.com/dfuse-io/graphql-over-grpc.git`

**Generates the graphql.pb.go**

- `protoc -I graphql-over-grpc graphql/graphql.proto --go_out=plugins=grpc:./example-graphql-grpc`

**Getting project dependencies**

- `cd example-graphql-grpc`
- `go mod init main`
- `go mod tidy`

**Run it!**

- Visit [https://app.dfuse.io](https://app.dfuse.io) to get YOUR_API_KEY

**_ETHEREUM_**

- `go run ./eth YOUR_API_KEY_HERE`

**_EOSIO_**

- `go run ./eos YOUR_API_KEY_HERE`

**Useful links**

- [dfuse Search query language](https://docs.dfuse.io/#dfuse-query-language)
- GraphiQL: A graphical graphql editor and API documentation browser.
  _[Ethereum](https://mainnet.eos.dfuse.io/graphiql/)_ / _[EOSIO](https://mainnet.eos.dfuse.io/graphiql/)_

- [Push Notification Example](https://github.com/dfuse-io/example-push-notifications) A fully functional example sending push notifications base on a graphql query results.
