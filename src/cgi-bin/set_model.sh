#!/bin/sh
echo "Content-type: text/plain\n\n"
echo
read model
sudo sh -c "echo $model > /mnt/cf/base/config/model.conf"
