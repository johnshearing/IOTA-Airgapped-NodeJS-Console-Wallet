# IOTA-Airgapped-NodeJS-Console-Wallet  
### Create and sign transaction bundles securely offline using an [airgapped computer](https://github.com/johnshearing/PrivateKeyVault/blob/master/README.md) then broadcast your signed transaction bundles to the Tangle using an online computer.  

A video of this process is coming soon. In the meantime this document will contain all the instructions you need to use this repository.    
I have not finished writing this document yet.  

## The video script starts here.  
The ultimate goal is to make two wallet applications that run in your browser.  
An offline wallet application that creates and signs transaction bundles on a computer which never connects to the Internet nor to any other device and online wallet application that runs on an Internet connected computer that broadcasts the bundles to the Tangle. This tutorial starts the project by showing you how to control the underlying code and move IOTAs at the command line. This way, when you build your wallet along with me you will understand what's happening and you will know that your wallet is doing what you expect it to do. After the wallets are working we will be adding database functionality so that the two wallets can stay in sync without the need to connect your offline device with the online device. After that we build multi-signature capability into the wallets and finally we will be exploring how smart contracts can be used with the IOTA family of products.  

Two computers are required if you want airgapped security to keep your seeds safe. One computer is airgapped. It never connects to the Internet nor to other devices. This airgapped computer should not have any WiFi or BlueTooth capability. So a raspberry pi 2 would be appropriate but a raspberry pi 3 would not. The other computer is connected to the Internet. That said about security, any computer that can run NodeJS (Linux,Mac,Windows) will work.  

