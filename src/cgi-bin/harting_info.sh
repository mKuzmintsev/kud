#!/bin/sh
echo "Content-type: text/plain\n\n";
echo
if [ -z $1 ]
then
	read ip
else
	ip=$1
fi
if ! ping -c3 $ip > /dev/null
then
	echo "Коммутатор недоступен. Проверьте правильность подключения."
	exit 0
fi

#get IP-address
snmpget -v 1 -c private $ip 1.3.6.1.4.1.21108.27.1.5.1.2.19 | awk -F": " '{print "IP-address: " $2}'

#get subnet mask
snmpget -v 1 -c private $ip 1.3.6.1.4.1.21108.27.1.5.1.3.19 | awk -F"IpAddress: " '{print "Netmask: " $2}'

#get switch type
snmpget -v 1 -c private $ip 1.3.6.1.2.1.1.1.0 | awk -F": " '{print "Switch type: " $2}'

#get firmware version
snmpget -v 1 -c private $ip 1.3.6.1.4.1.21108.81.1.3.0 | awk -F"\"" '{print "Firmware version: " $2}'

#get port count
snmpget -v 1 -c private $ip 1.3.6.1.4.1.21108.1000.1.0 | awk -F": " '{print "Port count: " $2}'

#get MAC-address
snmpget -v 1 -c private $ip 1.3.6.1.4.1.21108.81.1.32.0 | awk -F": " '{print "MAC-address: " $2}'

#get RSTP status
rstp=$(snmpget -v 1 -c private $ip 1.3.6.1.4.1.21108.119.1.3.1.3.0 | grep "INTEGER: 1")
if [ -n "$rstp" ]
then
	echo "RSTP ON"
else
	echo "RSTP OFF"
fi

echo "QoS priority mapping:"
for i in `seq 1 10`
do
	echo "port $i:"
	#get 0 priority for port i
	snmpget -v 1 -c private $ip 1.3.6.1.4.1.21108.1006.2.1.1.3.$i.0 | awk -F": " '{print "\tpriority 0->" $2}'
done

#get MAC address table
#snmpwalk -v 1 -c private $ip 1.3.6.1.2.1.17.4.3.1 | awk '
#BEGIN {
#	count = 0
#}
#{
#	if(NR <= count + 1)
#	{
#		curmac = substr($0, index($0, "G: ") + 3)
#		if(index($0, "G: ") > 0)
#		{
#			mac[count + 1] = curmac
#			count ++
#		}
#	}
#	if(NR > count && NR <= 2*count)
#		port[NR - count] = substr($0, index($0, "R: ") + 3)
#}
#END {
#	print "MAC-address table:"
#	for(i = 1; i <= count; i++)
#		print "\ton port " port[i] " MAC-address " mac[i]
#}'

#get vlans & vlans ports info
rnd=$(mktemp)
snmpwalk -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.4.1.2.0 > $rnd
snmpwalk -v 1 -c private $ip 1.3.6.1.2.1.17.7.1.4.3.1 >> $rnd
awk -F"4.3.1." '
{
	if($1 ~ /21108/)
	{
		vlan[NR] = substr($1, 49, index($1, " = ") - 49)
		count = length(vlan)
	}
	if($2 ~ /1\./)
		name[NR - count] = substr($2, index($2, "\""))
	if($2 ~ /2\./)
		mem[NR - 2*count] = substr($2, index($2, "G: ") + 3)
	if($2 ~ /3\./)
		forb[NR - 3*count] = substr($2, index($2, "G: ") + 3)
	if($2 ~ /4\./)
		untg[NR - 4*count] = substr($2, index($2, "G: ") + 3)
}
END {
	print "VLANS:"
	for(i = 1; i <= count; i++)
	{
		printf("\tid: %d\n\tname: %s\n\tmember ports: ", vlan[i], name[i])
		get_ports(mem[i])
		printf("\tforbidden ports: ")
		get_ports(forb[i])
		printf("\tuntagged ports: ")
		get_ports(untg[i])
	}
}
function get_ports(hex)
{
	for(j = 1; j <= 2; j++)
	{
		cur = substr(hex, j, 1)
		if(cur >= 8 || cur == "A" || cur == "B" || cur == "C" || cur == "D" || cur == "E" || cur == "F")
		{
			if(cur == 8 || cur == 9)
				cur = cur - 8
			if(cur == "A")
				cur = 2
			if(cur == "B")
				cur = 3
			if(cur == "C")
				cur = 4
			if(cur == "D")
				cur = 5
			if(cur == "E")
				cur = 6
			if(cur == "F")
				cur = 7
			port[1 + 4*(j-1)] = 1
		}
		else
			port[1 + 4*(j-1)] = 0
		if(cur >= 4)
		{
			cur = cur - 4
			port[2 + 4*(j-1)] = 1
		}
		else
			port[2 + 4*(j-1)] = 0
		if(cur >= 2)
		{
			cur = cur - 2
			port[3 + 4*(j-1)] = 1
		}
		else
			port[3 + 4*(j-1)] = 0
		if(cur == 1)
			port[4 + 4*(j-1)] = 1
		else
			port[4 + 4*(j-1)] = 0
	}
	cur = substr(hex, 4, 1)
	if(cur == "C")
	{
		port[9] = 1
		port[10] = 1
	}
	else
	{
		if(cur == 0)
		{
			port[9] = 0
			port[10] = 0
		}
		else
		{
			if(cur == 8)
			{
				port[9] = 1
				port[10] = 0
			}
			else
			{
				port[9] = 0
				port[10] = 1
			}
		}
	}
	for(j = 1; j <= 10; j++)
		if(port[j] == 1)
			printf("%d ", j)
	printf("\n")
}' $rnd

#get PVID for all ports
snmpwalk -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.7.1.1 | awk -F"Gauge32: " '
BEGIN {
	print "port ~ PVID:" 
}
{
	print "\t" NR " ~ " $2
}'

#get LLDP info
snmpwalk -v 1 -c private $ip 1.0.8802.1.1.2.1.4 | awk -F" = " '
BEGIN {
	count = 0
}
{
	if(NR <= count + 1)
	{
		i = split($1, mas, ".")
		curport = mas[i-1]
		if(myport[1] != curport)
		{
			myport[count + 1] = curport
			count ++
		}
	}
	if(NR > count && NR <= 2*count)
		mac[NR - count] = substr($2, index($2, "G: ") + 3)
	if(NR > 3*count && NR <= 4*count)
		port[NR - 3*count] = substr($2, index($2, "G: ") + 3)
	if(NR > 9*count && NR <= 10*count && $2 == "INTEGER: 2")
	{
		n = split($1, array, ".")
		tmp = 0
		for(i = 1; i <= count; i ++)
		{
			if(myport[i] == array[n-7])
				tmp = i
		}
		if(tmp > 0)
		{
			ip1[tmp] = array[n-3]
			ip2[tmp] = array[n-2]
			ip3[tmp] = array[n-1]
			ip4[tmp] = array[n]
		}
	}
}
END {
	print "LLDP neighbours:"
	for(i = 1; i <= count; i ++)
		print "\ton port " myport[i] ":\n\tMAC-address: " mac[i] "\n\tport: " port[i] "\n\tIP-address: " ip1[i] "." ip2[i] "." ip3[i] "." ip4[i]
}'
