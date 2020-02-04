# CODE:BEGIN:quickstarts_python_ethereum_section1
try:
    # python3
    from http.client import HTTPSConnection
except ImportError:
    # python2
    from httplib import HTTPSConnection

import grpc
import json
import os
import ssl
import sys

from graphql import graphql_pb2_grpc
from graphql.graphql_pb2 import Request
# CODE:END:quickstarts_python_ethereum_section1

# CODE:BEGIN:quickstarts_python_ethereum_section2
def get_token(api_key):
    connection = HTTPSConnection("auth.dfuse.io")
    connection.request('POST', '/v1/auth/issue', json.dumps({"api_key": api_key}), {'Content-type': 'application/json'})
    response = connection.getresponse()

    if response.status != 200:
        raise Exception(" Status: %s reason: %s" % (response.status, response.reason))

    token = json.loads(response.read().decode())['token']
    connection.close()

    return token
# CODE:END:quickstarts_python_ethereum_section2

# CODE:BEGIN:quickstarts_python_ethereum_section3
def create_client(token, endpoint):
    channel = grpc.secure_channel(endpoint,
        credentials = grpc.composite_channel_credentials(
            grpc.ssl_channel_credentials(),
            grpc.access_token_call_credentials(token)
    ))

    return graphql_pb2_grpc.GraphQLStub(channel)
# CODE:END:quickstarts_python_ethereum_section3

# CODE:BEGIN:quickstarts_python_ethereum_section4
OPERATION_ETH = """subscription {
  searchTransactions(indexName: CALLS, query: "-value:0 type:call", lowBlockNum: -1) {
    undo cursor
    node { hash matchingCalls { from to value(encoding:ETHER) } }
  }
}"""
# CODE:END:quickstarts_python_ethereum_section4

# CODE:BEGIN:quickstarts_python_ethereum_section5
def stream_ethereum(client):
    # The client can be re-used for all requests, cache it at the appropriate level
    stream = client.Execute(Request(query = OPERATION_ETH))

    for rawResult in stream:
        if rawResult.errors:
            print("An error occurred")
            print(rawResult.errors)
        else:
            result = json.loads(rawResult.data)
            for call in result['searchTransactions']['node']['matchingCalls']:
                undo = result['searchTransactions']['undo']
                print("Transfer %s -> %s [%s Ether]%s" % (call['from'], call['to'], call['value'], " REVERTED" if undo else ""))
# CODE:END:quickstarts_python_ethereum_section5

# CODE:BEGIN:quickstarts_python_ethereum_section6
dfuse_api_key = os.environ.get("DFUSE_API_KEY")
if dfuse_api_key == None or dfuse_api_key == 'your dfuse api key here':
    raise Exception('you must specify a DFUSE_API_KEY environment variable')

token = get_token(dfuse_api_key)
# The client can be re-used for all requests, cache it at the appropriate level

client = create_client(token, 'mainnet.eth.dfuse.io:443')
stream_ethereum(client)
# CODE:END:quickstarts_python_ethereum_section6