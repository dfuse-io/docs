#!/bin/bash -eu

ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
TMP=$(mktemp -d tmp-XXXXXXXX)

pushd $TMP >/dev/null
  curl -sLO --fail https://github.com/dfuse-io/graphql-over-grpc/archive/master.zip
  unzip -q master.zip
  pushd graphql-over-grpc-master >/dev/null
    protoc graphql/graphql.proto --go_out=plugins=grpc:.
    mkdir -p $ROOT/pb
    mv graphql/graphql.pb.go $ROOT/pb/
    echo "GENERATED $ROOT/pb/graphql.pb.go"
  popd >/dev/null
popd >/dev/null
rm -rf $TMP