I use the opensource www.PrivateKeyVault.com for my airgapped computer because it is built specifically to move signed transaction bundles across the airgap without exposing your seeds to any other devices. QR-Codes are used to make the transfer. [This short clip](https://youtu.be/3MwJOj3t8cI) gives you an idea of how signed transaction bundles are passed from one PrivateKeyVault to another. In this video you can see that qr-codes are being passed from a Vault to a phone but you can just as easily pass information directly from one Vault to another using this method.  

The second PrivateKeyVault which receives signed transaction bundles is connected to the Internet for broadcasting those bundles to the Tangle. The two devices are never connected electrically nor by radio. Memory sticks are never used to pass information between the Vaults. Rather, the bundle is passed as a series of qr-codes as show in the video clip linked above.  

If you want to see a full length video about how the open source PrivateKeyVault is used for GPG encrypted messaging then check out [this video](https://youtu.be/qUWWuHium30). It will give you a very good overall understanding of how the Vault works. If you want to see how offline transactions are made on the Ethereum blockchain using the PrivateKeyVault then [check out this video](https://youtu.be/_vA4tTLdL2M). It will give you a very good idea of what we are about to accomplish with IOTA. Otherwise, continue reading to see how to manage your IOTA using NodeJS at the BASH command line.  

If you want to experiment with small amounts of IOTA then only one computer which is connected to the Internet is required. Any computer will do. Just remember that it is super easy for criminals to see what is on your Internet connected devices **so expect to have your IOTA stolen if you create your seeds on an Internet connected computer**. That said, any computer that can run NodeJS will work if you just want to experiment with small amounts.  


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

* Generate two seeds for this tutorial.  
* **The seeds should be generated and stored on your airgapped machine so that no one will ever see them.**  
* You can use my method shown above or something else which is truly random like the scrabble method also shown above.  
* Paste your seeds into a text document on your airgapped machine for use later.  

### The following are facts about IOTA that you will need to know:  
* Seeds are secret.  
* They stay in the PrivateKeyVault (or other secure device) behind the airgap so that no one can see them.  
* Seeds are used to sign transaction bundles.  
* Signed transaction bundles are commands for spending your IOTA or for sending messages.  
* We will cover the use of signed transaction bundles for spending IOTA.  
* Signed transaction bundles are commands which tell the computers running the Tangle to move your IOTA from your spending address (your account) to another person's address (their account). Remaining (unspent) IOTAs are moved to a new spending address that you control for security reasons which will be explained as we proceed.  
* There are typically 4 transactions in a signed transaction bundle.  
  * A spending transaction that removes IOTAs from your spending address.  
    * The message field of this transaction will contain a signature.  
    * The signature is an encrypted message which must resolve to your spending address when decrypted.  
    * If the message shows your spending address when decrypted the Tangle computers are enabled to execute the transfer of IOTAs as specified in the signed transaction bundle. 
  * A second transaction is used to handle a larger signature if security level 2 is used.  
    * Everyone seems to use security level 2. More about security levels will be covered as we proceed.  
  * A third unsigned transaction is used to specify the recipent's address and the amount to send.  
  * A fourth unsigned transaction is used to specify your new spending address where unspent IOTAs will be sent.  
* Seeds do more than sign transaction bundles. 
* Seeds are also used to make private keys and private keys are used to make spending addresses.  
* Seeds can make and control an unlimited number of private keys.  
* Private keys can make and control only one spending address.  
* Ultimately a seed, through the private keys it makes, can make and control an unlimited amount of addresses.  
* It is not possible for any man or machine to move money out of an address without having the seed which was used to create it.  
* Only the person in possession of the seed which was ultimately used to make an address is able to spend from that address.  
* If the computers running the Tangle can decrypt your signed transaction bundle, and if the decrypted message resolves to the spending address which is specified in your signed transaction bundle, then this is mathematical proof that you are in possesion of the seed which was used to create the private key which was ultimately used to create that spending address. This is how the Tangle computers are activated by you to follow your spending instructions as specified in your signed transaction bundle.  
* **WOW! DID YOU GET THE SIGNIFICANTS THAT LAST STATEMENT?**.  
* The Tangle computers know that you have the seed which controls the specified spending address without having to see the seed itself.  
* The seed is still in your sole possession.   
* You don't have that control with your ATM card. When you do banking, you need to enter a pin number or a password which is known to the machine you are doing business with. So if criminals or government take control of that machine they can clear out your account because they already have your password. This is not possible with IOTA because the computers which run the Tangle can only move IOTA when a signed transaction bundle is decrypted and resolves to the specifed spending address. And the only way to make such a bundle is by having the seed. **And only you have the seed for your accounts**. So now, the only way criminals, or government can get your money is if you give it to them. You can still be jailed or tortured until you reveal the seed but through the use of smart contracts and multi-signature wallets (to be covered in other tutorials) these forceful methods will cost more to implement then they will produce so they will not be used. Of course we still need to pay our taxes, but government now requires our cooperation in order to collect taxes which if exercised collectively gives citizens a level of control over their governments never before seen in human history.    
* **Holy Cow! What just happened?**  
* **For the first time in human history citizens can take full control of their own money.**  
* **When they do, money will not be controlled by banks and it will not be tied to any government.**     
* **When IOTA achives mass-adoption banks will no longer be able to [devalue our currency by issuing new money](https://www.investopedia.com/terms/f/fractionalreservebanking.asp).**  
* **And governments will not be able to just [print money to finance wars](https://en.wikipedia.org/wiki/War_finance#Inflation) that it's people do not want.**  
* **So with money no longer tied to a country, governments will have to compete for citizens (really their money) by providing the best places to live at the least cost. The new freedom to leave and take your money with you, will be a stablizing force causing opressive governments to change while keeping honest well run governments on the right track.** 
* **Citizens are about to get a seat at the bargining table and the nonsense is about to end.**  
* **We can bring on this change by helping to make IOTA a better service than banks, more secure, and more convenient to use.**  
* **That's what we will need to do in order to start the mass migration to IOTA**  
* **Let's get to work**  

### A Word On Privacy  
* The IOTA Tangle is a public ledger.  
* Every Transaction on the IOTA Tangle is public information.  
* [Every Transaction can viewed here.](https://thetangle.org/)  
* That means that everyone can see how many IOTAs everybody else has in their addresses and everyone can see to what addresses IOTAs move when they are spent. 
* That means that you can not use the IOTA Tangle to hide your money from the government nor anybody else and you can not hide the purchases you make either. I mention this because it is a common misconception that IOTA can be used for money laundering and other illegal activities. This is not possible with IOTA because you can see where every IOTA is and how every IOTA got there.
* This is not the case with cash and it is not the case with banks.  
* If you use cash, no one can see how much you have, where it came from, or where you spend it.    
* The same is true of bank accounts especially the secret offshore accounts used by criminals and tax evaders.  
* Cash it the currency of choice for the common criminal.  
* Banks are used by sophisticated criminals and bankers themselves [to commit colossal crimes](https://theweek.com/articles/729052/brief-history-crime-corruption-malfeasance-american-banks).  
* The original cryptocurrency (BitCoin) was invented [to end the misery banks cause humanity](https://bitcoinmagazine.com/articles/ten-years-later-reflection-bitcoins-genesis-and-satoshis-timing/)  
* So why, you may be wondering, do they call it cryptocurrency if it's not secret. 
* It's because cryptography is used to protect the seeds you use to control your accounts.  
* In any case, the purpose of IOTA is to give citizens full control of their money not to hide it.  

### About Addresses, Safe Spending, and IOTA's Defense Against Quantum Computers
Soon we are going to start doing things at the command line but first you will need to know some facts about addresses in order to keep your IOTAs safe from criminals.  
* Addresses are public.  
* Addresses are like bank account numbers.  
* Give your addresses to people so that they can pay you.  
* Anyone can send IOTAs to an address but only someone with an address's associated private key can spend from that address.  
* And as mentioned before, only the someone in possession of the seed which made the private key can possibly have the private key which made it's associated spending address.  
* **!!Very Important Information Is Coming!!**  
* There is a way criminals can get the private key for it's associated spending address.  
* Every time you spend from an address a half of the private key is revealed.  
* This is not a flaw in the system. There is a very good reason for this which I will explain in a minute.  
* Nothing is revealed about the seed which made the private key when spending, only a portion of the private key is revealed.  
* **So when you spend from an address you must move any unspent IOTAs to a new address.**  
* That's why we include a transaction in the signed transaction bundle to move unspent IOTAs to a new address.  
* Usually, you move the remaining balance to another address which is ultimately controlled by the same seed as the spending address.  
* This way you only have to keep track of one seed.  
* But you could move the remaining balance to an address which is ultimately controlled by a different seed if you wish.  
* All this might seem inconvenient but the people who made IOTA had a very good reason for building the system this way.  
* In order to make your addresses invulnerable to quantum computers the Winternitz One-Time Signature is used to create addresses.  
* So when quantum computers become more capable and can calculate the private key for any given address on other distributed ledgers, your IOTA's will be safe.  
* The cost for this protection is the inconvenience of having to inclued a transaction in your signed bundle which moves your remaining (unspent) balance to a new address.  

### Lets Make a Signed Transaction Bundle  

#### Install NodeJS on your airgapped machine and your online machine as well.  
* You are probably wondering, how am I supposed to install software on an airgapped machine that does not connect to the Internet?  
* Well your airgapped machine is not airgapped until you say it's airgapped so for right now it's ok to connect to the Internet.  
* When all the software is installed and you are ready to sign transactions, then you simply pull the plug on the Internet and never connnect to it again.  
* Then you will create new seeds and new addresses from behind the airgap and use these instead of the experimental ones you are playing with now.  
* If you are using a PrivateKeyVault or a raspberry pi 2 then NodeJS installation instructions are [here](https://github.com/johnshearing/PrivateKeyVault#install-nodejs-and-npm).  
* Othewise download NodeJS for your system [here](https://nodejs.org/en/download/).  

#### Reference Materials  
* The following are reference materials for HTML, CSS, JavaScript, NodeJS, MongoDB, and REST-API.  
* You will not need them to follow this tutorial but it will help when you want to start following your own ideas.  
* You interact with NodeJS using JavaScript.  
  * [Pickup some understanding of HTML, CSS, and JavaScript here](https://www.w3schools.com/).    
  * [This is a beginers JavaScript Tutorial by NetNinja](https://www.youtube.com/watch?v=qoSksQ4s_hg&list=PL4cUxeGkcC9i9Ae2D9Ee1RvylH38dKuET&index=1)  
  * [Here NetNinja covers new features of Javascript](https://www.youtube.com/watch?v=0Mp2kwE8xY0&list=PL4cUxeGkcC9gKfw25slm4CUDUcM_sXdml)  
  * [Here NetNinja covers object oriented JavaScript](https://www.youtube.com/watch?v=4l3bTDlT6ZI&list=PL4cUxeGkcC9i5yvDkJgt60vNVWffpblB7)  
  * [I liked this JavaScript tutorial by Tony Alicea](https://youtu.be/Bv_5Zv5c-Ts) 
    * The first 3 hours are free. The rest is worth the money.  
* The following are two great video playlists which show you how to install and use NodeJS:  
  * [Node JS Tutorial for Beginners by NetNinja](https://www.youtube.com/watch?v=w-7RQ46RgxU&list=PL4cUxeGkcC9gcy9lrvMJ75z9maRw4byYp)  
  * [Node.js & Express From Scratch by Traversy Media](https://www.youtube.com/watch?v=k_0ZzvHbNBQ&list=PLillGF-RfqbYRpji8t4SxUkMxfowG4Kqp)  
* More advanced NodeJS topics are covered here.  
  * [MongoDB is covered by NetNinja here](https://www.youtube.com/watch?v=9OPP_1eAENg&list=PL4cUxeGkcC9jpvoYriLI0bY8DOgWZfi6u)  
  * [NetNinja covers NodeJS with REST API here](https://www.youtube.com/watch?v=BRdcRFvuqsE&list=PL4cUxeGkcC9jBcybHMTIia56aV21o2cZ8)  

   
#### Install iota.js  
* [Check out the documentation - found here](https://github.com/iotaledger/iota.js/blob/next/api_reference.md)  
* [The iota.js library and install instructions are found here](https://github.com/iotaledger/iota.js).  
* To install:  
  * Make a new directory on each machine. Call it **iotajs**.  
  * At the bash console, cd into the directory.  
  * Execute the following command and the bash console to create a package.json file.  
  * The package.json file is used to manage your project.  
  * `npm init`  Accept all the defaults.  
  * Next install the iota.js library by executing the following command at the bash console.  
  * `npm install @iota/core` 

#### Install the IOTA-Airgapped-NodeJS-Console-Wallet repository  
* At the BASH command line, cd into the **iotajs** directory you just made.  
* Then execute the following command at the BASH console.   
* git clone https://github.com/johnshearing/IOTA-Airgapped-NodeJS-Console-Wallet.git`  
* Now the Console Wallet is installed in a new directory called **IOTA-Airgapped-NodeJS-Console-Wallet**  
* Change the name of the directory to something shorter. Call it **Console-Wallet**  
* At the BASH console, CD into the **Console-Wallet** directory and look at the scripts with your favorite text editor.  
* You will be using these scripts at the BASH console to securely store and spend your IOTAs.  

#### Move Your Seeds Into the Console Wallet directory.  
* If you have been following along then you already have two experimental seeds in a text file waiting to be used on your airgapped machine.  
* Move the text file containing your experimental seeds into the **Console-Wallet** directory.  
* Your seeds are very important. 
* If you lose your seeds then you will lose all the IOTAs they control.  
* Copy your experimental seeds by writing them down on a piece of paper and check 3 times that you have written them down correctly.  
* Then put these pieces of paper somewhere safe.  
* If you are using a PrivateKeyVault then there is different method for backing up your seeds [which is found here.](https://github.com/johnshearing/PrivateKeyVault#cloning-your-encrypted-sd-card-using-only-the-raspberry-pi)  

#### Make Addresses From Your Seeds To Store IOTAs  
* Open your favorite text editor and use it to open the document that contains your two seeds.  
* Be sure no one can see this document. 
* If anyone manages to record your seeds then they have all the IOTA controlled by those seeds.  
* If your text editor has a read only mode it would be best to open the document in read only mode.  
* It would be a tragedy if you accidently changed your seeds after you have created the addresses because you would lose control over those addresses. If you don't have read only mode in your text editor don't worry to much - you backed up your seeds. You did back up your seeds - right?  
* Now open a second instance of your favorite text editor and open following document in the **30-create-address.js** script in the **Console-Wallet** repository.  
* The script should look much like the script seen below.  
```
///////////////////////////////
// Create an address from a new seed
///////////////////////////////

const iotaLibrary = require('@iota/core')

const iota = iotaLibrary.composeAPI({})

const seed =
  'Paste-Your-Seed-Between-These-Quotes'

iota
  .getNewAddress(seed, { index: 0, total: 5, checksum: true })
  .then(address => {
    console.log('Your address is: ' + address)
  })
  .catch(err => {
    console.log(err)
  })
```


* Your BASH Console should be open and you should be in the **Console-Wallet** directory.  




* A short tutorial of how to buy IOTAs on [binance](https://www.binance.com/en) will go here.  

* A short tutorial of how to send IOTAs from binance to your new address will go here.  

#### Find a Healthy Computer on the Tangle To Use For Checking the Balance of Your New Address  
* There are computers all over the planet which maintain a record of all the addresses and their balances on the IOTA Tangle.  
* They all talk to each other to ensuring that they all have the same information and that the information is correct.  
* Anyone can setup one or more of these computers but that is outside the scope of this tutorial.  
* We just need to find a healthy one to use for checking the balance of your new address.  
* Open the browser of your of your online computer.  
* Paste the following URL into the browser's address field.  
* `https://iota.dance/`  
* You will see a webpage listing the healthiest nodes near the top.  
* Pick an node that:  
  * Has a health index of **10**  
  * Has lots of neighbors  
  * Is using the latest version  
  * Is on the most recent milestone  
  * Is not heavily loaded  
  * Allows proof of work  
  * And uses the Secure Socket Layer Protocol (https)  
* Just click on the one you want and the URL will be copied to the clipboard. 



* A short tutorial of how to see if you can connect to a node will go here.  
* A short tutorial of how to check your balance will go here.  
* A short tutorial of how to make a transaction bundle will go here.  
* A short tutorial of how to sign a transaction bundle will go here.  
* A discussion of why your should keep a copy of all the scripts you execute will go here.  
* A short tutorial of how to encrypt a signed transaction bundle will go here.  
* A short tutorial of how to pass the signed transaction bundle from the offline machine to the online machine will go here.  
* A short tutorial of how to decrypt the bundle will go here.  
* A short tutorial of how to broadcast the bundle will go here.  
* A short tutorial of how to check your balances again will go here.  
* A short tutorial of how to keep your records updated and an archive of all your scripts will go here.  




Pay no attention to the stuff below. It's for things I have yet to address in the tutorial.  

If you are using a PrivateKeyVault or really any Linux device, the following line sends a qr-code representation of **hello world** to the screen at the BASH console. You can put whatever message you want between the quotes to get a qr-code representation of that message.  
`qrencode -t ANSIUTF8 "hello world"`  
This is good for passing addresses (not seeds) out of the vault without the need to connect to other devices.    


Lookup healthy nodes at https://iota.dance/	

