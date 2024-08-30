// Import the HTTP and events modules
const http = require("http");
const events = require("events");

// Create an EventEmitter instance to handle custom events
const emitter = new events.EventEmitter();

// Function to set CORS headers on the response
function setCORSHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins
  res.setHeader("Access-Control-Request-Method", "*"); // Allow all request methods
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST"); // Specify allowed methods
  res.setHeader("Access-Control-Allow-Headers", "*"); // Allow all headers
}

// Handle GET requests to /messageChannel
function handleMessageChannel(req, res) {
  // Set response headers for Server-Sent Events (SSE)
  res.writeHead(200, {
    "Content-Type": "text/event-stream", // Content type for SSE
    "Cache-Control": "no-cache", // Disable caching
    "Connection": "keep-alive", // Keep the connection open
  });

  // Listen for 'newMessage' events and send them to the client
  emitter.on("newMessage", (userName, message) => {
    res.write(`${userName}: ${message}\n`); // Send the message as a new line in the response
  });
}

// Handle POST requests to /sendMessage
function handleSendMessage(req, res) {
  let body = "";

  // Collect data chunks from the request body
  req.on("data", (chunk) => {
    body += chunk.toString(); // Convert each chunk to a string and append it to body
  });

  // When all data has been received, process it
  req.on("end", () => {
    try {
      // Parse the JSON data received in the request body
      const { user, message } = JSON.parse(body);

      // Emit a 'newMessage' event with the user and message
      emitter.emit("newMessage", user, message);

      // Send a success response
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "Message sent to all clients" }));
    } catch (error) {
      // Handle any JSON parsing errors
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "Invalid JSON data" }));
    }
  });
}

// Create and configure the HTTP server
const server = http.createServer((req, res) => {
  // Set CORS headers for every request
  setCORSHeaders(res);

  // Route requests based on method and URL
  if (req.method === "GET" && req.url === "/messageChannel") {
    handleMessageChannel(req, res); // Handle GET requests to /messageChannel
  } else if (req.method === "POST" && req.url === "/sendMessage") {
    handleSendMessage(req, res); // Handle POST requests to /sendMessage
  } else {
    // Handle any other requests with a 404 Not Found response
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

// Start the server and listen on port 8080
server.listen(8080, () => {
  console.log("Point-Chat backend running on http://0.0.0.0:8080");
});
