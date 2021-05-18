#!/bin/sh
echo "Content-type: text/plain\n\n"
echo
ls /mnt/cf/base/xml | grep -i kernel- | awk -F"-" '{print $2}'
echo
if [ -f /mnt/cf/base/web/hide_switch_menu ]; then
	echo "hide switches"
else
	echo "show switches"
fi
