#!/bin/bash
#Проверка соединений для одноэтажных вагонов не ППФ: 4447, 4458, 4440, 4445
echo "Content-type: text/plain\n\n";
echo
rnd=$(mktemp)
if [ -z $1 ]
then
	read param
else
	param=$1
fi
ip1="10.241.$param"
ip2="10.251.$param"
ip3="10.252.$param"
ip4="10.253.$param"

if ! ping -c3 $ip1 > /dev/null
then
	noresp1=1
else
	noresp1=0
fi
if ! ping -c3 $ip2 > /dev/null
then
	noresp2=1
else
	noresp2=0
fi
if ! ping -c3 $ip3 > /dev/null
then
	noresp3=1
else
	noresp3=0
fi
if ! ping -c3 $ip4 > /dev/null
then
	noresp4=1
else
	noresp4=0
fi

MACADDR="[0-9,ABCDEF][0-9,ABCDEF] [0-9,ABCDEF][0-9,ABCDEF] [0-9,ABCDEF][0-9,ABCDEF] [0-9,ABCDEF][0-9,ABCDEF] [0-9,ABCDEF][0-9,ABCDEF] [0-9,ABCDEF][0-9,ABCDEF]"

if [ $noresp1 -eq 0 ]
then
	mac1=$(snmpget -v 1 -c private $ip1 1.3.6.1.4.1.21108.81.1.32.0 | grep -o "$MACADDR")
fi
if [ $noresp2 -eq 0 ]
then
	mac2=$(snmpget -v 1 -c private $ip2 1.3.6.1.4.1.21108.81.1.32.0 | grep -o "$MACADDR")
fi
if [ $noresp3 -eq 0 ]
then
	mac3=$(snmpget -v 1 -c private $ip3 1.3.6.1.4.1.21108.81.1.32.0 | grep -o "$MACADDR")
fi
if [ $noresp4 -eq 0 ]
then
	mac4=$(snmpget -v 1 -c private $ip4 1.3.6.1.4.1.21108.81.1.32.0 | grep -o "$MACADDR")
fi

if [ $noresp1 -eq 0 ]
then
	echo "Коммутатор№1 доступен"
else
	echo "Коммутатор№1 недоступен"
fi

if [ $noresp2 -eq 0 ]
then
	snmpwalk -v 1 -c private $ip2 1.0.8802.1.1.2.1.4.1 > $rnd
fi
if grep '\.7\.[0-9]\{1,\} = STRING: "Slot0/7"' $rnd > /dev/null && grep "\.7\.[0-9]\{1,\} = Hex-STRING: $mac4" $rnd > /dev/null
then
	echo "Коммутатор L1 порт№7 <---> Коммутатор L3 порт№7 Есть"
else
	echo "Коммутатор L1 порт№7 <---> Коммутатор L3 порт№7 Нет"
fi
if grep '\.9\.[0-9]\{1,\} = STRING: "Slot0/3"' $rnd > /dev/null && grep "\.9\.[0-9]\{1,\} = Hex-STRING: $mac3" $rnd > /dev/null
then
	echo "Коммутатор L1 порт№9 <---> Коммутатор L2 порт№3 Есть"
else
	echo "Коммутатор L1 порт№9 <---> Коммутатор L2 порт№3 Нет"
fi

if [ $noresp3 -eq 0 ]
then
	snmpwalk -v 1 -c private $ip3 1.0.8802.1.1.2.1.4.1 > $rnd
fi
if grep '\.10\.[0-9]\{1,\} = STRING: "Slot0/8"' $rnd > /dev/null && grep "\.10\.[0-9]\{1,\} = Hex-STRING: $mac4" $rnd > /dev/null
then
	echo "Коммутатор L2 порт№10 <--> Коммутатор L3 порт№8 Есть"
else
	echo "Коммутатор L2 порт№10 <--> Коммутатор L3 порт№8 Нет"
fi
rm -f $rnd
