#!/bin/bash
echo "start git pull"
git pull
echo "start generate"
node ./cli/bin/r-gen $1
echo "end generate"