#!/bin/sh
echo "Content-type: text/plain\n\n"
echo
read type
sudo cat /mnt/cf/firmwares/$type/config/version
echo "current"
sudo cat /mnt/cf/$type/config/version
