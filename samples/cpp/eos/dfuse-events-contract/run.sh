#!/bin/bash -e

ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && cd tests && pwd )"

CONTAINER_NAME=${CONTAINER_NAME:-"nodeos-eosio.forum"}
NODEOS_CONTAINER=${NODEOS_CONTAINER:-"eosio/eos"}
NODEOS_VERSION=${NODEOS_VERSION:-"v1.4.4"}

image_id="${NODEOS_CONTAINER}:${NODEOS_VERSION}"

sh $ROOT/../stop.sh
echo ""

rm -rf "$ROOT/blocks/" "$ROOT/state/"

set +e
images=`docker images | grep -E "${NODEOS_CONTAINER}\s+${NODEOS_VERSION}"`
exit_code=$?
if [[ $exit_code != 0 ]]; then
    echo "Docker image [${image_id}] does not exist yet, pulling it..."
    docker pull ${image_id}
fi
set -e

docker run -d -ti --name "${CONTAINER_NAME}" \
       -v "$ROOT:/app" \
       -v "$ROOT:/etc/nodeos" \
       -v "$ROOT:/data" \
       -p 127.0.0.1:9898:9898 -p 127.0.0.1:9876:9876 \
       ${NODEOS_CONTAINER}:${NODEOS_VERSION} \
       /opt/eosio/bin/nodeos --config-dir="/etc/nodeos" --data-dir="/data" --genesis-json="/etc/nodeos/genesis.json" 1> /dev/null

# Give time to Docker to boot up
sleep 3

pushd $ROOT &> /dev/null
eos-bios boot boot_sequence.yaml --reuse-genesis --api-url http://localhost:9898 1> /tmp/${CONTAINER_NAME}-eos-bios-boot.log
echo "Boot completed"
echo ""
popd &> /dev/null

echo "Environment ready"
echo " API URL: http://localhost:9898"
echo " Info: eosc -u http://localhost:9898 get info"
echo " Logs: docker logs -f ${CONTAINER_NAME}"
echo ""

