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

const usersState = new Map();

io.on("connection", (socketChannel) => {

    usersState.set(socketChannel, {id: v1(), name: 'Anonym'})

    io.on('disconnect', ()=>{
        usersState.delete(socketChannel);
    })

    socketChannel.on('client-name-sent', (name:string)=>{
        if(typeof name !== 'string'){
            return
        }
        const user = usersState.get(socketChannel)
        user.name = name;
    })

    socketChannel.on('client-typed', ()=>{
        io.emit('user-typing', usersState.get(socketChannel))
    });

    socketChannel.on('client-message-sent', (message: string)=>{
        if(typeof message !== 'string'){
            return
        }

        const user = usersState.get(socketChannel)

        let messageItem = {message: message, id: v1(), user: {id: user.id, name: user.name}}
        messages.push(messageItem)

        io.emit('new-message-sent', messageItem)
    })
    socketChannel.emit('init-messages-published', messages)

    console.log('user a connected')
});

httpServer.listen(PORT,()=>{
    console.log(`Port con *:${PORT}`)
});
