#!/usr/bin/env bash

ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

main() {
  current_dir="`pwd`"
  trap "cd \"$current_dir\"" EXIT
  pushd "$ROOT" &> /dev/null

  if [[ $1 == "--help" ]]; then
    usage
    exit 0
  fi

  pip3 freeze -r requirements.txt > requirements.txt
}

usage() {
  echo "usage: update_deps"
  echo ""
  echo "Freeze the actual dependencies and update the requirements.txt file"
  echo "used to store them."
}

main $@