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
    connection.request('POST', '/v1/auth/issue', json.dumps({"api_key": apiKey}), {'Content-type': 'application/json'})
    response = connection.getresponse()

    if response.status != 200:
        raise Exception(f" Status: {response.status} reason: {response.reason}")

    token = json.loads(response.read().decode())['token']
    connection.close()

    return token


def stub():
    credentials = grpc.access_token_call_credentials(token_for_api_key(sys.argv[1]))
    channel = grpc.secure_channel('mainnet.eos.dfuse.io:443',
                                  credentials=grpc.composite_channel_credentials(grpc.ssl_channel_credentials(),
                                                                                 credentials))
    return graphql_pb2_grpc.GraphQLStub(channel)


query = '''
subscription {
  searchTransactionsForward(query: "account:eosio.token receiver:eosio.token action:transfer", limit: 10) {
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

dfuse_graphql = stub()
stream = dfuse_graphql.Execute(Request(query=query))

for rawResult in stream:
    if rawResult.errors:
      print("An error occurred")
      print(rawResult.errors)
    else:
      result = json.loads(rawResult.data)
      print(result['searchTransactionsForward']['trace']['matchingActions'])
