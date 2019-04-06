Run the following line to get a random seed for IOTA.
sudo cat /dev/hwrng |LC_ALL=C tr -dc 'A-Z9' | fold -w 81 | head -n 1
Then change some output characters at random in case the generator has been compromised.

Sends a qr-code to the screen at the BASH console.
qrencode -t ANSIUTF8 "hello world"

Counts characters in a string at the BASH console.
myvar="some string"
echo ${#myvar}  

cd /home/pi/iota/iota-workshop/code
cd /home/pi/iota/iota-workshop/molw
cd /home/pi/iota/iota-workshop
cd /home/pi/iota/iota.js/node-wallet

Lookup healthy nodes at https://iota.dance/	
