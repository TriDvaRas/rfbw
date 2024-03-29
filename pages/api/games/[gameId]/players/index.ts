import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth/next'
import { createRouter } from 'next-connect'
import { Game, Wheel, GamePlayer, GamePlayerWithPlayer, Player } from '../../../../../database/db';
import adminOnly from '../../../../../middleware/adminOnly';
import commonErrorHandlers from '../../../../../middleware/commonErrorHandlers'
import requireApiSession from '../../../../../middleware/requireApiSession'
import requirePlayer from '../../../../../middleware/requirePlayer'
import { ApiError } from '../../../../../types/common-api'
import { authOptions } from "../../../auth/[...nextauth]"



const router = createRouter<NextApiRequest, NextApiResponse>();

export default router
    .get(async (req, res: NextApiResponse<GamePlayerWithPlayer[] | ApiError | null>) => {
        try {
            const players = await GamePlayerWithPlayer.findAll({
                where: {
                    gameId: req.query.gameId
                },
                include: Player
            })
            if (players)
                res.json(players)
            else
                res.status(404).json({ error: 'А где', status: 404 })
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .use(requireApiSession)
    .use(adminOnly)
    .post(async (req, res: NextApiResponse<GamePlayerWithPlayer | ApiError | null>) => {
        try {
            const body: {
                gameId: string
                playerId: string
            } = req.body
            const gamePlayer = await GamePlayerWithPlayer.create({
                gameId: body.gameId,
                playerId: body.playerId,
                addedById: req.session.user.id
            }, { include: Player })
            res.json(gamePlayer)
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .handler(commonErrorHandlers)