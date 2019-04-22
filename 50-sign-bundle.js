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
