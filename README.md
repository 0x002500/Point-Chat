# Point-Chat

Point-Chat is a real-time chat application that uses Server-Sent Events (SSE) for live message updates and a basic HTTP server for handling chat messages. This project creates a simple chat application with live updates, implemented in Node.js.

## Features

- **Private**: The server only broadcasts the message to other clients without saving messages or logs.
- **Lightweight**: No additional dependencies, just simple HTML/CSS/JS.
- **Edge Friendly**: Feel free to deploy it on edge platforms. (WIP on Cloudflare Workers)
- **Secure**: End-to-End encryption (WIP).

## Project Structure

- **Backend**: Implemented using Node.js with the `http` and `events` modules.
- **Frontend**: Simple HTML/CSS/JavaScript interface for interacting with the chat server.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/point-chat.git
   cd point-chat
   ```

2. **Install Dependencies**:
   This project does not have any additional dependencies, but ensure you have Node.js installed.

### Running the Server

1. **Start the Backend Server**:
   ```bash
   node server.js
   ```
   The server will start on `http://localhost:8080`.

2. **Open the Frontend**:
   Open the `index.html` file in your web browser.

### Usage

1. **Enter Username**: Type your username into the input field.
2. **Type a Message**: Write your message in the text area.
3. **Send Message**: Click the "Send Message" button or press Enter to send the message.

Messages will be displayed in real-time in the message area.

## Contributing
Feel free to open an issue or a Pull Request. I will check them when I'm free.

## License
This application is under the [MIT License](https://github.com/0x002500/Point-Chat/blob/main/LICENSE).
