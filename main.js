const http = require("http");
const events = require("events");

const emitter = new events.EventEmitter();

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Request-Method", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET",
    "OPTIONS, POST",
  );
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "GET" && req.url === "/messageChannel") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    });

    emitter.on("newMessage", (userName, message) => {
      res.write(`${userName}: ${message}`);
    });
  } else if (req.method === "POST" && req.url === "/sendMessage") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const json = JSON.parse(body);
      const user = json.user;
      const message = json.message;
      emitter.emit("newMessage", user, message);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "Message sent to all clients" }));
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(8080, () => {
  console.log("Point-Chat backend running on http://0.0.0.0:8080");
});
