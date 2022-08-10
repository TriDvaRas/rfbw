import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth/next'
import { createRouter } from 'next-connect'
import { Game, Wheel, GamePlayer, GameTask, WheelItem, GameEvent, GamePlayerWithPlayer } from '../../../../../../../database/db';
import adminOnly from '../../../../../../../middleware/adminOnly';
import commonErrorHandlers from '../../../../../../../middleware/commonErrorHandlers'
import requireApiSession from '../../../../../../../middleware/requireApiSession'
import requirePlayer from '../../../../../../../middleware/requirePlayer'
import { ApiError } from '../../../../../../../types/common-api'
import { authOptions } from "../../../../../auth/[...nextauth]"
import { GameTaskEndResult } from '../../../../../../../types/game';
import { afterAnyEndCleanup } from '../../../../../../../util/dbUtil';
import requireActiveGame from '../../../../../../../middleware/requireActiveGame';



const router = createRouter<NextApiRequest, NextApiResponse>();

export default router
    .use(requireApiSession)
    .use(adminOnly)
    .post(async (req, res: NextApiResponse<GameTaskEndResult | ApiError | null>) => {
        try {
            const { amount, reason } = req.body
            const player = await GamePlayerWithPlayer.findOne({
                where: {
                    gameId: req.query.gameId,
                    playerId: req.query.playerId,
                }
            })
            if (!player)
                return res.status(404).json({ error: `Invalid Player`, status: 404 })
            if (!amount)
                return res.status(400).json({ error: `Invalid Amount`, status: 400 })
            if (!reason)
                return res.status(400).json({ error: `Invalid Reason`, status: 400 })

            player.points += amount
            await player.save()
            await GameEvent.create({
                gameId: req.query.gameId,
                playerId: req.query.playerId,
                pointsDelta: amount,
                type: amount > 0 ? 'adminPointsAdd' : 'adminPointsRemove',
                vars: {
                    by: req.session.user.name,
                    byId: req.session.user.id,
                    reason
                }
            })
            res.send({
                success: true
            })

        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .handler(commonErrorHandlers)