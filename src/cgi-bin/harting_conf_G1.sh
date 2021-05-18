#!/bin/sh
#G1
echo "Content-type: text/plain\n\n";
echo 
if [ -z $1 ]
then
	read ip
else
	ip=$1
fi

touch /tmp/conflog.txt
chmod 777 /tmp/conflog.txt
sudo ifconfig eth0:hd1 down
sudo ifconfig eth0:hd2 down
sudo ifconfig eth1:hd1 192.168.0.254 netmask 255.255.255.0
sudo ifconfig eth1:hd2 192.168.1.254 netmask 255.255.0.0

echo "sets up IP-address $ip with mask 255.255.0.0...."
old=192.168.0.5
if ! ping -c3 $old > /dev/null
then
	old=192.168.0.126
fi
snmpset -v 1 -c private $old 1.3.6.1.4.1.21108.27.1.5.1.3.19 a 255.255.0.0 > /tmp/conflog.txt	#set subnet mask
sleep 5
snmpset -v 1 -c private $old 1.3.6.1.4.1.21108.27.1.5.1.2.19 a $ip >> /tmp/conflog.txt	#set new $ip-address

sudo ifconfig eth1:hd1 down
sudo ifconfig eth1:hd2 down
sudo ifconfig eth0:hd1 192.168.0.254 netmask 255.255.255.0
sudo ifconfig eth0:hd2 192.168.1.254 netmask 255.255.0.0

if ! ping -c3 $ip > /dev/null
then 
	echo "Wrong connection! Configuring fail!"
	exit 0
fi

echo "sets up max edges for RSTP..."
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.119.1.3.1.3.0 i 1 >> /tmp/conflog.txt	#activate
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.2.1.1.15.0 i 2100 >> /tmp/conflog.txt	#forward delay 21
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.2.1.1.13.0 i 4000 >> /tmp/conflog.txt	#max age 40

echo "sets up RSTP path cost parameters
	for ports 1,2 30k
	for ports 3,4,5,6, 100k
	for others - 400kk"
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.2.2.1.11.1 i 30000 >> /tmp/conflog.txt
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.2.2.1.11.2 i 30000 >> /tmp/conflog.txt
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.2.2.1.11.3 i 100000 >> /tmp/conflog.txt
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.2.2.1.11.4 i 100000 >> /tmp/conflog.txt
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.2.2.1.11.5 i 100000 >> /tmp/conflog.txt
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.2.2.1.11.6 i 100000 >> /tmp/conflog.txt
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.2.2.1.11.7 i 400000 >> /tmp/conflog.txt
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.2.2.1.11.8 i 400000 >> /tmp/conflog.txt
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.2.2.1.11.9 i 400000 >> /tmp/conflog.txt
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.2.2.1.11.10 i 400000 >> /tmp/conflog.txt

echo "disabling RSTP for M2 port"
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.2.2.1.4.9 i 2 >> /tmp/conflog.txt

echo "activating LLDP..."
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.158.1.2.0 i 1 >> /tmp/conflog.txt			#enable LLDP
snmpset -v 1 -c private $ip 1.0.8802.1.1.2.1.1.7.1.1.1.4.$ip x FFFFFFFF >> /tmp/conflog.txt		#activate "send $ip-address" option
snmpset -v 1 -c private $ip 1.0.8802.1.1.2.1.1.1.0 i 5 >> /tmp/conflog.txt				#set transmit interval = 5
snmpset -v 1 -c private $ip 1.0.8802.1.1.2.1.1.2.0 i 2 >> /tmp/conflog.txt				#set TTL mult$iplier = 2, so TTL = 10 sec

echo "creating VLANs...
	id=1, name=scdu, member ports=[1,2,3,4,5,6,7,8,10], untagged ports=[1,2,3,4,5,6,7,10]
	id=10, name=rzd, member ports=[1,2,3,4,5,6,8], untagged ports=[0]
	id=11, name=srv, member ports=[1,2,3,4,5,6,8], untagged ports=[0]
	id=12, name=moxa,  member ports=[1,2,3,4,5,6,8], untagged ports=[0]"
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.4.1.1.0.1 s "scdu" >> /tmp/conflog.txt	#set vlan1 name
snmpset -v 1 -c private $ip 1.3.6.1.2.1.17.7.1.4.3.1.4.1 x FE400000 >> /tmp/conflog.txt		#set vlan1 untagged ports 1,2,3,4,5,6,7,10
snmpset -v 1 -c private $ip 1.3.6.1.2.1.17.7.1.4.3.1.2.1 x FF400000 >> /tmp/conflog.txt		#set vlan1 members ports 1,2,3,4,5,6,7,8,10
if ! ping -c3 $ip > /dev/null
then
	echo "Wrong connection! Configuring fail!"
	exit 0
fi


snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.4.1.2.0.10 i 5 >> /tmp/conflog.txt		#create vlan10
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.4.1.2.0.10 i 1 >> /tmp/conflog.txt		#activate vlan10
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.4.1.1.0.10 s "rzd" >> /tmp/conflog.txt		#set vlan10 name
snmpset -v 1 -c private $ip 1.3.6.1.2.1.17.7.1.4.3.1.2.10 x FD000000 >> /tmp/conflog.txt		#set vlan10 members ports 1,2,3,4,5,6,8
snmpset -v 1 -c private $ip 1.3.6.1.2.1.17.7.1.4.3.1.4.10 x 00000000 >> /tmp/conflog.txt		#set vlan10 untagged ports 0

snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.4.1.2.0.11 i 5 >> /tmp/conflog.txt		#create vlan11
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.4.1.2.0.11 i 1 >> /tmp/conflog.txt		#activate vlan11
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.4.1.1.0.11 s "srv" >> /tmp/conflog.txt		#set vlan11 name
snmpset -v 1 -c private $ip 1.3.6.1.2.1.17.7.1.4.3.1.2.11 x FD000000 >> /tmp/conflog.txt		#set vlan11 members ports 1,2,3,4,5,6,8
snmpset -v 1 -c private $ip 1.3.6.1.2.1.17.7.1.4.3.1.4.11 x 00000000 >> /tmp/conflog.txt		#set vlan11 untagged ports 0

snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.4.1.2.0.12 i 5 >> /tmp/conflog.txt		#create vlan12
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.4.1.2.0.12 i 1 >> /tmp/conflog.txt		#activate vlan12
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.4.1.1.0.12 s "moxa" >> /tmp/conflog.txt		#set vlan12 name
snmpset -v 1 -c private $ip 1.3.6.1.2.1.17.7.1.4.3.1.2.12 x FD000000 >> /tmp/conflog.txt		#set vlan12 members ports 1,2,3,4,5,6,8
snmpset -v 1 -c private $ip 1.3.6.1.2.1.17.7.1.4.3.1.4.12 x 00000000 >> /tmp/conflog.txt		#set vlan12 untagged ports 0


echo "sets up PVID for ports...
	port ~ PVID
	1 ~ 1
	2 ~ 1
	3 ~ 1
	4 ~ 1
	5 ~ 1
	6 ~ 1
	7 ~ 1
	8 ~ 1
	9 ~ 1
	10 ~ 1"
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.7.1.1.1 u 1 >> /tmp/conflog.txt		#set pvid 1 for port 1
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.7.1.1.2 u 1 >> /tmp/conflog.txt		#set pvid 1 for port 2
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.7.1.1.3 u 1 >> /tmp/conflog.txt		#set pvid 1 for port 3
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.7.1.1.4 u 1 >> /tmp/conflog.txt		#set pvid 1 for port 4
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.7.1.1.5 u 1 >> /tmp/conflog.txt		#set pvid 1 for port 5
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.7.1.1.6 u 1 >> /tmp/conflog.txt		#set pvid 1 for port 6
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.7.1.1.7 u 1 >> /tmp/conflog.txt	#set pvid 1 for port 7
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.7.1.1.8 u 1 >> /tmp/conflog.txt	#set pvid 1 for port 8
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.7.1.1.9 u 10 >> /tmp/conflog.txt	#set pvid 10 for port 9
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.7.1.1.10 u 1 >> /tmp/conflog.txt	#set pvid 1 for port 10


echo "turning off flow control..."
for i in `seq 1 10`
do
	snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.81.2.2.1.5.$i i 2 >> /tmp/conflog.txt	#flow control off
done

echo "configuring QoS...
	port 1: priority 0 -> 4
	port 2: priority 0 -> 4
	port 3: priority 0 -> 4
	port 4: priority 0 -> 4
	port 5: priority 0 -> 4
	port 6: priority 0 -> 4
	port 7: priority 0 -> 0
	port 8: priority 0 -> 0
	port 9: priority 0 -> 0
	port 10: priority 0 -> 2"
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.6.1.2.1.1.1.1 i 4 >> /tmp/conflog.txt	#set port 1: priority 0 -> 4
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.6.1.2.1.1.1.2 i 4 >> /tmp/conflog.txt	#set port 2: priority 0 -> 4
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.6.1.2.1.1.1.3 i 4 >> /tmp/conflog.txt	#set port 3: priority 0 -> 4
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.6.1.2.1.1.1.4 i 4 >> /tmp/conflog.txt	#set port 4: priority 0 -> 4
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.6.1.2.1.1.1.5 i 4 >> /tmp/conflog.txt	#set port 5: priority 0 -> 4
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.6.1.2.1.1.1.6 i 4 >> /tmp/conflog.txt	#set port 6: priority 0 -> 4
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.6.1.2.1.1.1.10 i 2 >> /tmp/conflog.txt	#set port 10: priority 0 -> 2

echo "saving configuration..."
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.81.1.10.0 i 4 >> /tmp/conflog.txt			#save config
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.81.1.13.0 i 1 >> /tmp/conflog.txt			#initiate export
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.81.1.15.0 i 2 >> /tmp/conflog.txt			#load config on startup
echo "Configuring complete successful!"
