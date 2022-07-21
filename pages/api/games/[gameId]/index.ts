import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth/next'
import { createRouter } from 'next-connect'
import { Game, Wheel } from '../../../../database/db'
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
    .use(requirePlayer)
    .patch(async (req, res) => {
        try {
            const wheel = await Game.findOne({
                where: {
                    id: req.query.gameId
                }
            })
            if (!wheel)
                return res.status(404).json({ error: 'А где', status: 404 })
            wheel.name = req.body.name === undefined ? wheel.name : req.body.name
            wheel.imageId = req.body.imageId === undefined ? wheel.imageId : req.body.imageId
            await wheel.save()
            res.json(wheel)
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .handler(commonErrorHandlers)