#!/bin/sh

for file in `ls ./javascripts/*.js`
do
  touch $file
  sleep 1
done

for file in `ls ./javascripts/**/*.js`
do
  touch $file
  sleep 1
done