import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth/next'
import { createRouter } from 'next-connect'

import { Effect, GameEffectStateWithEffectWithPlayer, GameEvent, GamePlayer, GameTask, GameTaskWithWheelItem, Player, WheelItem } from '../../../../../../database/db';
import commonErrorHandlers from '../../../../../../middleware/commonErrorHandlers';
import requireApiSession from '../../../../../../middleware/requireApiSession';
import requirePlayer from '../../../../../../middleware/requirePlayer';
import { ApiError } from '../../../../../../types/common-api';
import { GameTaskEndResult } from '../../../../../../types/game';



const router = createRouter<NextApiRequest, NextApiResponse>();

export default router
    .use(requireApiSession)
    .use(requirePlayer)
    .post(async (req, res: NextApiResponse<GameTaskEndResult | ApiError | null>) => {
        try {
            const playerActiveTask = await GameTask.findOne({
                where: {
                    gameId: req.query.gameId,
                    playerId: req.session.user.id,
                    result: null,
                    coopParentId: req.query.parentId
                },
                order: [['fromCoop', 'DESC'], ['createdAt', 'DESC']]
            })
            const parentTask = await GameTaskWithWheelItem.findOne({ where: { id: req.query.parentId }, include: WheelItem })
            if (!parentTask)
                return res.status(404).json({ error: 'А где parentTask', status: 404 })
            if (!playerActiveTask)
                return res.status(404).json({ error: 'А где playerActiveTask', status: 404 })
            if (parentTask.wheelItemId !== req.body.wheelItemId)
                return res.status(400).json({ error: 'Invalid active task', status: 400 })
            const gamePlayer = await GamePlayer.findOne({
                where: {
                    gameId: req.query.gameId,
                    playerId: req.session.user.id,
                }
            })
            if (!gamePlayer)
                return res.status(404).json({ error: 'А где GamePLayer', status: 404 })
            await playerActiveTask.destroy()

            await GameEvent.create({
                gameId: gamePlayer.gameId,
                playerId: gamePlayer.playerId,
                imageId: parentTask.wheelitem.imageId,
                taskId: parentTask.id,
                type: 'contentLeaveCoop',
            })
            res.send({
                success: true
            })


        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .handler(commonErrorHandlers)