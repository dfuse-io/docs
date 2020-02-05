#!/usr/bin/env bash

ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

BROWN='\033[0;33m'
NC='\033[0m'

printf "${BROWN}Deleting 'build' directory${NC}\n"
rm -rf "$ROOT/build"
