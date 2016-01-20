#!/usr/bin/env bash

usage() {
    echo "Usage: $0 [major | minor | patch]" >&2
    exit 1
}

RELEASE_TYPE=$1
RELEASE_MSG=$2

if [[ ( "$#" -ne 2 ) || ( "$RELEASE_TYPE" != "major" && "$RELEASE_TYPE" != "minor" &&  "$RELEASE_TYPE" != "patch" ) ]]; then
    usage
fi

echo "$RELEASE_MSG" > .vmessage

npm version "$RELEASE_TYPE" -m "$RELEASE_MSG"

rm .vmessage