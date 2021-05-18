#!/bin/sh
echo "Content-type: text/plain\n\n"
echo
sudo ifconfig | grep HWaddr | awk -F"HWaddr " '
{
	if(index($1, "eth0") > 0)
	{
		for(i = 1; i < length($2); i ++)
		{
			cur = substr($2, i, 1)
			if(cur != ":" && cur != " ")
				printf("%s", cur)
		}
		exit
	}
}'
