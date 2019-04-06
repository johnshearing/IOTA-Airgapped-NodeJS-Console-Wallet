# IOTA-Airgapped-NodeJS-Console-Wallet  
### Sign transaction bundles securely offline using an [airgapped computer](https://github.com/johnshearing/PrivateKeyVault/blob/master/README.md) then broadcast your bundles to the Tangle using an online computer.  

Two computers are required if you want airgapped security to keep your seeds safe.  

I use the opensource www.PrivateKeyVault.com for my airgapped computer because it is built specifically to move signed bundles across the airgap without exposing your seeds to any other devices.  

 I use a second PrivateKeyVault which is connected to the Internet for receiving the signed bundles and then for broadcasting those bundles to the Tangle.  
 
 [This short clip](https://youtu.be/3MwJOj3t8cI) gives you an idea of how bundles are passed from one PrivateKeyVault to another.  

If you want to experiment with small amounts of IOTA then only one computer which is connected to the Internet is required. Just remember that it is super easy for criminals to see what is on your Internet connected devices **so expect to have your IOTA stolen if you create your seeds on an Internet connected computer**. That said, any computer that can run NodeJS will work if you just want to experiment with small amounts.  


### Create Your Seeds for this experiment  
* IOTA seeds are strings of exactly 81 UPPER CASE letters.  
* The number **9** is also allowed.  
* The seed must be created by a completely random method.  
* A good random method for making an IOTA seed is as follows:  
  * Pick a letter out of a Scrabble bag.  
  * Write down the letter.   
  * Put the letter back in the bag.  
  * Repeat this process 80 more times untill you have 81 characters written down.  
* If your seed is not random then your IOTA will be stolen.  
  * A string consisting of words is not random.  
  * A string which has a pattern is not random.  
  * A string generated or which can be determined by any mathmatical formula is not random.  
* Do not generate your seeds by the following methods.  
  * Do not use online seed generators or your IOTAs will be stolen.  
  * Do not use pseudo-random number generators or your IOTAs will be stolen.  
  * Do not generate random numbers on any machine that connects to the Internet or connects to other devices.  
  * 
The following is my method for generating an IOTA seed
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

