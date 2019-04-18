///////////////////////////////
// Fetch balance of an address
///////////////////////////////

const iotaLibrary = require('@iota/core')

const iota = iotaLibrary.composeAPI({
	
  //Lookup healthy nodes at https://iota.dance/
  //provider: 'https://nodes.devnet.thetangle.org:443'
  //provider: 'https://nodes.thetangle.org:443'
  provider: 'Paste-The-URL-Of-A-Health-Node-Here'
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
