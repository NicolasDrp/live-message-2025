import express from "express";
import cors from "cors";
import webpush from "web-push";
import dotenv from "dotenv";
import { Server } from "socket.io";

dotenv.config();

webpush.setVapidDetails(
    'mailto:hello@rdelbaere.fr',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

const messages = [];
const subscriptions = [];

const app = express();
app.use(cors());
app.use(express.json());

app.get("/messages", (req, res) => {
   return res.json(messages);
});

app.get("/push/key", (req, res) => {
   return res.json({
      pubkey: process.env.VAPID_PUBLIC_KEY,
   });
});

app.post("/push/sub", (req, res) => {
    if (subscriptions.indexOf(req.body) < 0) {
        console.log(req.body);
        subscriptions.push(req.body);
    }

    return res.json({});
});

app.listen(4000);

const socketServer = new Server({
   cors: {
       origin: '*',
   },
});

socketServer.on('connection', socket => {
    socket.on('originMessage', payload => {
        messages.push(payload);
        socket.broadcast.emit('forwardMessage', payload);
    });
});

socketServer.listen(3000);
