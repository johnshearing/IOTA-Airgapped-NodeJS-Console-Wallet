# IOTA-Airgapped-NodeJS-Console-Wallet  
### Create and sign transaction bundles securely offline using an [airgapped computer](https://github.com/johnshearing/PrivateKeyVault/blob/master/README.md) then broadcast your signed transaction bundles to the Tangle using an online computer.  

## Use these instructions to move only small amounts of IOTA that you are prepared to loose.  
## I will not be held responsible for your losses.  
## This tutorial is for instructional purposes only.  
## This tutorial is for developers only - not for the general public.  
## [The general public should go here](https://www.iota.org/get-started/buy-and-secure-iota)  
### The intention of this tutorial is to help developers become familar with the NodeJS API for moving IOTAs between accounts.  
### You will be creating NodeJS scripts and running them from the BASH console.  
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
* A warning about brain wallets. **Do not use them**  
  * To make a brain wallet you think of some obscure and clever phrase and then hash the phrase using perhaps the sha256 alogorithm.  
  * Brain wallets are vulnerable to dictionary attacks.  
  * Any phrase you can possibly think of is already in someone's dictionary and hashed.  
  * The attacker then dedicates compters to scan the Tangle looking for addresses generated by brain wallets in the dictionary.  
  * Do not use brain wallets.  
  * Only seeds generated by completely random methods such as flipping a coin should be used.  
* Do not generate your seeds by the following methods.  
  * Do not use online seed generators or your IOTAs will be stolen.  
  * Do not use pseudo-random number generators or your IOTAs will be stolen.  
  * Do not generate random numbers on any machine that connects to the Internet or connects to other devices.   
*  
* The following is my method for generating an IOTA seed:  
  * Run the following line on an airgapped raspberry pi at the BASH console (not the NodeJS console) to get a random seed for IOTA.  
  * `sudo cat /dev/hwrng |LC_ALL=C tr -dc 'A-Z9' | fold -w 81 | head -n 1`  
  * This will produce an 81 character long string consisting of only UPPER CASE letters and the number **9**  
  * Then change some output characters at random in case the generator has been compromised by criminals.  
  * When changing characters, only use UPPER CASE letters and the number **9**, and do not change the amount of characters.  
  * There must be exactly 81 characters which can be UPPER CASE letters and the number **9** is also allowed.  
* The above method does not use a sudo random number generator.  
* The code fragment `/dev/hwrng` is specifying that a special piece of hardware on the raspberry pi which reads truly random electrical events is used to generate the seed.  
* No algorithm is being used.  
* The raspberry pi is basically flipping a coin and recording the result of each flip.  
* Be sure you understand the difference between a truly random string of characters and a pseudo random string.  
* Use random processes to generate your seed.  
* Do not use pseudo random processes to generate your seed.  
*  
* The following commands executed at the bash console (not the NodeJS console) counts characters in the string surrounded by quotes.  
```  
myvar="THISISMYSTRING9"  
echo ${#myvar}  
```   
* In the example above the output will read **15** because there are 15 characters in "THISISMYSTRING9"
* You can use the above commands to check that there are still 81 characters in your seed after you have substituted characters.  
* Later as we proceed you will be using IOTA's NodeJS API to ensure that your seed is valid.  

