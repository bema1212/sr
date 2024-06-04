import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { method } = req;
  let { url } = req.query;

  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Timestamp");

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
  console.log('Timestamp header:', req.headers['x-timestamp']);

  // Ensure the URL includes the protocol
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  console.log('Fetching URL:', url);

  // Retrieve authorization and timestamp headers from the incoming request
  const authorizationHeader = req.headers['authorization'];
  const timestampHeader = req.headers['x-timestamp'];

  switch (method) {
    case "GET":
      try {
        // Set up the headers for the fetch request
        const headers = {};
        if (authorizationHeader) {
          headers['Authorization'] = authorizationHeader;
        }
        if (timestampHeader) {
          headers['X-Timestamp'] = timestampHeader;
        }

        // Use fetch to request the URL
        const response = await fetch(encodeURI(url), {
          headers,
          credentials: 'include' // Include credentials to handle cookies like JSESSIONID and lbsticky
        });

        // Retrieve the JSESSIONID and lbsticky from the response cookies
        const setCookie = response.headers.raw()['set-cookie'];
        let jsessionid = null;
        let lbsticky = null;

        if (setCookie) {
          const jsessionidCookie = setCookie.find(cookie => cookie.startsWith('JSESSIONID='));
          const lbstickyCookie = setCookie.find(cookie => cookie.startsWith('lbsticky='));
          
          if (jsessionidCookie) {
            jsessionid = jsessionidCookie.split(';')[0].split('=')[1];
          }
          if (lbstickyCookie) {
            lbsticky = lbstickyCookie.split(';')[0].split('=')[1];
          }
        }

        console.log('JSESSIONID:', jsessionid);
        console.log('LBSticky:', lbsticky);

        const html = await response.text();
        
        // Parse the HTML string as JSON
        const jsonResponse = JSON.parse(html);

        // Respond with the JSON content and include the JSESSIONID and lbsticky if needed
        res.setHeader('X-Session-ID', jsessionid); // Set the session ID in the response headers
        res.setHeader('X-LBSticky', lbsticky); // Set the lbsticky in the response headers
        res.status(200).json({ jsessionid, lbsticky, ...jsonResponse });
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
