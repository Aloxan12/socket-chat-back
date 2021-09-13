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
const PORT = process.env.PORT || 3900;

app.use(cors())
app.get('/', ((req, res) => {
    res.send('Hello vik')
}))


const messages = [
    {message: 'Hello, Vika', id: v1(), user: {id: v1(), name: 'Alex'}},
    {message: 'Hello, Alex', id: v1(), user: {id: v1(), name: 'Viktoria'}}
]

io.on("connection", (socketChannel) => {
    console.log('user a connected')
    socketChannel.on('client-message-send', (message: string)=>{
        console.log(message)
    })
    socketChannel.emit('init-messages-published', messages)
});

httpServer.listen(PORT,()=>{
    console.log(`Port con *:${PORT}`)
});
