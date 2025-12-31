import express from 'express';
import {Server} from 'socket.io'
import { Socket } from 'socket.io';
import http from "http";

const app = express()
const server = http.createServer(http);

const io = new Server(server);

io.on('connection', (sokcer: Socket) => {
    console.log('a user connected');
})

server.listen(3000, () => {
    console.log('listening on *: 30000');
})