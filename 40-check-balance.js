///////////////////////////////
// Fetch balance of an address
///////////////////////////////

const iotaLibrary = require('@iota/core')

const iota = iotaLibrary.composeAPI({
	
  //Lookup healthy nodes at https://iota.dance/	
	
  //provider: 'https://nodes.devnet.thetangle.org:443'
  provider: 'https://nodes.thetangle.org:443'
})

const address = 
  'DVZRJOKM9KQKRLLIQPQAWASCQGBHYJURXGOBAJPZNHHQAYCXTZFQZJTIBX9OQHOHFDNLQWFYGWRFALSBXBQPACGMUA'

iota
  .getBalances([address], 100)
  .then(({ balances }) => {
    console.log(balances)
  })
  .catch(err => {
    console.error(err)
  })
