import { NextApiRequest, NextApiResponse } from 'next'
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";
export const config = {
    api: {
        bodyParser: false,
    },
};
const SocketHandler = (req: NextApiRequest, res: NextApiResponse) => {
    if (!res.socket.server.io) {
        console.log("New Socket.io server...");
        // adapt Next's net Server to http Server
        const httpServer: NetServer = res.socket.server as any;
        const io = new ServerIO(httpServer);

        console.log('Socket is initialized')
        io.on('connection', socket => {

        })
        // append SocketIO server to Next.js socket server response
        res.socket.server.io = io;
    }
    res.end();
}

export default SocketHandler