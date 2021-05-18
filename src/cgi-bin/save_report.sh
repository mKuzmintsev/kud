#!/bin/bash
echo "Content-type: text/plain\n\n"
echo
read text
rnd=$(mktemp)
echo $text > $rnd
date=$(date +%d.%m.%Y_%H:%M:%S)
sudo touch "/mnt/cf/base/web/reports/$date.txt"
sudo cp $rnd /mnt/cf/base/web/reports/$date.txt
rm $rnd
echo "$date.txt"
