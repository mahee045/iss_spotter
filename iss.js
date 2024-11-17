const needle = require('needle');

const fetchMyIP = function (callback) {
  const url = 'https://api.ipify.org?format=json';

  needle.get(url, (error, response, body) => {
    if (error) {
      callback(`Network error: ${error.message}`, null);
      return;
    }

    if (response.statusCode !== 200) {
      callback(
        Error(`Status Code ${response.statusCode} when fetching IP: ${body}`),
        null
      );
      return;
    }

    const ip = body.ip; // No need for JSON.parse
    if (!ip) {
      callback('Failed to retrieve IP address.', null);
      return;
    }

    callback(null, ip);
  });
};

const fetchCoordsByIP = function (ip, callback) {
  const url = `http://ipwho.is/${ip}`;

  needle.get(url, (error, response, body) => {
    if (error) {
      callback(`Network error: ${error.message}`, null);
      return;
    }

    if (!body.latitude || !body.longitude) {
      const message = `Failed to retrieve coordinates for IP ${ip}. Response: ${JSON.stringify(body)}`;
      callback(Error(message), null);
      return;
    }

    const latitude = body.latitude;
    const longitude = body.longitude;
    callback(null, { latitude, longitude });
  });
};


const fetchISSFlyOverTimes = function (coords, callback) {
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;

  needle.get(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      callback(
        Error(
          `Status Code ${response.statusCode} when fetching ISS pass times: ${body}`
        ),
        null
      );
      return;
    }

    const passes = body.response; // No need for JSON.parse
    if (!passes) {
      callback('Failed to retrieve ISS flyover times.', null);
      return;
    }

    callback(null, passes);
  });
};

const nextISSTimesForMyLocation = function (callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };
