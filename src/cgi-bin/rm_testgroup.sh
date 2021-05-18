#!/bin/bash
echo "Content-type: text/plain\n\n"
echo

read param

full=$(tr -d '\r\n' < ../test_list.xml)

first=$(echo $full | awk -F"<fname>$param</fname>" '{print $1}' | awk -F"<test>" '
	{
		for(i = 1; i < NF; i++)
		{
			printf("%s", $i)
			if(i < NF - 1)
				printf("<test>")
		}
	}')
	
last=$(echo $full | awk -F"<fname>$param</fname>" '{print $2}' | awk -F"</test>" '
	{
		for(i = 2; i <= NF; i++)
		{
			printf("%s", $i)
			if(i < NF)
				printf("</test>")
		}
	}')
	
echo "$first$last" | sudo tee ../test_list.xml
sudo rm ../tests/$param
