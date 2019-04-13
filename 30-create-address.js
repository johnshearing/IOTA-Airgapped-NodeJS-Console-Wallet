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
