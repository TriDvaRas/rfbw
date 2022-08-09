import { includes } from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth/next'
import { createRouter } from 'next-connect'
import { GameTaskWithWheelItem, WheelItem, GamePlayerWithPlayer, GameEffectState, GameEffectStateWithEffectWithPlayer, Effect, Player, GameTask, GameEvent } from '../../../../../../database/db';
import commonErrorHandlers from '../../../../../../middleware/commonErrorHandlers';
import { ApiError } from '../../../../../../types/common-api';
import { EffectStateQuestionVars } from '../../../../../../types/effectStateVars';
import { Op } from 'sequelize';
import requireApiSession from '../../../../../../middleware/requireApiSession';
import requirePlayer from '../../../../../../middleware/requirePlayer';




const router = createRouter<NextApiRequest, NextApiResponse>();

export default router
    .use(requireApiSession)
    .use(requirePlayer)
    .post(async (req, res: NextApiResponse<GameTask | ApiError | null>) => {
        try {
            const effectState = await GameEffectStateWithEffectWithPlayer<EffectStateQuestionVars>.findOne({
                where: {
                    gameId: req.query.gameId,
                    playerId: req.session.user.id,
                    id: req.body.effectState.id,
                },
                include: [Effect, Player]
            })
            if (!effectState)
                return res.status(400).json({ error: `Invalid EffectState`, status: 400 })
            if (effectState.vars.task?.id !== req.query.parentId)
                return res.status(400).json({ error: `Invalid ParentId`, status: 400 })

            const parentTask = await GameTaskWithWheelItem.findOne({
                where: {
                    id: req.query.parentId
                },
                include: WheelItem
            })
            if (!parentTask)
                return res.status(400).json({ error: `Invalid ParentTask`, status: 400 })
            const task = await GameTask.create({
                gameId: req.query.gameId,
                playerId: effectState.playerId,
                wheelItemId: parentTask.wheelItemId,
                fromCoop: true,
                coopParentId: req.query.parentId
            })
            effectState.isEnded = true
            effectState.vars = { ...effectState.vars, accepted: true }
            await effectState.save()
            await GameEvent.create({
                gameId: req.query.gameId,
                playerId: effectState.playerId,
                imageId: parentTask.wheelitem.imageId,
                taskId: parentTask.id,
                type: 'contentJoinCoop',
            })
            res.json(task)
            res.socket.server.io?.emit('mutate', [
                `^/api/games/${req.query.gameId}/coops/${parentTask.id}`,
                `^/api/games/${req.query.gameId}/events`,
                `^/api/tasks/${parentTask.id}`,
                `^/api/players/${req.session.user.id}`,
            ])
        } catch (error: any) {
            console.error(error)
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .handler(commonErrorHandlers)