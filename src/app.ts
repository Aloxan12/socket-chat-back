import express from 'express';
import http from 'http'
import socketio, {Socket} from 'socket.io'


const app = express();
const server = http.createServer(app);
// @ts-ignore
const io = socketio(server)

app.get('/', (req, res) => {
    res.send('<h1>Hello Vika</h1>');
});

io.on('connection', (socket: Socket)=>{
    console.log('a user connected')
})

server.listen(3009, () => {
    console.log('listening on *:3009');
});
