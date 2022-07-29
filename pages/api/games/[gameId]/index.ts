import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth/next'
import { createRouter } from 'next-connect'
import { Game, Wheel } from '../../../../database/db'
import adminOnly from '../../../../middleware/adminOnly'
import commonErrorHandlers from '../../../../middleware/commonErrorHandlers'
import requireApiSession from '../../../../middleware/requireApiSession'
import requirePlayer from '../../../../middleware/requirePlayer'
import { ApiError } from '../../../../types/common-api'
import { authOptions } from "../../auth/[...nextauth]"



const router = createRouter<NextApiRequest, NextApiResponse<Game | ApiError | null>>();

export default router
    .get(async (req, res) => {
        try {
            const game = await Game.findOne({
                where: {
                    id: req.query.gameId
                }
            })
            if (game)
                res.json(game)
            else
                res.status(404).json({ error: 'А где', status: 404 })
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .use(requireApiSession)
    .use(adminOnly)
    .patch(async (req, res) => {
        try {
            const game = await Game.findOne({
                where: {
                    id: req.query.gameId
                }
            })
            if (!game)
                return res.status(404).json({ error: 'А где', status: 404 })
            game.name = req.body.name === undefined ? game.name : req.body.name
            game.imageId = req.body.imageId === undefined ? game.imageId : req.body.imageId
            game.startsAt = req.body.startsAt === undefined ? game.startsAt : req.body.startsAt
            game.endsAt = req.body.endsAt === undefined ? game.endsAt : req.body.endsAt
            await game.save()
            res.json(game)
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .handler(commonErrorHandlers)