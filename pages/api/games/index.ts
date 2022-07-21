import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth/next'
import { createRouter } from 'next-connect'
import { Game, Wheel, WheelItem } from '../../../database/db';
import adminOnly from '../../../middleware/adminOnly';
import commonErrorHandlers from '../../../middleware/commonErrorHandlers'
import requireApiSession from '../../../middleware/requireApiSession'
import requirePlayer from '../../../middleware/requirePlayer'
import { ApiError } from '../../../types/common-api'
import { authOptions } from "../auth/[...nextauth]"



const router = createRouter<NextApiRequest, NextApiResponse>();

export default router
    .get(async (req, res: NextApiResponse<Game[] | ApiError | null>) => {
        try {
            const games = await Game.findAll()
            res.json(games)
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .use(requireApiSession)
    .use(adminOnly)
    .post(async (req, res: NextApiResponse<Game | ApiError | null>) => {
        try {
            const game = await Game.create({
                addedById: req.session.user.id,
                name: req.body.name,
                imageId: req.body.imageId,
                startsAt: req.body.startsAt,
                endsAt: req.body.endsAt,
            })
            res.json(game)
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .handler(commonErrorHandlers)