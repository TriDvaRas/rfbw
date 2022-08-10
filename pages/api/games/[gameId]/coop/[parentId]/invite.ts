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
import requireActiveGame from '../../../../../../middleware/requireActiveGame';




const router = createRouter<NextApiRequest, NextApiResponse>();

export default router
    .use(requireApiSession)
    .use(requirePlayer)
    .use(requireActiveGame)
    .post(async (req, res: NextApiResponse<GamePlayerWithPlayer | ApiError | null>) => {
        try {
            const invites = await GameEffectStateWithEffectWithPlayer<EffectStateQuestionVars>.findAll({
                where: {
                    gameId: req.query.gameId,
                },
                include: [{
                    model: Effect,
                    required: true,
                    where: {
                        lid: 99
                    }
                }, Player]
            }) as GameEffectStateWithEffectWithPlayer<EffectStateQuestionVars>[]
            const activeInvites = invites.filter(x => !x.isEnded).filter(x => x.vars?.inviteParentTaskId == req.query.parentId)
            let currInvite = activeInvites.find(x => x.playerId == req.body.playerId)
            if (currInvite)
                return res.status(400).json({ error: `${currInvite.player.name} уже приглашен`, status: 400 })
            const allInvites = invites.filter(x => !x.isEnded).filter(x => x.vars?.inviteParentTaskId == req.query.parentId)
            if (allInvites.filter(x => x.playerId == req.body.playerId).length > 2)
                return res.status(400).json({ error: `Хватит. Заебал.`, status: 400 })
            const acceptedInvite = invites.find(x => x.playerId == req.body.playerId && x.vars.inviteParentTaskId == req.query.parentId && x.vars.accepted)
            if (acceptedInvite)
                return res.status(400).json({ error: `${acceptedInvite.player.name} уже покинул этот кооп. Читай правила`, status: 400 })
            // const parentTask = await GameTask.findOne({
            //     where: {
            //         id: req.query.parentId
            //     }
            // })
            // if (!parentTask)
            //     return res.status(400).json({ error: `Invalid ParentTask`, status: 400 })

            const agressorPlayer = await GamePlayerWithPlayer.findOne({
                where: {
                    gameId: req.query.gameId,
                    playerId: req.session.user.id
                },
                include: Player
            })
            if (!agressorPlayer)
                return res.status(400).json({ error: `Invalid AgressorPlayer`, status: 400 })
            const targetPlayer = await GamePlayerWithPlayer.findOne({
                where: {
                    gameId: req.query.gameId,
                    playerId: req.body.playerId
                },
                include: Player
            })
            if (!targetPlayer)
                return res.status(400).json({ error: `Invalid TargetPlayer`, status: 400 })
            const task = await GameTaskWithWheelItem.findOne({ where: { id: req.query.parentId }, include: WheelItem })
            if (!task)
                return res.status(400).json({ error: `Invalid ParentTask`, status: 400 })
            const oldTargetTask = await GameTask.findOne({
                where: {
                    gameId: req.query.gameId,
                    playerId: req.body.playerId,
                    wheelItemId: task.wheelItemId,
                }
            })
            if (oldTargetTask && oldTargetTask.result)
                return res.status(400).json({ error: `${targetPlayer.player.name} уже закочил этот контент`, status: 400 })

            await GameEffectStateWithEffectWithPlayer<EffectStateQuestionVars>.create({
                gameId: req.query.gameId,
                playerId: targetPlayer.playerId,
                effectId: 'b4618fdc-e53a-4e16-88fe-157ce519f2c1',//99
                vars: {
                    question: `${agressorPlayer.player.name} приглашает вступить в Групповой Кооператив`,
                    task,
                    inviteParentTaskId: task.id
                }
            }, { include: [Effect, Player] })

            res.json(targetPlayer)
            res.socket.server.io?.emit('mutate', [
                `^/api/games/${req.query.gameId}/players/${targetPlayer.playerId}/tasks`,
                `^/api/games/${req.query.gameId}/players/${targetPlayer.playerId}/effects`,
                `^/api/games/${req.query.gameId}/events`,
                `^/api/tasks/${task.id}`,
                `^/api/players/${req.session.user.id}`,
            ])
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .handler(commonErrorHandlers)