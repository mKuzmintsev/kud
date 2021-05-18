#!/bin/sh
echo "Content-type: text/plain\n\n"
echo
sudo rm -Rf /mnt/cf/base/web/varlog/*
fl=$(ls /var/log)
for f in $fl
do
	sudo ln -s /var/log/$f /mnt/cf/base/web/varlog/$f
done
echo $fl
