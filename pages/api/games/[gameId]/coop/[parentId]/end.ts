import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth/next'
import { createRouter } from 'next-connect'

import { Effect, GameEffectStateWithEffectWithPlayer, GameEvent, GamePlayer, GameTask, GameTaskWithWheelItem, Player, WheelItem, GameTaskWithPlayer, GameEffectState } from '../../../../../../database/db';
import commonErrorHandlers from '../../../../../../middleware/commonErrorHandlers';
import requireActiveGame from '../../../../../../middleware/requireActiveGame';
import requireApiSession from '../../../../../../middleware/requireApiSession';
import requirePlayer from '../../../../../../middleware/requirePlayer';
import { ApiError } from '../../../../../../types/common-api';
import { EffectStateQuestionVars } from '../../../../../../types/effectStateVars';
import { GameTaskEndResult } from '../../../../../../types/game';
import { afterAnyEndCleanup } from '../../../../../../util/dbUtil';



const router = createRouter<NextApiRequest, NextApiResponse>();

export default router
    .use(requireApiSession)
    .use(requirePlayer)
    .use(requireActiveGame)
    .post(async (req, res: NextApiResponse<GameTaskEndResult | ApiError | null>) => {
        try {
            const body = req.body as {
                wheelItemId: string
                finishedChildrenIds: string[]
            }
            const parentTask = await GameTaskWithWheelItem.findOne({ where: { id: req.query.parentId }, include: WheelItem })
            if (!parentTask)
                return res.status(404).json({ error: 'А где parentTask', status: 404 })
            const childTasks = await GameTaskWithPlayer.findAll({
                where: {
                    gameId: req.query.gameId,
                    result: null,
                    coopParentId: req.query.parentId
                },
                include: Player,
                order: [['fromCoop', 'DESC'], ['createdAt', 'DESC']]
            })
            if (childTasks.length == 0)
                return res.status(404).json({ error: 'А где childTasks', status: 404 })
            if (parentTask.wheelItemId !== req.body.wheelItemId)
                return res.status(400).json({ error: 'Invalid active task', status: 400 })

            const finishedChildren = childTasks.filter(x => body.finishedChildrenIds.includes(x.id))
            const unfinishedChildren = childTasks.filter(x => !body.finishedChildrenIds.includes(x.id))
            let ptsMult = parentTask.wheelitem.wheelId === '5a698d76-5676-4f2e-934e-c98791ad58ca' ? (finishedChildren.length + 1) / parentTask.wheelitem.maxCoopPlayers : 1
            for (const child of finishedChildren) {
                const gamePlayer = await GamePlayer.findOne({
                    where: {
                        gameId: child.gameId,
                        playerId: child.playerId,
                    }
                })
                if (!gamePlayer)
                    return res.status(404).json({ error: 'А где GamePLayer', status: 404 })
                const item = parentTask.wheelitem
                if (!item)
                    return res.status(404).json({ error: 'А где WheelItem', status: 404 })
                gamePlayer.ended += 1
                gamePlayer.points += Math.round(item.hours * 10 * ptsMult)
                child.result = 'finish'
                child.points = Math.round(item.hours * 10 * ptsMult)
                child.endedAt = new Date().toISOString()
                await child.save()
                await gamePlayer.save()
                await GameEffectState.create({
                    gameId: gamePlayer.gameId,
                    playerId: gamePlayer.playerId,
                    effectId: '7c44ff0a-517c-49c2-be93-afb97b559a52', // (35) allow effect wheel spin
                })
                await GameEvent.create({
                    gameId: gamePlayer.gameId,
                    playerId: gamePlayer.playerId,
                    imageId: item.imageId,
                    taskId: child.id,
                    type: 'contentEndCoop',
                    pointsDelta: child.points,
                })
                await afterAnyEndCleanup(gamePlayer.gameId, gamePlayer.playerId)
            }
            for (const child of unfinishedChildren) {
                if (parentTask.wheelitem.wheelId === '5a698d76-5676-4f2e-934e-c98791ad58ca') {
                    await child.destroy()
                }
                else {
                    child.fromCoop = false
                    child.coopParentId = undefined
                    await child.save()
                }
            }

            const gamePlayer = await GamePlayer.findOne({
                where: {
                    gameId: parentTask.gameId,
                    playerId: parentTask.playerId,
                }
            })
            if (!gamePlayer)
                return res.status(404).json({ error: 'А где GamePLayer', status: 404 })
            const item = parentTask.wheelitem
            if (!item)
                return res.status(404).json({ error: 'А где WheelItem', status: 404 })
            gamePlayer.ended += 1
            gamePlayer.points += Math.round(item.hours * 10 * ptsMult)
            parentTask.result = 'finish'
            parentTask.points = Math.round(item.hours * 10 * ptsMult)
            parentTask.endedAt = new Date().toISOString()
            await parentTask.save()
            await gamePlayer.save()
            await GameEvent.create({
                gameId: gamePlayer.gameId,
                playerId: gamePlayer.playerId,
                imageId: item.imageId,
                taskId: parentTask.id,
                type: 'contentEndCoop',
                pointsDelta: parentTask.points,
            })
            await GameEffectState.create({
                gameId: gamePlayer.gameId,
                playerId: gamePlayer.playerId,
                effectId: '7c44ff0a-517c-49c2-be93-afb97b559a52', // (35) allow effect wheel spin
            })
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
            for (const inv of invites.filter(x => x.vars.inviteParentTaskId === parentTask.id)) {
                inv.isEnded = true
                await inv.save()
            }
            await afterAnyEndCleanup(gamePlayer.gameId, gamePlayer.playerId)
            res.send({
                success: true
            })
            res.socket.server.io?.emit('mutate', [
                `^/api/games/${gamePlayer.gameId}.*`,
                `^/api/tasks/.*`,
                `^/api/effects/.*`,
                `^/api/players/.*`,
                `/api//games/${gamePlayer.gameId}/events\?page`,
            ])

        } catch (error: any) {
            console.error(error);

            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .handler(commonErrorHandlers)