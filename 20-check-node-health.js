///////////////////////////////
// Environment Check
///////////////////////////////	

const iotaLibrary = require('@iota/core')

const iota = iotaLibrary.composeAPI({
  //Lookup healthy nodes at https://iota.dance/
  provider: 'https://nodes.thetangle.org:443'
})

iota
  .getNodeInfo()
  .then(response => console.log(response))
  .catch(err => {
    console.error(err)
  })
