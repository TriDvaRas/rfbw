import { includes } from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth/next'
import { createRouter } from 'next-connect'
import { GameTaskWithWheelItem, WheelItem, GamePlayerWithPlayer, GameEffectState, GameEffectStateWithEffectWithPlayer, Effect, Player, GameTask } from '../../../../../../database/db';
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
    .post(async (req, res: NextApiResponse<{ success: boolean } | ApiError | null>) => {
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
            const parentTask = await GameTask.findOne({
                where: {
                    id: req.query.parentId
                }
            })
            if (!parentTask)
                return res.status(400).json({ error: `Invalid ParentTask`, status: 400 })
            effectState.isEnded = true
            effectState.vars = { ...effectState.vars, rejected: true }
            await effectState.save()
            res.json({ success: true })
            res.socket.server.io?.emit('mutate', [
                `^/api/games/${req.query.gameId}/coops/${parentTask.id}`,
                `^/api/games/${req.query.gameId}/events`,
            ])
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .handler(commonErrorHandlers)