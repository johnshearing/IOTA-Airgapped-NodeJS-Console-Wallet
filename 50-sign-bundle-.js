//////////////////////////////////////
// Sign Bundle Using Offline Computer
//////////////////////////////////////


const { createPrepareTransfers } = require('@iota/core'); 
const { asciiToTrytes } = require('@iota/converter');


let seed = 'FATTCNIQXGTTCSKIUVPRQXNRAGSHDGTGGGTOHQPMDBXHSDCNHPYQRCNI9AXDLIVCCA9KATTHSOSZZOIDV';
let fromAddress = 'DVZRJOKM9KQKRLLIQPQAWASCQGBHYJURXGOBAJPZNHHQAYCXTZFQZJTIBX9OQHOHFDNLQWFYGWRFALSBXBQPACGMUA';
let fromAddressIndex = 0;
let fromAddressBalance = 17500000;
let toAddress = 'AMECMIEELJKYZPQLBVSMJLSVPQFDSDZHTIWGORVJD9OUDGYINMOABRINKLW9HFVSFAKUQSWTJGCGSILS9MGNBSOAIA';
let securityLevel = 2;
let transferAmount = 4000000;
let remainderAddress = 'AYKJNRHMHA9CHSLREPDJBRMYLPOBJRGYPFYYNDSVBJYWEIEVCEQPRBQSEHXSFKLCBQJADSZSYJLUKBCGWKDHOCYROD';
let message = 'test';
  

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



