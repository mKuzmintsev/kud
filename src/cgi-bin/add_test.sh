#!/bin/bash
echo "Content-type: text/plain\n\n"
echo

read param
fname=$(basename "$param")
text=$(dirname "$param")
i=$(($(cat "/mnt/cf/base/web/tests/$fname" | grep -o "<number>" | wc -l) + 1))

text="${text//<number>00<\/number>/<number>$i</number>}"
text="${text//\//\\/}"
sudo sed -i -e "s|<\/testlist>|$text<\/testlist>|" ../tests/$fname
echo "OK"
