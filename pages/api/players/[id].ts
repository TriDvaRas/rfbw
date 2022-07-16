import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth/next'
import { createRouter } from 'next-connect'
import { Player } from '../../../database/db'
import commonErrorHandlers from '../../../middleware/commonErrorHandlers'
import requireApiSession from '../../../middleware/requireApiSession'
import { ApiError } from '../../../types/common-api'
import { authOptions } from "../auth/[...nextauth]"



const router = createRouter<NextApiRequest, NextApiResponse<Player | ApiError | null>>();

export default router
    .get(async (req, res) => {
        try {
            const player = await Player.findOne({
                where: {
                    id: req.query.id
                }
            })
            if (player)
                res.json(player)
            else
                res.status(404).json({ error: 'А где', status: 404 })
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .handler(commonErrorHandlers)