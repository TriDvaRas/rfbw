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
    .get(async (req, res: NextApiResponse<GameTask[] | ApiError | null>) => {
        try {
            const tasks = await GameTask.findAll({
                where: {
                    gameId: req.query.gameId,
                    playerId: req.query.playerId
                }
            })
            
            if (tasks)
                res.json(tasks)
            else
                res.status(404).json({ error: 'А где', status: 404 })
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .handler(commonErrorHandlers)