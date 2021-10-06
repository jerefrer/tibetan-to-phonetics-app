#!/bin/sh

for file in `git st | grep "\.js" | grep -v "\-dist" | sed s/.*modified:\ *// | sed "s/.*renamed:.* -> //" | sed "s/\s*//" | uniq`
do
  touch $file
  sleep 1
done
