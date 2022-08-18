import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth/next'
import { createRouter } from 'next-connect'
import { Effect, Game, GameEffectStateWithEffectWithPlayer, GameEvent, Player, Wheel } from '../../../database/db'
import adminOnly from '../../../middleware/adminOnly'
import commonErrorHandlers from '../../../middleware/commonErrorHandlers'
import requireApiSession from '../../../middleware/requireApiSession'
import requirePlayer from '../../../middleware/requirePlayer'
import { ApiError } from '../../../types/common-api'
import { authOptions } from "../auth/[...nextauth]"



const router = createRouter<NextApiRequest, NextApiResponse<Game | ApiError | null>>();

export default router
    .use(requireApiSession)
    .use(adminOnly)
    .get(async (req, res) => {
        try {
            const effects = await GameEffectStateWithEffectWithPlayer<any>.findAll({
                where: {
                    effectId: `385f9834-6205-4f38-a2bc-28f142a9b2b1`,
                    isEnded: false
                },
                include: [Player, Effect]
            })
            for (const e of effects) {
                e.isEnded = true
                await GameEvent.create({
                    gameId: e.gameId,
                    playerId: e.playerId,
                    effectId: e.effectId,
                    imageId: e.effect.imageId,
                    type: 'effectLost',
                })
                await e.save()
            }
            res.send('succ')
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .handler(commonErrorHandlers)