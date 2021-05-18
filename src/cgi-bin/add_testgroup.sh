#!/bin/sh
echo "Content-type: text/plain\n\n"
echo

read param

title=$(dirname "$param")
fname=$(basename "$param")

text="<test><title>$title<\/title><fname>tests\/$fname<\/fname><\/test>"
sudo sh -c "sed -i 's/<\/test_list>/$text<\/test_list>/' ../test_list.xml"

echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?><testlist><head><title>$title</title></head></testlist>" | sudo tee ../tests/$fname > /dev/null
sudo chmod 777 "/mnt/cf/base/web/tests/$fname"
echo "OK"
