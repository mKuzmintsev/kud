#!/bin/sh
echo "Content-type: text/plain\n\n"
echo
read fname
cat /mnt/cf/base/web/reports/$fname
