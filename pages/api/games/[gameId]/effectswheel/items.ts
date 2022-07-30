import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth/next'
import { createRouter } from 'next-connect'
import { Game, Wheel, GamePlayer, GameWheel, GameEffect, Effect, GameEffectWithEffect } from '../../../../../database/db';
import adminOnly from '../../../../../middleware/adminOnly';
import commonErrorHandlers from '../../../../../middleware/commonErrorHandlers'
import requireApiSession from '../../../../../middleware/requireApiSession'
import requirePlayer from '../../../../../middleware/requirePlayer'
import { ApiError } from '../../../../../types/common-api'
import { authOptions } from "../../../auth/[...nextauth]"
import { Op } from 'sequelize';



const router = createRouter<NextApiRequest, NextApiResponse>();

export default router
    .get(async (req, res: NextApiResponse<GameEffect[] | ApiError | null>) => {
        try {
            const dEffects = await Effect.findAll({
                where: {
                    isDefault: true,
                }
            })
            const gameWheels = await GameEffect.findAll({
                where: {
                    gameId: req.query.gameId,
                    isEnabled: true,
                    effectId: {
                        [Op.notIn]: dEffects.map(x => x.id)
                    }
                },
                include: Effect
            }) as GameEffectWithEffect[]
            if (gameWheels)
                res.json(gameWheels)
            else
                res.status(404).json({ error: 'А где', status: 404 })
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .use(requireApiSession)
    .use(adminOnly)
    .post(async (req, res: NextApiResponse<GameEffect | ApiError | null>) => {
        try {
            const body: {
                gameId: string
                effectId: string
            } = req.body
            const gameEffect = await GameEffect.create({
                gameId: body.gameId,
                effectId: body.effectId,
                cooldown: 0,
                shuffleValue: 0,
                isEnabled: true,
            })
            res.json(gameEffect)
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .handler(commonErrorHandlers)