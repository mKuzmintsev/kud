#!/bin/sh
#G1
echo "Content-type: text/plain\n\n";
echo 
read ip

touch /tmp/conflog.txt
chmod 777 /tmp/conflog.txt
sudo ifconfig eth0:hd1 down
sudo ifconfig eth0:hd2 down
sudo ifconfig eth1:hd1 192.168.0.254 netmask 255.255.255.0
sudo ifconfig eth1:hd2 192.168.1.254 netmask 255.255.0.0

echo "sets IP-address $ip with mask 255.255.0.0...."
old=192.168.0.5
if ! ping -c3 $old > /dev/null
then
	old=192.168.0.126
fi
snmpset -v 1 -c private $old 1.3.6.1.4.1.21108.27.1.5.1.3.19 a 255.255.0.0 > /tmp/conflog.txt	#set subnet mask
sleep 5
snmpset -v 1 -c private $old 1.3.6.1.4.1.21108.27.1.5.1.2.19 a $ip >> /tmp/conflog.txt	#set new IP-address

sudo ifconfig eth1:hd1 down
sudo ifconfig eth1:hd2 down
sudo ifconfig eth0:hd1 192.168.0.254 netmask 255.255.255.0
sudo ifconfig eth0:hd2 192.168.1.254 netmask 255.255.0.0

echo "creating VLANs...
	id=1, name=global, member ports=[1,2,3,4,5,7,8,9,10], untagged ports=[1,2,3,4,5,7,8,9,10]
	id=10, name=gwm, member ports=[1,2,6,7,9,10], untagged ports=[6,7]
	id=11, name=gws, member ports=[1,2,6,9,10], untagged ports=[0]
	id=12, name=gwp, member ports=[1,2,6,7,9,10], untagged ports=[0]
	id=13, name=server, member ports=[1,2,9,10], untagged ports=[0]"
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.4.1.1.0.1 s "global" >> /tmp/conflog.txt	#set vlan1 name
snmpset -v 1 -c private $ip 1.3.6.1.2.1.17.7.1.4.3.1.4.1 x FBC00000 >> /tmp/conflog.txt		#set vlan1 untagged ports 1,2,3,4,5,7,8,9,10
snmpset -v 1 -c private $ip 1.3.6.1.2.1.17.7.1.4.3.1.2.1 x FBC00000 >> /tmp/conflog.txt		#set vlan1 members ports 1,2,3,4,5,7,8,9,10
if ! ping -c3 $ip > /dev/null
then 
	echo "Wrong connection! Configuring fail!"
	exit 0
fi

snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.4.1.2.0.10 i 5 >> /tmp/conflog.txt		#create vlan10
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.4.1.2.0.10 i 1 >> /tmp/conflog.txt		#activate vlan10
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.4.1.1.0.10 s "gwm" >> /tmp/conflog.txt	#set vlan10 name
snmpset -v 1 -c private $ip 1.3.6.1.2.1.17.7.1.4.3.1.2.10 x C6C00000 >> /tmp/conflog.txt		#set vlan10 members ports 1,2,6,7,9,10
snmpset -v 1 -c private $ip 1.3.6.1.2.1.17.7.1.4.3.1.4.10 x 06000000 >> /tmp/conflog.txt		#set vlan10 untagged ports 6,7

snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.4.1.2.0.11 i 5 >> /tmp/conflog.txt		#create vlan11
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.4.1.2.0.11 i 1 >> /tmp/conflog.txt		#activate vlan11
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.4.1.1.0.11 s "gws" >> /tmp/conflog.txt	#set vlan11 name
snmpset -v 1 -c private $ip 1.3.6.1.2.1.17.7.1.4.3.1.2.11 x C4C00000 >> /tmp/conflog.txt		#set vlan11 members ports 1,2,6,9,10
snmpset -v 1 -c private $ip 1.3.6.1.2.1.17.7.1.4.3.1.4.11 x 00000000 >> /tmp/conflog.txt		#set vlan11 untagged ports 0

snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.4.1.2.0.12 i 5 >> /tmp/conflog.txt		#create vlan12
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.4.1.2.0.12 i 1 >> /tmp/conflog.txt		#activate vlan12
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.4.1.1.0.12 s "gwp" >> /tmp/conflog.txt	#set vlan12 name
snmpset -v 1 -c private $ip 1.3.6.1.2.1.17.7.1.4.3.1.2.12 x C6C00000 >> /tmp/conflog.txt		#set vlan12 members ports 1,2,6,7,9,10
snmpset -v 1 -c private $ip 1.3.6.1.2.1.17.7.1.4.3.1.4.12 x 00000000 >> /tmp/conflog.txt		#set vlan12 untagged ports 0

snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.4.1.2.0.13 i 5 >> /tmp/conflog.txt		#create vlan13
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.4.1.2.0.13 i 1 >> /tmp/conflog.txt		#activate vlan13
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.4.1.1.0.13 s "s" >> /tmp/conflog.txt	#set vlan13 name
snmpset -v 1 -c private $ip 1.3.6.1.2.1.17.7.1.4.3.1.2.13 x C0C00000 >> /tmp/conflog.txt		#set vlan13 members ports 1,2,9,10
snmpset -v 1 -c private $ip 1.3.6.1.2.1.17.7.1.4.3.1.4.13 x 00000000 >> /tmp/conflog.txt		#set vlan13 untagged ports 0

echo "sets PVID for ports...
	port ~ PVID
	1 ~ 1
	2 ~ 1
	3 ~ 1
	4 ~ 1
	5 ~ 1
	6 ~ 10
	7 ~ 1
	8 ~ 1
	9 ~ 1
	10 ~ 1"
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.7.1.1.1 u 1 >> /tmp/conflog.txt		#set pvid 1 for port 1
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.7.1.1.2 u 1 >> /tmp/conflog.txt		#set pvid 1 for port 2
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.7.1.1.3 u 1 >> /tmp/conflog.txt		#set pvid 1 for port 3
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.7.1.1.4 u 1 >> /tmp/conflog.txt		#set pvid 1 for port 4
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.7.1.1.5 u 1 >> /tmp/conflog.txt		#set pvid 1 for port 5
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.7.1.1.6 u 10 >> /tmp/conflog.txt	#set pvid 10 for port 6
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.7.1.1.7 u 1 >> /tmp/conflog.txt		#set pvid 1 for port 7
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.7.1.1.8 u 1 >> /tmp/conflog.txt		#set pvid 1 for port 8
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.7.1.1.9 u 1 >> /tmp/conflog.txt		#set pvid 1 for port 9
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.7.1.1.10 u 1 >> /tmp/conflog.txt	#set pvid 1 for port 10

echo "sets max edges for RSTP..."
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.119.1.3.1.3.0 i 1 >> /tmp/conflog.txt	#activate
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.2.1.1.15.0 i 2100 >> /tmp/conflog.txt	#forward delay 21
snmpset -v 1 -c private $Ip 1.3.6.1.4.1.21108.116.2.1.1.13.0 i 4000 >> /tmp/conflog.txt	#max age 40

echo "sets up RSTP path cost parameters
	for ports 9,10 400k
	for ports 1,2 1600k"
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.2.2.1.11.9 i 400000 >> /tmp/conflog.txt
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.2.2.1.11.10 i 400000 >> /tmp/conflog.txt
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.2.2.1.11.1 i 1600000 >> /tmp/conflog.txt
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.2.2.1.11.2 i 1600000 >> /tmp/conflog.txt

echo "sets up the lowest RSTP priority for switch"
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.2.1.1.3.0 i 61440 >> /tmp/conflog.txt

echo "activating LLDP..."
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.158.1.2.0 i 1 >> /tmp/conflog.txt			#enable LLDP
snmpset -v 1 -c private $ip 1.0.8802.1.1.2.1.1.7.1.1.1.4.$ip x FFFFFFFF >> /tmp/conflog.txt		#activate "send IP-address" option
snmpset -v 1 -c private $ip 1.0.8802.1.1.2.1.1.1.0 i 5 >> /tmp/conflog.txt				#set transmit interval = 5
snmpset -v 1 -c private $ip 1.0.8802.1.1.2.1.1.2.0 i 2 >> /tmp/conflog.txt				#set TTL multiplier = 2, so TTL = 10 sec

echo "saving configuration..."
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.81.1.10.0 i 4 >> /tmp/conflog.txt		#save config
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.81.1.13.0 i 1 >> /tmp/conflog.txt		#initiate export
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.81.1.15.0 i 2 >> /tmp/conflog.txt		#load config on startup
echo "Configuring complete successful!"
