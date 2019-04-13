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

// The following is the output:
// Seed - 

// Addresss 0 -  
// Addresss 1 - 
// Addresss 2 - 
// Addresss 3 - 
// Addresss 4 - 











