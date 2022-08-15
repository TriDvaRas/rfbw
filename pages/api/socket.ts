import { NextApiRequest, NextApiResponse } from 'next'
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";
import { Effect, GameEffectStateWithEffectWithPlayer, GameEvent, Player } from '../../database/db';
import { schedule } from 'node-cron';
export const config = {
    api: {
        bodyParser: false,
    },
};
schedule(`0 0 * * *`, async () => {
    const effects = await GameEffectStateWithEffectWithPlayer<any>.findAll({
        where: {
            effectId: `385f9834-6205-4f38-a2bc-28f142a9b2b1`,
            isEnded: false
        },
        include: [Player, Effect]
    })
    for (const e of effects) {
        e.isEnded = true
        await GameEvent.create({
            gameId: e.gameId,
            playerId: e.playerId,
            effectId: e.effectId,
            imageId: e.effect.imageId,
            type: 'effectLost',
        })
        await e.save()
    }

}, {
    timezone: 'Europe/Kyiv',
})

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