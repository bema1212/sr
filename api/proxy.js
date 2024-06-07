// api/proxy.js
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  try {
    // Make a request to the external URL
    const response = await fetch('https://external-url.com');

    // Check if the request was successful
    if (!response.ok) {
      throw new Error('Failed to fetch data from external URL');
    }

    // Parse the JSON response and send it back
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
