#!/bin/bash
echo "Content-type: text/plain\n\n"
echo

read param
num=$(basename $param)
path=$(dirname $param)

if grep "$num" "../tests/$path" > /dev/null
then
	full=$(tr -d '\r\n' < ../tests/$path)
	
	first=$(echo $full | awk -F"<number>$num</number>" '{print $1}' | awk -F"<test>" '
		{
			for(i = 1; i < NF; i++)
			{
				printf("%s", $i)
				if(i < NF - 1)
					printf("<test>")
			}
		}')
		
	last=$(echo $full | awk -F"<number>$num</number>" '{print $2}' | awk -F"</test>" '
		{
			for(i = 2; i <= NF; i++)
			{
				printf("%s", $i)
				if(i < NF)
					printf("</test>")
			}
		}' | awk -F"<number>|</number>" '
			{
				for(i = 1; i <= NF; i ++)
				{
					if(i%2 != 0)
						printf("%s", $i)
					else
					{
						new_num = $i - 1
						printf("<number>%s</number>", new_num)
					}
				}
			}')
	
	echo "$first$last" | sudo tee ../tests/$path
fi
