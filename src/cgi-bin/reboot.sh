#!/bin/sh
echo "Content-type: text/plain\n\n"
echo
read type
sudo touch /home/$type.tgz
sudo reboot
