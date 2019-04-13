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
