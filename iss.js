const needle = require('needle');

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function (callback) {
  const url = 'https://api.ipify.org?format=json';

  needle.get(url, (error, response, body) => {
    if (error) {
      callback(`Network error: ${error.message}`, null);
      return;
    }

    if (response.statusCode !== 200) {
      callback(
        `Status Code ${response.statusCode} when fetching IP: ${response.body}`,
        null
      );
      return;
    }

    const ip = body.ip;
    if (!ip) {
      callback('Failed to retrieve IP address.', null);
      return;
    }

    callback(null, ip);
  });
};

/**
 * Makes a single API request to retrieve the latitude and longitude for a given IP address.
 * Input:
 *   - ip (string): The IP address to look up.
 *   - callback (function): A callback to handle the response or error.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - An object with latitude and longitude (null if error). Example: { latitude: '49.27670', longitude: '-123.13000' }
 */
const fetchCoordsByIP = function (ip, callback) {
  const url = `http://ipwho.is/${ip}`;

  needle.get(url, (error, response, body) => {
    if (error) {
      callback(`Network error: ${error.message}`, null);
      return;
    }

    if (!body.success) {
      const message = `Failed to retrieve coordinates for IP ${ip}. Message: ${body.message}`;
      callback(Error(message), null);
      return;
    }

    const latitude = body.latitude;
    const longitude = body.longitude;
    callback(null, { latitude, longitude });
  });
};

module.exports = { fetchMyIP, fetchCoordsByIP };
