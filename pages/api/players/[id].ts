import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth/next'
import { createRouter } from 'next-connect'
import { Player } from '../../../database/db'
import commonErrorHandlers from '../../../middleware/commonErrorHandlers'
import requireApiSession from '../../../middleware/requireApiSession'
import requirePlayer from '../../../middleware/requirePlayer'
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
    .use(requireApiSession)
    .use(requirePlayer)
    .patch(async (req, res) => {
        if (req.session.user.id !== req.query.id && !req.session.user.isAdmin)
            return res.status(403).json({ error: 'Ага блять нет', status: 403 })
        try {
            const player = await Player.findOne({
                where: {
                    id: req.query.id
                }
            })
            if (!player)
                return res.status(404).json({ error: 'А где', status: 404 })
            player.about = req.body.about || player.about
            player.name = req.body.name || player.name
            player.imageId = req.body.imageId || player.imageId
            await player.save()
            res.json(player)
        } catch (error: any) {
            res.status(500).send({ error: error.message, status: 500 })
        }
    })
    .handler(commonErrorHandlers)