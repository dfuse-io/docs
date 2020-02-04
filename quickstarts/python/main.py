# CODE:BEGIN:quickstarts_python_eos_section5
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
# CODE:END:quickstarts_python_eos_section5

# CODE:BEGIN:quickstarts_python_eos_section1
def get_token(api_key):
    connection = HTTPSConnection("auth.dfuse.io")
    connection.request('POST', '/v1/auth/issue', json.dumps({"api_key": api_key}), {'Content-type': 'application/json'})
    response = connection.getresponse()

    if response.status != 200:
        raise Exception(" Status: %s reason: %s" % (response.status, response.reason))

    token = json.loads(response.read().decode())['token']
    connection.close()

    return token
# CODE:END:quickstarts_python_eos_section1
# CODE:BEGIN:quickstarts_python_eos_section2
def create_client(endpoint):
    dfuse_api_key = os.environ.get("DFUSE_API_KEY")
    if dfuse_api_key == None:
        raise Exception("you must specify a DFUSE_API_KEY environment variable")

    channel = grpc.secure_channel(endpoint,
        credentials = grpc.composite_channel_credentials(
            grpc.ssl_channel_credentials(),
            grpc.access_token_call_credentials(get_token(dfuse_api_key))
    ))

    return graphql_pb2_grpc.GraphQLStub(channel)
# CODE:END:quickstarts_python_eos_section2

#
## Ethereum
#

OPERATION_ETH = """subscription {
  searchTransactions(indexName:CALLS query: "-value:0 type:call", lowBlockNum: -1) {
    undo cursor
    node { hash matchingCalls { caller address value(encoding:ETHER) } }
  }
}"""

def stream_ethereum():
    # The client can be re-used for all requests, cache it at the appropriate level
    client = create_client('mainnet.eth.dfuse.io:443')
    stream = client.Execute(Request(query = OPERATION_ETH))

    for rawResult in stream:
        if rawResult.errors:
            print("An error occurred")
            print(rawResult.errors)
        else:
            result = json.loads(rawResult.data)
            for call in result['searchTransactions']['node']['matchingCalls']:
                undo = result['searchTransactions']['undo']
                print("Transfer %s -> %s [%s Ether]%s" % (call['caller'], call['address'], call['value'], " REVERTED" if undo else ""))

#
## EOSIO
#

# CODE:BEGIN:quickstarts_python_eos_section3
OPERATION_EOS = """subscription {
  searchTransactionsForward(query:"receiver:eosio.token action:transfer") {
    undo cursor
    trace { id matchingActions { json } }
  }
}"""
# CODE:END:quickstarts_python_eos_section3
# CODE:BEGIN:quickstarts_python_eos_section4
def stream_eosio():
  	# The client can be re-used for all requests, cache it at the appropriate level
    client = create_client('mainnet.eos.dfuse.io:443')
    stream = client.Execute(Request(query = OPERATION_EOS))

    for rawResult in stream:
        if rawResult.errors:
            print("An error occurred")
            print(rawResult.errors)
        else:
            result = json.loads(rawResult.data)
            for action in result['searchTransactionsForward']['trace']['matchingActions']:
                undo = result['searchTransactionsForward']['undo']
                data = action['json']
                print("Transfer %s -> %s [%s]%s" % (data['from'], data['to'], data['quantity'], " REVERTED" if undo else ""))
# CODE:END:quickstarts_python_eos_section4
# CODE:BEGIN:quickstarts_python_eos_section6
# DFUSE_API_KEY="server_abcdef12345678900000000000" python main.py eosio|ethereum
proto = ""
if len(sys.argv) > 1:
    proto = sys.argv[1].lower()

if proto == "ethereum" or proto == "ETH":
    stream_ethereum()
else:
    stream_eosio()
# CODE:END:quickstarts_python_eos_section6