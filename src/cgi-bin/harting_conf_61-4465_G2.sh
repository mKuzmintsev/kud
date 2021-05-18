#!/bin/sh
#G2
echo "Content-type: text/plain\n\n";
echo 
read ip

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
	#for ports 3,4 400k
	#for ports 1,7 1600k"
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.2.2.1.11.3 i 400000 >> /tmp/conflog.txt
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.2.2.1.11.4 i 400000 >> /tmp/conflog.txt
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.2.2.1.11.1 i 1600000 >> /tmp/conflog.txt
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.2.2.1.11.7 i 1600000 >> /tmp/conflog.txt

echo "sets up the lowest RSTP priority for switch"
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.2.1.1.3.0 i 61440 >> /tmp/conflog.txt

echo "activating LLDP..."
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.158.1.2.0 i 1 >> /tmp/conflog.txt			#enable LLDP
snmpset -v 1 -c private $ip 1.0.8802.1.1.2.1.1.7.1.1.1.4.$ip x FFFFFFFF >> /tmp/conflog.txt		#activate "send $ip-address" option
snmpset -v 1 -c private $ip 1.0.8802.1.1.2.1.1.1.0 i 5 >> /tmp/conflog.txt				#set transmit interval = 5
snmpset -v 1 -c private $ip 1.0.8802.1.1.2.1.1.2.0 i 2 >> /tmp/conflog.txt				#set TTL mult$iplier = 2, so TTL = 10 sec
echo "turning off flow control..."
for i in `seq 1 10`
do
	snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.81.2.2.1.5.$i i 2 >> /tmp/conflog.txt	#flow control off
done

echo "configuring QoS...
	port 8: priority 0 -> 7"
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.1006.2.1.1.3.8.0 i 7 >> /tmp/conflog.txt	#set port 8: priority 0 -> 7

echo "saving configuration..."
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.81.1.10.0 i 4 >> /tmp/conflog.txt			#save config
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.81.1.13.0 i 1 >> /tmp/conflog.txt			#initiate export
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.81.1.15.0 i 2 >> /tmp/conflog.txt			#load config on startup
echo "Configuring complete successful!"
