# IOTA-Airgapped-NodeJS-Console-Wallet  
### Sign transaction bundles securely offline using an [airgapped computer](https://github.com/johnshearing/PrivateKeyVault/blob/master/README.md) then broadcast your bundles to the Tangle using an online computer.  

A video of this process is coming soon. In the meantime this document contains all the instructions.  
I have not finished writing this document yet.  

## The video script starts here.  
The ultimate goal is to make two wallet applications that run in your browser.  
An offline wallet application that signs transaction bundles on a computer which never connects to the Internet nor to any other device and online wallet application that runs on an Internet connected computer that broadcasts the bundles to the Tangle. This tutorial starts the project by showing you how to control the underlying code at the command line. This way, when you build your wallet along with me you will understand whats happening and you will know that your wallet is doing what you expect it to do.  

Two computers are required if you want airgapped security to keep your seeds safe. One computer is airgapped. It never connects to the Internet nor to other devices. This airgapped computer should not have any WiFi or BlueTooth capability. So a raspberry pi 2 would be appropriate but a raspberry pi 3 would not. The other computer is connected to the Internet. That said about security, any computer that can run NodeJS (Linux,Mac,Windows) will work.  

I use the opensource www.PrivateKeyVault.com for my airgapped computer because it is built specifically to move signed bundles across the airgap without exposing your seeds to any other devices. QR-Codes are used to make the transfer. [This short clip](https://youtu.be/3MwJOj3t8cI) gives you an idea of how bundles are passed from one PrivateKeyVault to another. In this video you can see that qr-codes are being passed from a Vault to a phone but you can just as easily pass information directly from one Vault to another using this method.  

The second PrivateKeyVault which receives encrypted signed bundles is connected to the Internet for broadcasting those bundles to the Tangle. The two devices are never connected electrically nor by radio. Memory sticks are never used to pass information between the Vaults. Rather, the bundle is passed as a series of qr-codes as show in the video clip linked above.  

If you want to see a full length video about how the open source PrivateKeyVault is used for GPG encrypted messaging then check out [this video](https://youtu.be/qUWWuHium30). If you want to see how offline transactions are made on the Ethereum blockchain using the PrivateKeyVault then [check out this video](https://youtu.be/_vA4tTLdL2M). Otherwise, continue reading to see how to manage your IOTA using NodeJS at the BASH command line.  

If you want to experiment with small amounts of IOTA then only one computer which is connected to the Internet is required. Just remember that it is super easy for criminals to see what is on your Internet connected devices **so expect to have your IOTA stolen if you create your seeds on an Internet connected computer**. That said, any computer that can run NodeJS will work if you just want to experiment with small amounts.  


### Create Your Seeds for this experiment  
* IOTA seeds are strings of exactly 81 UPPER CASE letters.  
* The number **9** is also allowed.  
* The seed must be created by a completely random method.  
* A good random method for making an IOTA seed is as follows:  
  * Pick a letter out of a Scrabble bag.  
  * Write down the letter.   
  * Put the letter back in the bag.  
  * Repeat this process 80 more times until you have 81 characters written down.  
* If your seed is not random then your IOTA will be stolen.  
  * A string consisting of words is not random.  
  * A string which has a pattern is not random.  
  * A string generated or which can be determined by any mathematical formula is not random.  
* Do not generate your seeds by the following methods.  
  * Do not use online seed generators or your IOTAs will be stolen.  
  * Do not use pseudo-random number generators or your IOTAs will be stolen.  
  * Do not generate random numbers on any machine that connects to the Internet or connects to other devices.   
  
The following is my method for generating an IOTA seed  
Run the following line on an airgapped raspberry pi at the BASH console (not the NodeJS console) to get a random seed for IOTA.  
`sudo cat /dev/hwrng |LC_ALL=C tr -dc 'A-Z9' | fold -w 81 | head -n 1`  
This will produce an 81 character long string consisting of only UPPER CASE letters and the number **9**  
Then change some output characters at random in case the generator has been compromised by criminals.  
When changing characters, only use UPPER CASE letters and the number **9**, and do not change the amount of characters.  
There must be exactly 81 characters which can be UPPER CASE letters and the number **9** is also allowed.  
The above method does not use a sudo random generator.  
The code fragment `/dev/hwrng` is specifying that a special piece of hardware on the raspberry pi which reads truly random electrical events is used to generate the seed.  

The following commands executed at the bash console (not the NodeJS console) counts characters in the string surrounded by quotes.  
```  
myvar="THISISMYSTRING9"  
echo ${#myvar}  
```   
In the example above the output will read **15** because there are 15 characters in "THISISMYSTRING9"
Use the above commands to check that there are still 81 characters in your seed after you have substituted characters.  

The following are facts about IOTA that you will need to know:  
* Seeds are secret.  
* They stay in the PrivateKeyVault (or other secure device) behind the airgap so that no one can see them.  
* Seeds are used to sign transaction bundles.  
* Transaction bundles are encrypted commands for spending your IOTA.  
* Transaction bundles are encrypted commands which tell the computers running the Tangle to move your IOTA from your spending address (your account) to another person's address (their account).  
* Seeds are also used to make private keys and private keys are used to make spending addresses.  
* Seeds can make and control an unlimited number of private keys.  
* Private keys can make and control only one address.  
* Ultimately a seed, through the private keys it makes, can make and control an unlimited amount of addresses.  
* It is not possible for any man or machine to move money out of an address without having the seed which was used to create it.  
* Only the person in possession the seed which was ultimately used to make an address is able to spend from that address.  
* If the computers running the Tangle can decrypt your signed bundle, and if the decrypted message resolves to the spending address which is specified in your bundle, then this is mathematical proof that you are in possesion of the seed which was used to create the private key which was ultimately used to create that spending address. This is how the Tangle computers are activated by you to follow your spending instructions as specified in the bundle.  
* **WOW! DID YOU GET THE SIGNIFICANTS THAT LAST STATEMENT?**.  
* The Tangle computers know that you have the seed which controls the specified spending address without having to see the seed itself.  
* The seed is still in your sole possession.   
* You don't have that control with your ATM card. When you do banking, you need to enter a pin number or a password which is now known to the machine you are doing business with. So if criminals or government take control of that machine they can clear out your account because they have your password. This is not possible with IOTA because the computers which run the Tangle can only move IOTA when a signed bundle is decrypted and resolves to the specifed spending address and the only way to make such a bundle is by having the seed. **And only you have the seed**. So now, the only way people or government can get your money is if you give it to them. You can still be jailed or tortured until you reveal the seed but through the use of multi-signature wallets (to be covered in another tutorial) these forceful methods will not work either.  
* **Holy Cow! What just happened?**  
* **For the first time in human history each individual is in full control of his or her own money**  

### About Addresses and Defending Your IOTA From Quantum Computers
Soon we are going to start doing things at the command line but first you will need to know some facts about addresses in order to keep your IOTAs safe from criminals.  
* Addresses are public.  
* Addresses are like bank account numbers.  
* Give your addresses to people so that they can pay you.  
* Anyone can send IOTAs to an address but only someone with it's associated private key can spend from that address.  
* And as mentioned before, only the someone in possession of the seed which made the private key can possibly have the private key which made it's associated spending address.  
* **!!Very Important Information Is Comming**  
* There is one way criminals can get the private key for it's associated spending address.  
* Every time you spend from and address a small portion of the private key is revealed.  
* Nothing is revealed about the seed which made the private key is revealed when spending, only a piece of the private key is revealed.  
* So when you spend from an address you always move any remaining IOTAs to a new address which is under your control.  
* 
* This might seem inconvenient but the people who made IOTA had a very good reason for doing this.  
* In order to make your addresses invulnerable to quantum computers the Winternitz One-Time Signature is used to create addresses.  
* While you now have protect






If you are using a PrivateKeyVault or really any Linux device, the following line sends a qr-code representation of **hello world** to the screen at the BASH console. You can put whatever message you want between the quotes to get a qr-code representation of that message.  
`qrencode -t ANSIUTF8 "hello world"`  
This is good for passing addresses (not seeds) out of the vault without the need to connect to other devices.    



cd /home/pi/iota/iota-workshop/code
cd /home/pi/iota/iota-workshop/molw
cd /home/pi/iota/iota-workshop
cd /home/pi/iota/iota.js/node-wallet

Lookup healthy nodes at https://iota.dance/	