* Generate two seeds for this tutorial.  
* The first seed we will call **seed a** and the second seed we will call **seed b**  
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
    * If the message shows your spending address when decrypted then the Tangle computers are enabled to execute the transfer of IOTAs as specified in the signed transaction bundle.  
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
* Everyone can see how many IOTAs are in each addresses and everyone can see to what addresses IOTAs move when they are spent. 
* That means that you can not use the IOTA Tangle to hide your money from the government and you can not hide the purchases you make.  
* It is a common misconception that IOTA can be used for money laundering and other illegal activities.  
* This is not possible with IOTA because you can see where every IOTA is and how every IOTA got there.  
* [The government uses distributed public ledgers like IOTA to catch criminals](https://youtu.be/507wn9VcSAE).  
* Using cash, no one can see how much you have, where it came from, or where you spend it.    
* The same is true of bank accounts especially the secret offshore accounts used by criminals and tax evaders.  
* Cash is the currency of choice for the common criminal.  
* Banks are used by sophisticated criminals and bankers themselves [to commit colossal crimes](https://theweek.com/articles/729052/brief-history-crime-corruption-malfeasance-american-banks).  
* The original cryptocurrency (BitCoin) was invented [to end the misery banks cause humanity](https://bitcoinmagazine.com/articles/ten-years-later-reflection-bitcoins-genesis-and-satoshis-timing/)  
* So why, you may be wondering, do they call it cryptocurrency if it's completely transparent.  
* It's because cryptography is used to protect the seeds you use to control your accounts.  
* In any case, the purpose of IOTA is to give citizens full control of their money not to hide it the way you can with cash and offshore bank accounts.  

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

#### Reference Materials  
* The best IOTA Playlist ever [is found here](https://www.youtube.com/playlist?list=PLmL13yqb6OxdIf6CQMHf7hUcDZBbxHyza)  
* [This web seminar](https://youtu.be/Z-NN0rRcwY0?t=178) was my first introduction to moving IOTA using NodeJS scripts.  
  * The code [is found here](https://github.com/iota-community/iota-workshop) if you want to follow along with the examples.  
  * This is well worth your time as a introduction.  
  * My tutorial that you are reading now is largely based on this.  
  * After viewing the web seminar, return here for very specific examples on how to move IOTA with NodeJS.  
* Official IOTA developer documentation [is found here](https://docs.iota.org/).  
* Unofficial IOTA foundation documentation that seems to be used internally [is found here](https://domschiener.gitbooks.io/iota-guide/)  
* The IOTA JavaScript Library [is found here](https://github.com/iotaledger/iota.js).  
* The API Reference for using the above library [is found here](https://github.com/iotaledger/iota.js/blob/next/api_reference.md).  
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
* For another great producer of relevant tutorials [click here](https://www.youtube.com/user/TechGuyWeb/playlists)  

### Lets Make a Signed Transaction Bundle  

#### Install NodeJS on your airgapped machine and your online machine as well.  
* You are probably wondering, how am I supposed to install software on an airgapped machine that does not connect to the Internet?  
* Well your airgapped machine is not airgapped until you say it's airgapped so for right now it's ok to connect to the Internet.  
* When all the software is installed and you are ready to sign transactions, then you simply pull the plug on the Internet and never connnect to it again.  
* Then you will create new seeds and new addresses from behind the airgap and use these instead of the experimental ones you are playing with now.  
* If you are using a PrivateKeyVault or a raspberry pi 2 then NodeJS installation instructions are [here](https://github.com/johnshearing/PrivateKeyVault#install-nodejs-and-npm).  
* Othewise download NodeJS for your system [here](https://nodejs.org/en/download/).  
 
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
* `git clone https://github.com/johnshearing/IOTA-Airgapped-NodeJS-Console-Wallet.git`  
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
* If you are using two computers then the following steps will be performed on you offline computer.  
* That's the computer that does not connect to the Internet nor to other devices.  
* Open your favorite text editor and use it to open the document that contains your two seeds.  
* Be sure no one can see this document. 
* If anyone manages to record your seeds then they have all the IOTA controlled by those seeds.  
* If your text editor has a read only mode it would be best to open the document in read only mode.  
* It would be a tragedy if you accidently changed your seeds after you have created the addresses because then you would lose control over those addresses and all the IOTAs they contain. If you don't have read only mode in your text editor don't worry too much - you backed up your seeds. You did back up your seeds - right?  
* Now open a second instance of your favorite text editor and open the script named **30-create-address.js** in the **Console-Wallet** repository.  
* The script should look much like the script seen below.  
```
///////////////////////////////
// Create an address from a new seed
///////////////////////////////

const iotaLibrary = require('@iota/core')

const iota = iotaLibrary.composeAPI({})

// Your seed should look something like the following:
// FATTCNIQXGTTCSKIUVPRQXNRAGSHDGTGGGTOHQPMDBXHSDCNHPYQRCNI9AXDLIVCCA9KATTHSOSZZOIDV
// Don't use the seed above. Use your own seed.  
// Paste your seed between the quotes below.  

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
* Before changing the script, save it as `a-create-address.js`  
Now you still have the original script unchanged for future use and you have the current script to make addresses for **seed a**  

* Copy and paste the first of your two seeds (seed a) into the script where it says:  
`'Paste-Your-Seed-Between-These-Quotes'`  
* Now save the change you made to the script.  
* Notice the line of code which reads as follows:  
`.getNewAddress(seed, { index: 0, total: 5, checksum: true })`  
* About **total**:  
  * **total** specifes the amount of addresses that will be generated.  
  * In this example we are generating 5 addresses.  
* About **index**:  
  * The index is how each address is identified.  
  * The first address generated by a seed is referred to as **address 0**  
  * The second address generated by a seed is referred to as **address 1**  
  * The third address generated by a seed is referred to as **address 2** and so on.  
  * In this example we have specifed that the NodeJS script will start generating addresses at index 0.  
* About **checksum**  
  * A checksum is 9 characters appended to an address.  
  * The checksum is used to ensure that:  
    * The address is of the correct length.  
    * The address has not been changed since the checksum was created.  
  * So if you create a checksum at the time you create the address then you will know if the address has been changed.  
  * If you wish to wish to move IOTAs on the Tangle, the address must include a checksum.  
  * For all these reasons always set the checksum parameter to **true**.  
* There also exists an optional security level parameter.  
  * We did not specify a security level parameter with the other options in the script above.  
  * The default when no security level is specified is **2**.  
  * So in our example, the script will generate addresses that have a security level of 2.  
  * Security level 1 is used for passing messages and small amounts of IOTA where speed of the transaction is the primary consideration.  
  * Security level 2 is considered a very good compromise between security and speed of transactions.  
  * Security level 3 is used for full blown quantum resistance where very large amounts of IOTA are being moved.  
* More documentation about the **getNewAddress** function [is found here](https://github.com/iotaledger/iota.js/blob/next/api_reference.md#coregetnewaddressseed-options-callback)  
* A very good video explaining technical details of addresses [can be found here](https://youtu.be/YdYjJA-NFcE)  
*  
* Next we are going to run the script at the BASH console.  
* Open the BASH console and navigate to the **Console-Wallet** directory using the `cd` command.  
* Now execute the following command to run the script:  
* `node a-create-address.js`  
* Be patient as your computer works.  
* The script will produce output similar to the following but not exactly the same.  
```  
`GetNewAddressOptions`: 5,true options are deprecated and will be removed in v.2.0.0. 

Your address is: DVZRJOKM9KQKRLLIQPQAWASCQGBHYJURXGOBAJPZNHHQAYCXTZFQZJTIBX9OQHOHFDNLQWFYGWRFALSBXBQPACGMUA,AMECMIEELJKYZPQLBVSMJLSVPQFDSDZHTIWGORVJD9OUDGYINMOABRINKLW9HFVSFAKUQSWTJGCGSILS9MGNBSOAIA,AYKJNRHMHA9CHSLREPDJBRMYLPOBJRGYPFYYNDSVBJYWEIEVCEQPRBQSEHXSFKLCBQJADSZSYJLUKBCGWKDHOCYROD,BOHZADRVGVCTVEWFQQZNYSHWXGZFDVDPDXKWGGEEALYHKYIWSZMEA9ZGZILNJQBXQMFNQRXOGUIPK9HACEELAFMNIB,UI9UUGM9QZGNSNCCIGUDQOMGRRZT9CNJXUORVNCVNBJLU9KYAYWNUQWLBLKKOXHCSHPXKOEVPAPFINAD9VUOPXREO9
```  
* The output shown above is 5 different addresses each of which is separated from the others with a comma.  
* Using your favorite text editor, organize the addresses so they look as follows:  
* The two back slashes at the beginning of each line are important. You will see why shortly.  
* Save this document as `addresses-for-seed-a`
```  
// Addresses for seed a
// Address at index 0 - DVZRJOKM9KQKRLLIQPQAWASCQGBHYJURXGOBAJPZNHHQAYCXTZFQZJTIBX9OQHOHFDNLQWFYGWRFALSBXBQPACGMUA
// Address at index 1 - AMECMIEELJKYZPQLBVSMJLSVPQFDSDZHTIWGORVJD9OUDGYINMOABRINKLW9HFVSFAKUQSWTJGCGSILS9MGNBSOAIA
// Address at index 2 - AYKJNRHMHA9CHSLREPDJBRMYLPOBJRGYPFYYNDSVBJYWEIEVCEQPRBQSEHXSFKLCBQJADSZSYJLUKBCGWKDHOCYROD
// Address at index 3 - BOHZADRVGVCTVEWFQQZNYSHWXGZFDVDPDXKWGGEEALYHKYIWSZMEA9ZGZILNJQBXQMFNQRXOGUIPK9HACEELAFMNIB
// Address at index 4 - UI9UUGM9QZGNSNCCIGUDQOMGRRZT9CNJXUORVNCVNBJLU9KYAYWNUQWLBLKKOXHCSHPXKOEVPAPFINAD9VUOPXREO9
```  
#### Transfer Your Addresses but not the Seeds To Your Online Computer.  
* If you are using only one computer for these exercizes then of course there is no need to transfer addresses.  
* If you are using two computers for this exercise then you must find a safe way to transfer your addresses to your online computer.  
* **Do not transfer your seeds to the online computer. Your seeds are secret. Keep your seeds on your offline computer only.**  
* The [PrivateKeyVault](https://youtu.be/3MwJOj3t8cI) is built for the purpose of transfering selected documents between online and offline devices without exposing anything to online devices except for the document you intend to transfer.  
* If you are not using a PrivateKeyVault, then there are other secure methods to make the transfer.  

#### Put Your Addresses In The Script That Made Them.  
* Now paste your organized addresses into the script you used to create them.  
* In other words, paste the addresses into script **a-create-address.js**  
* Be super careful not to change your seed accidentally.  
* Paste the addresses near the bottom so the script now looks similar to the following.  
* Your seed and addresses will be different of course.  
* The two back slashes at the begining of each address line tell NodeJS that these are comments and not code to be executed.  
* **The script should only exist on your offline (isolated) computer because the script contains your seed.**  
```
///////////////////////////////
// Create addresses for seed a
///////////////////////////////

const iotaLibrary = require('@iota/core')

const iota = iotaLibrary.composeAPI({})

const seed =
  'FATTCNIQXGTTCSKIUVPRQXNRAGSHDGTGGGTOHQPMDBXHSDCNHPYQRCNI9AXDLIVCCA9KATTHSOSZZOIDV'

iota
  .getNewAddress(seed, { index: 0, total: 5, checksum: true })
  .then(address => {
    console.log('Your address is: ' + address)
  })
  .catch(err => {
    console.log(err)
  })
  
// Addresses for seed a
// Address at index 0 - DVZRJOKM9KQKRLLIQPQAWASCQGBHYJURXGOBAJPZNHHQAYCXTZFQZJTIBX9OQHOHFDNLQWFYGWRFALSBXBQPACGMUA
// Address at index 1 - AMECMIEELJKYZPQLBVSMJLSVPQFDSDZHTIWGORVJD9OUDGYINMOABRINKLW9HFVSFAKUQSWTJGCGSILS9MGNBSOAIA
// Address at index 2 - AYKJNRHMHA9CHSLREPDJBRMYLPOBJRGYPFYYNDSVBJYWEIEVCEQPRBQSEHXSFKLCBQJADSZSYJLUKBCGWKDHOCYROD
// Address at index 3 - BOHZADRVGVCTVEWFQQZNYSHWXGZFDVDPDXKWGGEEALYHKYIWSZMEA9ZGZILNJQBXQMFNQRXOGUIPK9HACEELAFMNIB
// Address at index 4 - UI9UUGM9QZGNSNCCIGUDQOMGRRZT9CNJXUORVNCVNBJLU9KYAYWNUQWLBLKKOXHCSHPXKOEVPAPFINAD9VUOPXREO9  
```    
* As you can see:
  * I changed the line at the very top to read `// Create addresses for seed a`.  
  * I got rid of the unnecessary comments.  
  * I appended the organized addresses to the bottom of the script.  
*  
* You should now run the script again at the BASH console using the same command we used before which is given again below:  
* `node a-create-address.js`  
* Check the output of the script and make sure it is producing the same addresses.  
* This is your last opportunity to make sure your seed controls the addresses where you will be sending your IOTAs.  
* **If everything checks out then make a backup copy of the script `a-create-address.js` and keep is somewhere safe**.  
* Do not miss this opportunity to backup your seed - you will be very glad if you do and very sad if you do not.  

#### Make Addresses for Seed b  
* Ok, so you have five addresses which you can control with **seed a**  
* Follow the steps above using the other seed you made (call it **seed b**).  
* Then you will be able to practice sending IOTAs between addresses controlled with two different seeds.  

#### Buy Ethereum To Buy IOTAs  
* There is no place where you can buy IOTAs with US Dollars at the time of this writing.  
* You can however buy Ethereum with dollars and use your Ethereum to purchase IOTAs.  
* Use https://www.kraken.com/ to purchase Eth.  
* Then send Eth to https://www.binance.com/en and exchange them for IOTAs.  
* A written tutorial showing how to buy Eth on Kraken using Dollars [is found here](https://etherbasics.com/the-tutorials/buy-ether-on-kraken/)  
* A video showing how to buy IOTAs on Binance using Eth [is found here](https://www.youtube.com/watch?v=GEd1G9Mw4Fc)  
* You don't even need a tutorial because customer support is very good with both companies.  

#### Send IOTAs to address a0  
* Once you have purchased IOTAs on binance, send them to your address at index 0 which was made with **seed a**.  
* Lets call this **address a0**  
* First send a very small amount of IOTA to **address a0**  
* Follow the directions on Binance to accomplish this.  
* You could just leave your IOTAs in your Binance account.    
* In that case, your IOTAs are in an address controlled by a seed which is in the posession of Binance.  
* All you have is a password to your Binance account and a promise that you can have your IOTAs went you ask for them.  
* The are risks as follows:  
  * If Binance gets hacked you loose your IOTAs.  
  * If Binance mismanages your account you loose your IOTAs.  
  * If Binance steals your account you loose your IOTAs.  
  * If a goverment forces Binance to confiscate your account you loose your IOTAs.  
* Also, at the time of this writing, Binance charges .5 MIOTAs for each outgoing transaction whereas outgoing transactions are free when you send them from an account that you control.  
* Once your IOTAs are in an address that you control, you can start to do interesting things like:  
  * Buy and sell goods and services from humans and machines.  
  * Buy and sell computing power, and information on the Internet of Things,  
  * Use smart contracts to automate your business,  
  * Use multisignature wallets for even greater security.  
  
#### Find a Healthy Computer on the Tangle To Use For Checking the Balance of Your New Address  
* There are computers all over the planet which maintain a record of all the addresses and their balances on the IOTA Tangle.  
* They all talk to each other to ensuring that they all have the same information and that the information is correct.  
* Anyone can setup one or more of these computers but that is outside the scope of this tutorial.  
* We just need to find a healthy one to use for checking the balance of your new address.  
* Open the browser of your of your online computer.  
* Using your online computer of course:
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

#### Check That You Can Connect to the Tangle  
* Using your online computer again: 
* Using your favorite text editor, open the script called `20-check-node-health.js` in the **Console-Wallet** directory.  
* The contents of the file will be as follows:  
```  
///////////////////////////////
// Environment Check
///////////////////////////////	

const iotaLibrary = require('@iota/core')

const iota = iotaLibrary.composeAPI({
  //Lookup healthy nodes at https://iota.dance/
  //provider: 'https://nodes.thetangle.org:443'
  provider: 'Paste-The-URL-Of-A-Healthy-Node-Between-These-Quotes'
})

iota
  .getNodeInfo()
  .then(response => console.log(response))
  .catch(err => {
    console.error(err)
  })
```  
* Paste the URL you copied from **https://iota.dance/** between the quote marks in the script where it says:  
* `'Paste-The-URL-Of-A-Healthy-Node-Between-These-Quotes'`  
* Now save the file.  
*  
* Next we are going to run the script to see if we can connect to the Tangle via the healthy node you found at **https://iota.dance/**
* Open the BASH console and navigate to the **Console-Wallet** directory using the `cd` command.  
* Now execute the following command to run the script:  
* `node 20-check-node-health.js`  
* The script will produce output similar to the following but not exactly the same.  
```  
{ appName: 'IRI',
  appVersion: '1.7.0-RELEASE',
  jreAvailableProcessors: 16,
  jreFreeMemory: 1564574175,
  jreVersion: '1.8.0_191',
  jreMaxMemory: 20997734400,
  jreTotalMemory: 3747132179,
  latestMilestone:
   'OIRE9NRFXSCAWUSZQRPATVJJNJHMGQTIBMWSCYDNQOHGIKCVEQYT9DLVBPJAIRTGTHACWSJKVWIYZ9999',
  latestMilestoneIndex: 1054755,
  latestSolidSubtangleMilestone:
   'OIRE9NRFXSCAWUSZQRPATVJJNJHMGQTIBMWSCYDNQOHGIKCVEQYT9DLVBPJAIRTGTHACWSJKVWIYZ9999',
  latestSolidSubtangleMilestoneIndex: 1054755,
  milestoneStartIndex: 1050001,
  lastSnapshottedMilestoneIndex: 1054653,
  neighbors: 24,
  packetsQueueSize: 0,
  time: 1555647553652,
  tips: 8336,
  transactionsToRequest: 0,
  features: [ 'loadBalancer', 'snapshotPruning', 'RemotePOW' ],
  coordinatorAddress:
   'EQSAUZXULTTYZCLNJNTXQTQHOMOFZERHTCGTXOLTVAHKSA9OGAZDEKECURBRIXIJWNPFCQIOVFVVXJVD9',
  duration: 0 }
```  
* If the console output looks much like the above then you are able to connect with the Tangle through healthy node you found.  

#### Check Your Balance at Address a0  
* Lets see if the IOTAs you sent from your Binance account to address a0 was actually transfered to your account.  
* Using your favorite text editor, open the file you used to create your addresses from **seed a**  
* The file was named `a-create-address.js`  
* It would be best to open this script in read only mode if your text editor offers this option.  
* You don't want to change the contents of this file.  
* You did back up that file - right?  
* Copy the address generated by **seed a** at the 0 index postion onto the clipboard.  
* That's the first address.  
* Copy the first address onto your clipboard.  
* Now close the file **without** saving any changes if you accidently changed the contents of the file.  
*  
* Using your favorite text editor, open the script called `40-check-balance.js` in the **Console-Wallet** directory.  
* The contents of the file will be as follows:  
```  
///////////////////////////////
// Fetch balance of an address
///////////////////////////////

const iotaLibrary = require('@iota/core')

const iota = iotaLibrary.composeAPI({
	
  //Lookup healthy nodes at https://iota.dance/
  //provider: 'https://nodes.devnet.thetangle.org:443'
  //provider: 'https://nodes.thetangle.org:443'
  provider: 'Paste-The-URL-Of-A-Healthy-Node-Between-These-Quotes'
})

// Your address should look something like the following:
// DVZRJOKM9KQKRLLIQPQAWASCQGBHYJURXGOBAJPZNHHQAYCXTZFQZJTIBX9OQHOHFDNLQWFYGWRFALSBXBQPACGMUA
// Don't use the address above. Use your own address.  
// Paste your address between the quotes below.  

const address = 
  'Paste-Your-Address-Between-These-Quotes'

iota
  .getBalances([address], 100)
  .then(({ balances }) => {
    console.log(balances)
  })
  .catch(err => {
    console.error(err)
  })

```  
* Paste the address you copied onto the clipboard between the quote marks in the script where it says:  
* `'Paste-Your-Address-Between-These-Quotes'`  
* Now save the script.  
*  
* Next we are going to run the script.  
* Open the BASH console and navigate to the **Console-Wallet** directory using the `cd` command.   
* Now execute the following command to run the script:  
* `node 40-check-balance.js`  
* The script outputs a number.  
* That number is your balance in IOTAs.  
*  
* This should be the amount of IOTAs you sent to this address from Binance.  
* You may be surprised to see 6 unexpected zeros at the end of your balance.  
* That's because you bought and sent MIOTAs (Million IOTAs) from Binance while the NodeJS API works with individual IOTAs.  
* In the same way 1 dollar is the same as 100 cents, 1 MIOTA is the same as 1000000 IOTAs.  
* The monetary value is the same - it just looks different.  
*  
* In order to send IOTAs from an address you will need to provide the balance of that address to a script in coming steps.  
* So for now, record your balance in the script named `addresses-for-seed-a` which exists on your online computer.   
* Also record your balance in the script named `a-create-address.js` which exists on your offline (isolated) computer.  
* Make sure you have this file backed up before making your changes.  
* You already have a list of addresses for **seed a** in these scripts.  
* Just record the balance for the address at index 0 as shown below.  
* Your balance is likely different and you address will surely be different but the example below shows what to do.  
```  
// Addresses for seed a
// Address at index 0 - Balance is 10000000 IOTAs - DVZRJOKM9KQKRLLIQPQAWASCQGBHYJURXGOBAJPZNHHQAYCXTZFQZJTIBX9OQHOHFDNLQWFYGWRFALSBXBQPACGMUA
// Address at index 1 - AMECMIEELJKYZPQLBVSMJLSVPQFDSDZHTIWGORVJD9OUDGYINMOABRINKLW9HFVSFAKUQSWTJGCGSILS9MGNBSOAIA
// Address at index 2 - AYKJNRHMHA9CHSLREPDJBRMYLPOBJRGYPFYYNDSVBJYWEIEVCEQPRBQSEHXSFKLCBQJADSZSYJLUKBCGWKDHOCYROD
// Address at index 3 - BOHZADRVGVCTVEWFQQZNYSHWXGZFDVDPDXKWGGEEALYHKYIWSZMEA9ZGZILNJQBXQMFNQRXOGUIPK9HACEELAFMNIB
// Address at index 4 - UI9UUGM9QZGNSNCCIGUDQOMGRRZT9CNJXUORVNCVNBJLU9KYAYWNUQWLBLKKOXHCSHPXKOEVPAPFINAD9VUOPXREO9  
```  
* Be very careful not to change the seed or any of the addresses or you will loose your IOTAs.  
* You did back up these files - right?  

#### Make A Signed Transaction Bundle and Broadcast It To The Tangle
* In order to spend your IOTAs you need to:  
  * Make a signed transaction bundle on your offline computer,  
  * Transfer the signed transaction bundle to your online computer, and finally,  
  * Broadcast the signed transaction bundle to the Tangle using your online computer.  
  * This will move IOTAs from one address to another.  
* If you are using only one computer for these exercizes then of course all three steps are preformed on that single computer.  
*  
* Lets send a few IOTAs from the **address at index 0 for seed a (a0)** to the **address at index 0 for seed b (b0)** with any unspent IOTAs going to the address at **index 1 for seed a (a1)**.  
* Using your offline computer, open the script named `50-sign-bundle.js` with your favorite text editor.  
* It should look as seen below:  
```  
//////////////////////////////////////
// Sign Bundle Using Offline Computer
//////////////////////////////////////


const { createPrepareTransfers } = require('@iota/core'); 
const { asciiToTrytes } = require('@iota/converter');


let seed = 'Paste-Your-Seed-Between-These-Quotes';
let fromAddress = 'Paste-Your-Spending-Address-Between-These-Quotes';
let fromAddressIndex = 0; //Substitute the zero with the index of your spending address.
let fromAddressBalance = 0; //Substitute the zero with the amount of IOTAs in your spending address.
let toAddress = 'Paste-The-Recipient-Address-Between-These-Quotes';
let securityLevel = 2; //Substitute the 2 with the security level you chose when you made your spending address.
let transferAmount = 0; //Substitute the zero with the amount of IOTAs you wish to spend.
let remainderAddress = 'Paste-Your-Remainder-Address-Between-These-Quotes';
let message = ''; // You can paste as message between the quotes if you want.
  

// Construct a transfers object
let transfers = [{
  'address': toAddress,
  'message': asciiToTrytes(message),
  'value': transferAmount,
  'tag': 'SENDTO'
}];

// Add a remainder address if specified by the user
if (remainderAddress) {
  transfers.push({
    'address': remainderAddress,
    'message': asciiToTrytes(message),
    'value': fromAddressBalance - transferAmount,
    'tag': 'REMAINDER'
  });
}

// Construct an options object that includes the input
let options = {};
if (transferAmount > 0) {
  options = {
    'inputs': [{
      'keyIndex': fromAddressIndex,
      'address': fromAddress,
      'security': securityLevel,
      'balance': fromAddressBalance
    }]
  };
}

// Sign the bundle
createPrepareTransfers()(seed, transfers, options)
  .then((bundleTrytes) => {
    console.log("Success! Transaction bundle signed!");
    
    console.log(JSON.stringify(bundleTrytes));
    
  })
  .catch((err) => {
    console.log(`Error: ${err}`);
  });
```  
* Assign values to the variables as prompted in the script.  
* Just paste the appropriate information into each **let** statement near the top of the script.  
* You will find all the information you need in the previous scripts that you have made.  
* Save the modified script as `a0-b0-a1-sign-bundle.js`  
  * You could of course name the script whatever you want but this name helps you remember what the script is for.  
* It would also be a good idea to put a description of what the script is doing in the comments at the top of the script.  
* Do not delete the script after you run it. You may need to refer to it later.  
* Finally run the saved script at the BASH console as we have done with previous scripts.  
  * Open the BASH console.  
  * cd into the **Console-Wallet** directory,  
  * And execute the folowing line of code:  
  * `node a0-b0-a1-sign-bundle.js`  
* The console will output an enormously long string of characters surounded by brackets like these **[]**   
* **The output at the console is your signed transaction bundle.**  
* Copy the output (the brackets and everything between them) onto the clipboard.  
* 
* Now using your favorite text editor, open the file named `70-broadcast-bundle.js`  
* It should look as seen below:  
```  
//////////////////////////////////////
// Broadcast Bundle Using Online Computer
//////////////////////////////////////


const iotaLibrary = require('@iota/core');

const iota = iotaLibrary.composeAPI({
  //Lookup healthy nodes at https://iota.dance/
  //provider: 'https://nodes.devnet.thetangle.org:443'
  //provider: 'https://nodes.thetangle.org:443'
  provider: 'Paste-The-URL-Of-A-Healthy-Node-Between-These-Quotes'
})

const myTrytes = Paste-Signed-Transaction-Bundle-Here-Including-The-Surounding-Brackets

// Create a wrapping function so we can use async/await
const main = async () => {

  try {
    // Send bundle to node.
    const response = await iota.sendTrytes(myTrytes, 3, 14);
    console.log('Completed TXs');
    response.map(tx => console.log(tx));
  } catch (e) {
    console.log(e);
  }
}

main()
```  
* Paste your signed transaction bundle after the equal sign where it says `Paste-Signed-Transaction-Bundle-Here-Including-The-Surounding-Brackets`  
* Then save the script as `a0-b0-a1-broadcast-bundle.js`  
* Do not delete this script after running it. You may need to refer to it later.  
* If you are using two computers then transfer this script to your online computer for broadcasting to the tangle.  
* Finally run the saved script at the BASH console as we have done with previous scripts.  
  * Open the BASH console.  
  * cd into the **Console-Wallet** directory,  
  * And execute the folowing line of code:  
  * `node a0-b0-a1-sign-bundle.js`  
* If everything went well, your bundle has been broadcasted and your IOTAs will have been moved according to the directions in the bundle.  
* Save the output produced by the bash console incase you need it for trouble shooting.  
* Then check the balances of your accounts and be sure to update your address balance records.  

#### Congratulations
You now know how to move IOTAs using NodeJS at the Bash console.  

  
  





