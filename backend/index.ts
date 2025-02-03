import express from "express";
import cors from "cors";
import { Server } from "socket.io";

const messages = [];

const app = express();
app.use(cors());
app.use(express.json());

app.get("/messages", (req, res) => {
   return res.json(messages);
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
