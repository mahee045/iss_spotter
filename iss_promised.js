/*
 * Requests user's ip address from https://www.ipify.org/
 * Input: None
 * Returns: Promise of request for ip data, returned as JSON string
 */
const needle = require('needle');
const fetchMyIP = function() {
  return needle('get','https://api.ipify.org?format=json')
  .then((response) => {
    const body = response.body; // retrieve the body value from the response object
    const ip = body.ip; // retrieve the ip from the body object
    return ip;
  });
};

module.exports = { fetchMyIP };

/* 
 * Makes a request to ipwho.is using the provided IP address to get its geographical information (latitude/longitude)
 * Input: IP address as a string
 * Returns: Promise of request for lat/lon
 */
const fetchCoordsByIP = function(ip) {
  return needle('get',`http://ipwho.is/${ip}`)
  .then((response) => {
    const body = response.body; //retrieve body from response
    const latitude = body.latitude; // retrieve latitude from body
    const longitude = body.longitude; // retrieve longitude from body
    return {latitude, longitude};
  });
};

module.exports = { fetchMyIP, fetchCoordsByIP };

/*
 * Requests data from https://iss-flyover.herokuapp.com using provided lat/long data
 * Input: Body containing geo data response from ipwho.is
 * Returns: Promise of request for fly over data, returned as JSON string
 */
const fetchISSFlyOverTimes = function(coords) {
  const latitude = coords.latitude
  const longitude = coords.longitude;
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`;
  return needle('get', url)
  .then((response) => {
    const body = response.body;
    const passtimes = body.response; // changed the name from response to passtimes for clarification
    return passtimes;
  });
};

///module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes };

const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then((ip) => fetchCoordsByIP(ip))
    .then((coords) => fetchISSFlyOverTimes(coords))
    .then((passtimes) => {
      return passtimes;
    });
};

module.exports = { nextISSTimesForMyLocation };