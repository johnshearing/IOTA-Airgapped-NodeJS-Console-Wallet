# IOTA-Airgapped-NodeJS-Console-Wallet  
Sign bundles securely offline using an airgapped raspberry pi 2 and broadcast the bundles using a pi online  

Run the following line on a raspberry pi at the bash console (not the NodeJS console) to get a random seed for IOTA.  
`sudo cat /dev/hwrng |LC_ALL=C tr -dc 'A-Z9' | fold -w 81 | head -n 1`  
This will produce an 81 character long string consisting of only UPPER CASE letters and the number **9**  
Then change some output characters at random in case the generator has been compromised.  
When changing characters, only use UPPER CASE letters and the number **9**, and do not change the amount of characters.  
There must be exactly 81 characters which can be UPPER CASE letters and the number **9** is also allowed.  

Seeds are secret.  
They stay in the PrivateKeyVault behind the airgap so that no one can see them.  
Seeds are used to sign transaction bundles.  

Seeds are used to make addresses.  
Addresses are public.  
Addresses are like bank account numbers.


The following commands executed at the bash console (not the NodeJS console) counts characters in the string surounded by quotes.  
```  
myvar="THISISMYSTRING9"  
echo ${#myvar}  
```   
In the example above the output will read **15** because there are 15 characters in "THISISMYSTRING9"
Use the above commands to check that there are still 81 characters in your seed after you have substituted characters.  

If you are using a PrivateKeyVault or really any raspberry pi, the following line sends a qr-code representation of **hello world** to the screen at the BASH console. You can put whatever message you want between the quotes to get a qr-code representation of that message.  
`qrencode -t ANSIUTF8 "hello world"`  
This is good for passing addresses (not seeds) out of the vault.  



cd /home/pi/iota/iota-workshop/code
cd /home/pi/iota/iota-workshop/molw
cd /home/pi/iota/iota-workshop
cd /home/pi/iota/iota.js/node-wallet

Lookup healthy nodes at https://iota.dance/	

