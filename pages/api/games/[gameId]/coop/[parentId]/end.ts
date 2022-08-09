import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth/next'
import { createRouter } from 'next-connect'

import { Effect, GameEffectStateWithEffectWithPlayer, GameEvent, GamePlayer, GameTask, GameTaskWithWheelItem, Player, WheelItem, GameTaskWithPlayer } from '../../../../../../database/db';
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
                gamePlayer.points += item.hours * 10
                child.result = 'finish'
                child.points = item.hours * 10
                child.endedAt = new Date().toISOString()
                await child.save()
                await gamePlayer.save()
                await GameEvent.create({
                    gameId: gamePlayer.gameId,
                    playerId: gamePlayer.playerId,
                    imageId: item.imageId,
                    taskId: child.id,
                    type: 'contentEndCoop',
                    pointsDelta: child.points,
                })

            }
            for (const child of unfinishedChildren) {
                child.fromCoop = false
                child.coopParentId = undefined
                await child.save()
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
            gamePlayer.points += item.hours * 10
            parentTask.result = 'finish'
            parentTask.points = item.hours * 10
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
            res.send({
                success: true
            })


        } catch (error: any) {
            console.error(error);

            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .handler(commonErrorHandlers)