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
