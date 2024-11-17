// iss_promised.js
const needle = require('needle');

//const { fetchMyIP } = require('./iss_promised');
//const { fetchCoordsByIP} = require('./iss_promised');
//const { fetchISSFlyOverTimes} = require('./iss_promised');
const { nextISSTimesForMyLocation } = require('./iss_promised');
const { printPassTimes } = require('./index'); 

// Call 
nextISSTimesForMyLocation()
  .then((passTimes) => {
    printPassTimes(passTimes);
  })
  .catch((error) => {
    console.log("It didn't work: ", error.message);
  });