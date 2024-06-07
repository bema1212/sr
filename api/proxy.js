// api/proxy.js
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  try {
    // Retrieve the external URL from the query parameters sent by the client
    const externalUrl = req.query.url;

    // Make a request to the external URL
    const response = await fetch(externalUrl);

    // Check if the request was successful
    if (!response.ok) {
      throw new Error('Failed to fetch data from external URL');
    }

    // Parse the JSON response
    const data = await response.json();

    // Send the JSON data back to the client
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
