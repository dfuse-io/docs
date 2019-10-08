---
weight: 1
title: "Getting Started with Python"
---

# Getting Started with Python

In this guide, we will create a basic setup to use the dfuse GraphQL API with Python.

## Requirements

You will need Python (>= 3.4+) as well as pip (>= 15.0+).

## 1. Getting an API Key

Start by obtaining an API key. You can get one [here](https://app.dfuse.io).

## 2. Install the Dependencies

First, we need to install a few dependencies using `pip`.

{{< tabs "install-dependencies" >}}
{{< tab lang="shell" >}}
pip install grpcio grpcio-tools protobuf six
{{< /tab >}}
{{< /tabs >}}

## 3. Import the Depencies

Next, we will start coding. The first thing we need to do is to import the dependencies we just installed.

{{< tabs "import-deps" >}}
{{< tab lang="python" title="main.py" opts="linenos=table" >}}
import http.client
import json
import sys
import grpc
from graphql import graphql_pb2_grpc
from graphql.graphql_pb2 import Request
{{< /tab >}}
{{< /tabs >}}

## 3. Authenticate with the API

For our requests to work, we need to obtain a JWT token that we will send with every request. This can be obtained using the API key we created in step 1.

{{< tabs "generate-jwt" >}}
{{< tab lang="python" title="main.py" opts="linenos=table,linenostart=7" >}}
def token_for_api_key(apiKey):
    connection = http.client.HTTPSConnection("auth.dfuse.io")
    connection.request('POST', '/v1/auth/issue', json.dumps({"api_key": apiKey}))
    response = connection.getresponse()

    if response.status != 200:
        raise Exception(f" Status: {response.status} reason: {response.reason}")

    token = json.load(response)['token']
    connection.close()

    return token

token = token_for_api_key("web_abcdef12345678900000000000")
{{< /tab >}}
{{< /tabs >}}

## 4. Create a gRPC connection

Next, we will create a gRPC connection to the dfuse API. We must specify the [Ethereum API Endpoint]({{< ref "reference/ethereum/endpoints" >}}) or [EOSIO API Endpoint]({{< ref "reference/ethereum/endpoints" >}}) we want to connect to - in this case we are using `mainnet.eos.dfuse.io`.

{{< tabs "create-client" >}}
{{< tab lang="python" title="main.py" opts="linenos=table,linenostart=21" >}}
def create_dfuse_client(token):
    credentials = grpc.access_token_call_credentials(token)
    channel_credentials = grpc.composite_channel_credentials(grpc.ssl_channel_credentials(), credentials)
    channel = grpc.secure_channel('mainnet.eos.dfuse.io', credentials=channel_credentials)

    return graphql_pb2_grpc.GraphQLStub(channel)

dfuse_graphql = create_dfuse_client(token)
{{< /tab >}}
{{< /tabs >}}

## 5. Crafting our GraphQL Query

Next, we will create our GraphQL query. Here, we will use a GraphQL subscription to enable us to stream results as they come. We will use the `searchTransactionsForward` operation, with the `"action:transfer"` query (See the [Search Query Language reference here]({{< ref "/reference/eosio/search" >}})).

{{< tabs "graphql-query" >}}
{{< tab lang="python" title="main.py" opts="linenos=table,linenostart=29" >}}
query = '''
subscription {
  searchTransactionsForward(query: "action:transfer", limit:10) {
    trace {
      id
      matchingActions{
        account
        receiver
        name 
        json
      }
    }
  }
}
'''
{{< /tab >}}
{{< /tabs >}}

## 6. Execute the Query and Parse the Results

Finally, we will use the gRPC client to execute the GraphQL request, and we can loop over the results to print them to the console.

{{< tabs "execute-query" >}}
{{< tab lang="python" title="main.py" opts="linenos=table,linenostart=44" >}}
stream = dfuse_graphql.Execute(Request(query=query))

for rawResult in stream:
    result = json.loads(rawResult.data)
    print(result['searchTransactionsForward']['trace']['matchingActions'])
{{< /tab >}}
{{< /tabs >}}


## Additional Information

A complete code sample using GraphQL with Python is available on [Github](https://github.com/dfuse-io/example-graphql-python).