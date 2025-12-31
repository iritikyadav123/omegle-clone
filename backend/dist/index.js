import express from 'express';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';
import http from "http";
const app = express();
const server = http.createServer(http);
const io = new Server(app);
io.on('connection', (sokcer) => {
    console.log('a user connected');
});
server.listen(3000, () => {
    console.log('listening on *: 30000');
});
//# sourceMappingURL=index.js.map