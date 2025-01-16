import { Server } from "socket.io";

const socketServer = new Server({
   cors: {
       origin: '*',
   },
});

socketServer.on('connection', socket => {
    socket.on('originMessage', payload => {
        socket.broadcast.emit('forwardMessage', payload);
    });
});

socketServer.listen(3000);
