#!/bin/bash -e

ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && cd tests && pwd )"

CONTAINER_NAME=${CONTAINER_NAME:-"nodeos-eosio.forum"}

set +e
container=`docker ps | grep ${CONTAINER_NAME}`
exit_code=$?
if [[ $exit_code != 0 ]]; then
    exit 0
fi
set -e

# Just in case, maybe delete the previous temp that might have not been deleted before
docker rm "${CONTAINER_NAME}-temp" &> /dev/null || true

# Renamed previous container to temp name and delete it
echo "Renaming container prior removal"
docker rename "${CONTAINER_NAME}" "${CONTAINER_NAME}-temp" &> /dev/null || true

echo "Removing container"
docker kill -s TERM "${CONTAINER_NAME}-temp"
