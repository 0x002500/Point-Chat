const http = require("http");
const events = require("events");

// Create an EventEmitter instance to handle custom events
const emitter = new events.EventEmitter();

// Function to set CORS headers on the response
function setCORSHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "*");
}

// Handle GET requests to /messageChannel
function handleMessageChannel(req, res) {
  // Set headers for Server-Sent Events (SSE)
  res.writeHead(200, {
    "Content-Type": "text/event-stream", // Content type for SSE
    "Cache-Control": "no-cache", // Disable caching
    "Connection": "keep-alive", // Keep the connection open
  });

  // Define a listener to send new messages to the client
  const messageListener = (userName, message) => {
    const formattedMessage = `data: ${userName}: ${message}\n\n`;
    res.write(formattedMessage); // Send the formatted message
  };

  // Register the listener
  emitter.on("newMessage", messageListener);

  // Remove the listener when the client closes the connection
  req.on("close", () => {
    emitter.removeListener("newMessage", messageListener);
  });
}

// Handle POST requests to /sendMessage
function handleSendMessage(req, res) {
  let body = "";

  // Collect chunks of data from the request body
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  // Process data when fully received
  req.on("end", () => {
    try {
      const { user, message } = JSON.parse(body);

      if (!user || !message) {
        throw new Error("Missing user or message");
      }

      // Emit 'newMessage' event to broadcast to all clients
      emitter.emit("newMessage", user, message);

      // Respond to the client
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "Message sent to all clients" }));
    } catch (error) {
      // Handle errors, such as invalid JSON
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ status: "Invalid JSON data", error: error.message }),
      );
    }
  });
}

// Create and configure the HTTP server
const server = http.createServer((req, res) => {
  // Set CORS headers for every request
  setCORSHeaders(res);

  // Handle OPTIONS requests for CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // Route requests based on method and URL
  if (req.method === "GET" && req.url === "/messageChannel") {
    handleMessageChannel(req, res);
  } else if (req.method === "POST" && req.url === "/sendMessage") {
    handleSendMessage(req, res);
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
