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

  // Retrieve authorization header from the incoming request
  const authorizationHeader = req.headers['authorization'];

  switch (method) {
    case "GET":
      try {
        if (!url.includes("http://") && !url.includes("https://")) {
          url = "https://" + url;
        }

        // Set up the headers for the fetch request
        const headers = {};
        if (authorizationHeader) {
          headers['Authorization'] = authorizationHeader;
        }

        const response = await fetch(encodeURI(url), { headers });
        const html = await response.text();
        res.status(200).json({ html });
      } catch (error) {
        console.error("Error fetching HTML:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
      break;
    default:
      res.status(400).json({ success: false, error: `Unhandled request method: ${method}` });
      break;
  }
}
