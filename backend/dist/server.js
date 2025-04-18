"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 5000;
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
const corsOptions = {
    origin: frontendUrl,
    methods: ["GET", "POST"],
};
app.use((0, cors_1.default)(corsOptions));
app.get("/", (req, res) => {
    res.send("Hello TypeScript!");
});
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
const socketServer = new ws_1.WebSocketServer({ port: 8080 });
let currentClient = null;
socketServer.on("connection", (ws) => {
    currentClient = ws;
    console.log("Client connected");
    ws.on("message", (message) => {
        console.log(`Received: ${message}`);
        ws.send(`Echo: ${message}`);
    });
    ws.on("pong", () => {
        console.log("pong received from cleint, heartbeart heart💓");
    });
    ws.on("close", () => {
        console.log("Client disconnected");
    });
});
setInterval(() => {
    socketServer.clients.forEach((client) => {
        if (client.readyState === ws_1.WebSocket.OPEN) {
            client.send("ping");
        }
    });
}, 3000);
