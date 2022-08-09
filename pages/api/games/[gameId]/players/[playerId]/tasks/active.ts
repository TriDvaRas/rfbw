import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth/next'
import { createRouter } from 'next-connect'
import { Game, Wheel, GamePlayer, GameTask } from '../../../../../../../database/db';
import adminOnly from '../../../../../../../middleware/adminOnly';
import commonErrorHandlers from '../../../../../../../middleware/commonErrorHandlers'
import requireApiSession from '../../../../../../../middleware/requireApiSession'
import requirePlayer from '../../../../../../../middleware/requirePlayer'
import { ApiError } from '../../../../../../../types/common-api'
import { authOptions } from "../../../../../auth/[...nextauth]"



const router = createRouter<NextApiRequest, NextApiResponse>();

export default router
    .get(async (req, res: NextApiResponse<GameTask | 'none' | ApiError | null>) => {
        try {
            const playerActiveTask = await GameTask.findOne({
                where: {
                    gameId: req.query.gameId,
                    playerId: req.query.playerId,
                    result: null
                },
                order: [['fromCoop', 'DESC'],['createdAt', 'DESC']]
            })
            if (playerActiveTask)
                res.json(playerActiveTask)
            else
                res.send('none')
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .handler(commonErrorHandlers)