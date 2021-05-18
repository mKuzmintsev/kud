#!/bin/sh
echo "Content-type: text/plain\n\n"
echo
read type
if [ $type = "base" ]
then
	sudo /mnt/cf/base/uninstall.sh
else
	sudo /mnt/cf/system/uninstall.sh
fi
sudo reboot
