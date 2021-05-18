#!/bin/sh
echo "Content-type: text/plain\n\n"
echo
read type
if tar -tf /tmp/$type.tgz
then
	sudo mkdir /mnt/cf/firmwares
	sudo rm -Rf /mnt/cf/firmwares/$type
	sudo tar -zxf /tmp/$type.tgz -C /mnt/cf/firmwares
	echo "OK"
fi
