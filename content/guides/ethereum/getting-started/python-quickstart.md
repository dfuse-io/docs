---
weight: 3
---

# Python Quickstart

This simple program demonstrates how easy it is to query our GraphQL API over gRPC in Python. Here is an overview of what it does.

1. Request a token from our authentication API
1. Creates a gRPC connection with credentials
1. Instantiates a GraphQL client
1. Executes a simple GraphQL query
1. Prints the response

## Requirements

You will need to have Python3 (>= 3.4+) as well as `virtualenv` and `pip`
`>= 15.0+`.

We use a virtual environment for this example, all dependencies are listed
in the `requirements.txt` at the root of this project.

{{< tabs "getting-started-python" >}}
{{< tab lang="python" >}}
import http.client
import json
import ssl
import sys

import grpc

from graphql import graphql_pb2_grpc
from graphql.graphql_pb2 import Request

ssl._create_default_https_context = ssl._create_unverified_context


def token_for_api_key(apiKey):
    connection = http.client.HTTPSConnection("auth.dfuse.io")
    connection.request('POST', '/v1/auth/issue', json.dumps({"api_key": apiKey}))
    response = connection.getresponse()

    if response.status != 200:
        raise Exception(f" Status: {response.status} reason: {response.reason}")

    token = json.load(response)['token']
    connection.close()

    return token


def create_dfuse_client():
    credentials = grpc.access_token_call_credentials(token_for_api_key(sys.argv[1]))
    channel = grpc.secure_channel('mainnet.eos.dfuse.io:443',
                                  credentials=grpc.composite_channel_credentials(grpc.ssl_channel_credentials(),
                                                                                 credentials))
    return graphql_pb2_grpc.GraphQLStub(channel)


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

dfuse_graphql = create_dfuse_client()
stream = dfuse_graphql.Execute(Request(query=query))

for rawResult in stream:
    result = json.loads(rawResult.data)
    print(result['searchTransactionsForward']['trace']['matchingActions'])
{{< /tab >}}
{{< /tabs >}}

## Quickstart

First of all, visit [https://app.dfuse.io](https://app.dfuse.io) to get
a free API key for your project.

First, clone this repository to your work folder:

{{< tabs "getting-started-python-clone-repo" >}}
{{< tab lang="shell" >}}
git clone https://github.com/dfuse-io/example-graphql-python.git
cd example-graphql-python
{{< /tab >}}
{{< /tabs >}}

Setup the virtual environment and pull all dependencies:

{{< tabs "getting-started-python-setup-env" >}}
{{< tab lang="shell" >}}
./install_deps.sh
{{< /tab >}}
{{< /tabs >}}

Once your environment is setup properly, simply run the `example.py` script:

{{< tabs "getting-started-python-run" >}}
{{< tab lang="shell" >}}
python3 example.py YOUR_API_KEY_HERE
{{< /tab >}}
{{< /tabs >}}

<!-- Hiding these links for now, because they are all specific to EOSIO -->
<!-- ## Useful links

- Docs: [dfuse Search query language](#dfuse-query-language)
- On mainnet: [GraphiQL](https://mainnet.eos.dfuse.io/graphiql/) A graphic graphql editor and API documentation browser. -->
