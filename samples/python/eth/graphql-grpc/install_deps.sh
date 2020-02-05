#!/usr/bin/env bash

ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"SH

main() {
  current_dir="`pwd`"
  trap "cd \"$current_dir\"" EXIT
  pushd "$ROOT" &> /dev/null

  if [[ $1 == "--help" ]]; then
    usage
    exit 0
  fi

  # Not Windows friendly, need to be adapted here to be Windows aware
  python3 -m venv env
  source env/bin/activate
  pip3 install -r requirements.txt
}

usage() {
  echo "usage: install_deps"
  echo ""
  echo "Setup Python virtualenv environment and install all necessary"
  echo "dependencies for this project. Requires venv to be available"
  echo "in PATH and scripts expects a pip version '>= 15.0'."
  echo ""
  echo "Python3 is required also. No support for Python2 is provided"
}

main $@