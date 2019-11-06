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

#
# Code from getting started will go here ...
#

dfuse_api_key = os.environ.get("DFUSE_API_KEY")
if dfuse_api_key == None or dfuse_api_key == 'your dfuse api key here':
    raise Exception('you must specify a DFUSE_API_KEY environment variable')

token = get_token(dfuse_api_key)
# The client can be re-used for all requests, cache it at the appropriate level

client = create_client(token, 'mainnet.eth.dfuse.io:443')
stream_ethereum(client)
