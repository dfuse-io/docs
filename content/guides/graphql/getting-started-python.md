---
weight: 1
title: "Getting Started with Python"
---

# Getting Started with Python

In this guide, we will show you how to create a basic setup so you can benefit from the dfuse GraphQL API with Python.

## Requirements

You will need Python (>= 3.4+) as well as pip (>= 15.0+).

## 1. Getting an API Key

Start by obtaining an API key. You can get one [here](https://app.dfuse.io).

## 2. Install the Dependencies

First, you need to install a few dependencies using `pip`.

{{< tabs "install-dependencies" >}}
{{< tab lang="shell" >}}
pip install grpcio grpcio-tools protobuf six
{{< /tab >}}
{{< /tabs >}}

## 3. Import the Depencies

Next, you will start coding. Begin by importing the dependencies you just installed.

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

## 4. Authenticate with the API

To authenticate your requests, you will need to obtain a JWT token that you will send with each request. This can be obtained using the API key you created in step 1.

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

## 5. Create a gRPC connection

Next, you will create a gRPC connection to the dfuse API. You must specify the [Ethereum API Endpoint]({{< ref "reference/ethereum/endpoints" >}}) or [EOSIO API Endpoint]({{< ref "reference/ethereum/endpoints" >}}) you want to connect to. This example connectes to the EOS mainnet.

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

## 6. Crafting Your GraphQL Query

Next, you will create our GraphQL query. You will use a GraphQL subscription to stream results as they come. You will use the `searchTransactionsForward` operation, with the `"action:transfer"` query (See the [Search Query Language reference here]({{< ref "/reference/eosio/search" >}})).

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

## 7. Execute the Query and Parse the Results

Finally, you will use the gRPC client to execute the GraphQL request, and you can loop over the results to print them to the console.

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