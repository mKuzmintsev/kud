#!/bin/sh
echo "Content-type: text/plain\n\n"
echo
ip=$(sudo ifconfig | grep "inet addr" | awk -F":" '{if($3 ~ "10.10.255.255*"){print $2; exit}}' | awk -F" " '{print $1}')
echo $ip
