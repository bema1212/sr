// api/proxy.js
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  try {
    // Retrieve the external URL and cookies from the query parameters sent by the client
    const { url, cookies } = req.query;

    // Make a request to the external URL
    const response = await fetch(url, {
      headers: {
        // Include cookies in the request headers
        Cookie: cookies || ''
      }
    });

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
