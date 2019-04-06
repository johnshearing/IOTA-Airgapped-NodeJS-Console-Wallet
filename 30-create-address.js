///////////////////////////////
// Create an address from a new seed
/////
// First: run this code in a unix based terminal to generate an 81 Tryte seed.
// 'sudo cat /dev/hwrng |LC_ALL=C tr -dc 'A-Z9' | fold -w 81 | head -n 1'
/////
// Then change some characters from the output at random.
/////
// Paste the output of the above code into the 'seed' section below.
///////////////////////////////

const iotaLibrary = require('@iota/core')


const iota = iotaLibrary.composeAPI({
  //Commented out because there is no need to connect in order to generate addresses.
  //Generating addresses should be done off line.	
  //provider: 'https://nodes.devnet.thetangle.org:443'
})


const seed =
  'FATTCNIQXGTTCSKIUVPRQXNRAGSHDGTGGGTOHQPMDBXHSDCNHPYQRCNI9AXDLIVCCA9KATTHSOSZZOIDV'

iota
  .getNewAddress(seed, { index: 0, total: 1, checksum: true })
  .then(address => {
    console.log('Your address is: ' + address)
  })
  .catch(err => {
    console.log(err)
  })

// The following is the output:
// Seed - FATTCNIQXGTTCSKIUVPRQXNRAGSHDGTGGGTOHQPMDBXHSDCNHPYQRCNI9AXDLIVCCA9KATTHSOSZZOIDV

// Addresss 0 Spent - DVZRJOKM9KQKRLLIQPQAWASCQGBHYJURXGOBAJPZNHHQAYCXTZFQZJTIBX9OQHOHFDNLQWFYGWRFALSBXBQPACGMUA  
// Addresss 1 Contains 19500000 IOTA- AMECMIEELJKYZPQLBVSMJLSVPQFDSDZHTIWGORVJD9OUDGYINMOABRINKLW9HFVSFAKUQSWTJGCGSILS9MGNBSOAIA
// Addresss 2 - AYKJNRHMHA9CHSLREPDJBRMYLPOBJRGYPFYYNDSVBJYWEIEVCEQPRBQSEHXSFKLCBQJADSZSYJLUKBCGWKDHOCYROD
// Addresss 3 - BOHZADRVGVCTVEWFQQZNYSHWXGZFDVDPDXKWGGEEALYHKYIWSZMEA9ZGZILNJQBXQMFNQRXOGUIPK9HACEELAFMNIB
// Addresss 4 - UI9UUGM9QZGNSNCCIGUDQOMGRRZT9CNJXUORVNCVNBJLU9KYAYWNUQWLBLKKOXHCSHPXKOEVPAPFINAD9VUOPXREO9











