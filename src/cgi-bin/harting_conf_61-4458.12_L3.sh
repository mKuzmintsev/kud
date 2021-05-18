#!/bin/sh
#L3
echo "Content-type: text/plain\n\n";
echo 
read ip
echo "sets IP-address $ip with mask 255.255.0.0...."
old=192.168.0.5
if ! ping -c3 $old > /dev/null
then
	old=192.168.0.126
fi
snmpset -v 1 -c private $old 1.3.6.1.4.1.21108.27.1.5.1.3.19 a 255.255.0.0 > /tmp/conflog.txt	#set subnet mask
sleep 5
snmpset -v 1 -c private $old 1.3.6.1.4.1.21108.27.1.5.1.2.19 a $ip >> /tmp/conflog.txt	#set new $ip-address
if ! ping -c3 $ip > /dev/null
then 
	echo "Wrong connection! Configuring fail!"
	exit 0
fi
echo "activating LLDP..."
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.158.1.2.0 i 1 >> /tmp/conflog.txt			#enable LLDP
snmpset -v 1 -c private $ip 1.0.8802.1.1.2.1.1.7.1.1.1.4.$ip x FFFFFFFF >> /tmp/conflog.txt		#activate "send $ip-address" option
snmpset -v 1 -c private $ip 1.0.8802.1.1.2.1.1.1.0 i 5 >> /tmp/conflog.txt				#set transmit interval = 5
snmpset -v 1 -c private $ip 1.0.8802.1.1.2.1.1.2.0 i 2 >> /tmp/conflog.txt				#set TTL mult$iplier = 2, so TTL = 10 sec
echo "creating VLANs...
	id=1, name=local, member ports=[1,2,3,4,6,7,8,9,10], untagged ports=[1,2,3,4,6,7,8,9,10]
	id=3, name=io, member ports=[5,7,8], untagged ports=[5]"
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.4.1.1.0.1 s "local" >> /tmp/conflog.txt	#set vlan1 name
snmpset -v 1 -c private $ip 1.3.6.1.2.1.17.7.1.4.3.1.4.1 x F7C00000 >> /tmp/conflog.txt		#set vlan1 untagged ports 1,2,3,4,6,7,8,9,10
snmpset -v 1 -c private $ip 1.3.6.1.2.1.17.7.1.4.3.1.2.1 x F7C00000 >> /tmp/conflog.txt		#set vlan1 members ports 1,2,3,4,6,7,8,9,10
if ! ping -c3 $ip > /dev/null
then 
	echo "Wrong connection! Configuring fail!"
	exit 0
fi
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.4.1.2.0.3 i 5 >> /tmp/conflog.txt		#create vlan3
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.4.1.2.0.3 i 1 >> /tmp/conflog.txt		#activate vlan3
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.4.1.1.0.3 s "io" >> /tmp/conflog.txt		#set vlan3 name
snmpset -v 1 -c private $ip 1.3.6.1.2.1.17.7.1.4.3.1.2.3 x 0B000000 >> /tmp/conflog.txt		#set vlan3 members ports 5,7,8
snmpset -v 1 -c private $ip 1.3.6.1.2.1.17.7.1.4.3.1.4.3 x 08000000 >> /tmp/conflog.txt		#set vlan3 untagged ports 5
echo "sets PVID for ports...
	port ~ PVID
	1 ~ 1
	2 ~ 1
	3 ~ 1
	4 ~ 1
	5 ~ 3
	6 ~ 1
	7 ~ 1
	8 ~ 1
	9 ~ 1
	10 ~ 1"
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.7.1.1.1 u 1 >> /tmp/conflog.txt		#set pvid 1 for port 1
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.7.1.1.2 u 1 >> /tmp/conflog.txt		#set pvid 1 for port 2
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.7.1.1.3 u 1 >> /tmp/conflog.txt		#set pvid 1 for port 3
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.7.1.1.4 u 1 >> /tmp/conflog.txt		#set pvid 1 for port 4
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.7.1.1.5 u 3 >> /tmp/conflog.txt		#set pvid 3 for port 5
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.7.1.1.6 u 1 >> /tmp/conflog.txt		#set pvid 1 for port 6
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.7.1.1.7 u 1 >> /tmp/conflog.txt		#set pvid 1 for port 7
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.7.1.1.8 u 1 >> /tmp/conflog.txt		#set pvid 1 for port 8
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.7.1.1.9 u 1 >> /tmp/conflog.txt		#set pvid 1 for port 9
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.116.7.1.4.7.1.1.10 u 1 >> /tmp/conflog.txt		#set pvid 1 for port 10
echo "configuring QoS...
	port 5: priority 0 -> 7
	port 7: priority 0 -> 4
	port 8: priority 0 -> 4"
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.1006.2.1.1.3.5.0 i 7 >> /tmp/conflog.txt	#set port 5: priority 0 -> 7
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.1006.2.1.1.3.7.0 i 4 >> /tmp/conflog.txt	#set port 7: priority 0 -> 4
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.1006.2.1.1.3.8.0 i 4 >> /tmp/conflog.txt	#set port 8: priority 0 -> 4
echo "saving configuration..."
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.81.1.10.0 i 4 >> /tmp/conflog.txt			#save config
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.81.1.13.0 i 1 >> /tmp/conflog.txt			#initiate export
snmpset -v 1 -c private $ip 1.3.6.1.4.1.21108.81.1.15.0 i 2 >> /tmp/conflog.txt			#load config on startup
echo "Configuring complete successful!"
