import express, { Request, Response } from "express";
import { WebSocket, WebSocketServer } from "ws";
import cors  from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 5000;
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";


const corsOptions = {
  origin: frontendUrl,
  methods: ["GET", "POST"],
};

app.use(cors(corsOptions));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello TypeScript!");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const socketServer = new WebSocketServer({port: 8080});
let currentClient: WebSocket | null = null;

socketServer.on("connection", (ws: WebSocket) => {
  currentClient = ws;
  console.log("Client connected");
  
  ws.on("message", (message) => {
    console.log(`Received: ${message}`);
    ws.send(`Echo: ${message}`);
  });

  ws.on("pong", () => {
    console.log("pong received from cleint, heartbeart heart💓")
  })

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

setInterval(() => {
  socketServer.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send("ping");
    }
  });
}, 3000);