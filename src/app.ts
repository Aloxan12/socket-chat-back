import cors from 'cors';
import express from 'express'
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import {v1} from "uuid";


const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
});
const PORT = process.env.PORT || 3500;

app.use(cors())
app.get('/', ((req, res) => {
    res.send('Hello vik')
}))


const messages = [
    {message: 'Hello, Vika', id: v1(), user: {id: v1(), name: 'Alex'}},
    {message: 'Hello, Alex', id: v1(), user: {id: v1(), name: 'Viktoria'}}
]

io.on("connection", (socketChannel) => {

    socketChannel.on('client message sent', (message: string)=>{
        let messageItem = {message: message, id: v1(), user: {id: v1(), name: 'Alex'}}
        messages.push(messageItem)

        io.emit('new-message-sent', messageItem)
    })
    socketChannel.emit('init-messages-published', messages)

    console.log('user a connected')
});

httpServer.listen(PORT,()=>{
    console.log(`Port con *:${PORT}`)
});
