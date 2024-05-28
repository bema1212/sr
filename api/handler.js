import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { method } = req;
  let { url } = req.query;

  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle OPTIONS preflight request
  if (method === "OPTIONS") {
    return res.status(200).end();
  }

  // Validate the URL parameter
  if (!url) {
    return res.status(400).json({ error: "MissingParameterValue", message: "The 'url' query parameter is required." });
  }

  console.log('Request method:', method);
  console.log('Request URL:', url);
  console.log('Authorization header:', req.headers['authorization']);

  // Ensure the URL includes the protocol
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  console.log('Fetching URL:', url);

  // Retrieve authorization header from the incoming request
  const authorizationHeader = req.headers['authorization'];

  switch (method) {
    case "GET":
      try {
        // Set up the headers for the fetch request
        const headers = {};
        if (authorizationHeader) {
          headers['Authorization'] = authorizationHeader;
        }

        const response = await fetch(encodeURI(url), { headers });
        const jsonResponse = await response.json();
        
        // Extract the "features" array and the "type" property from the JSON response
        const { features, type } = jsonResponse.html;

        // Construct a new JSON object with only the desired properties
        const result = { features, type };

        res.status(200).json(result);
      } catch (error) {
        console.error("Error fetching JSON:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false, error: `Unhandled request method: ${method}` });
      break;
  }
}
