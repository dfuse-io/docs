#!/bin/bash -eu

ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
TMP=$(mktemp -d tmp-XXXXXXXX)

pushd $TMP >/dev/null
  curl -sLO --fail https://github.com/dfuse-io/graphql-over-grpc/archive/master.zip
  unzip -q master.zip
  pushd graphql-over-grpc-master >/dev/null
    python -m grpc_tools.protoc -I . --python_out=. --grpc_python_out=. graphql/graphql.proto
    mkdir -p $ROOT/graphql
    mv graphql/{graphql_pb2_grpc.py,graphql_pb2.py} $ROOT/graphql/
    touch $ROOT/graphql/__init__.py
    echo GENERATED $ROOT/graphql/{graphql_pb2_grpc.py,graphql_pb2.py}
  popd >/dev/null
popd >/dev/null
rm -rf $TMP
