import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth/next'
import { createRouter } from 'next-connect'
import { Player, Wheel } from '../../../database/db';
import commonErrorHandlers from '../../../middleware/commonErrorHandlers'
import requireApiSession from '../../../middleware/requireApiSession'
import { ApiError } from '../../../types/common-api'
import { authOptions } from "../auth/[...nextauth]"



const router = createRouter<NextApiRequest, NextApiResponse<Wheel[] | ApiError | null>>();

export default router
    .use(requireApiSession)
    .get(async (req, res) => {
        if (!req.session.user.isPlayer)
            res.status(433).json({ error: 'Ты не игрок', status: 433 })
        else
            try {
                const wheels = await Wheel.findAll(req.session.user.isAdmin ? {} : {
                    where: {
                        ownedById: req.session.user.id
                    }
                })
                if (wheels)
                    res.json(wheels)
                else
                    res.status(404).json({ error: 'А где', status: 404 })
            } catch (error: any) {
                res.status(500).json({ error: error.message, status: 500 })
            }
    })
    .handler(commonErrorHandlers)