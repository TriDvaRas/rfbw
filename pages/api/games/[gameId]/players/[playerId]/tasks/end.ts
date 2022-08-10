import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth/next'
import { createRouter } from 'next-connect'
import { Game, Wheel, GamePlayer, GameTask, WheelItem, GameEvent, GameEffectState, GameEffectStateWithEffectWithPlayer, Effect, Player } from '../../../../../../../database/db';
import adminOnly from '../../../../../../../middleware/adminOnly';
import commonErrorHandlers from '../../../../../../../middleware/commonErrorHandlers'
import requireApiSession from '../../../../../../../middleware/requireApiSession'
import requirePlayer from '../../../../../../../middleware/requirePlayer'
import { ApiError } from '../../../../../../../types/common-api'
import { authOptions } from "../../../../../auth/[...nextauth]"
import { GameTaskEndResult } from '../../../../../../../types/game';
import { EffectStateQuestionVars } from '../../../../../../../types/effectStateVars';
import { effectsConfig } from '../../../../../../../config';
import { afterAnyEndCleanup } from '../../../../../../../util/dbUtil';



const router = createRouter<NextApiRequest, NextApiResponse>();

export default router
    .use(requireApiSession)
    .use(requirePlayer)
    .post(async (req, res: NextApiResponse<GameTaskEndResult | ApiError | null>) => {
        try {
            if (req.query.playerId !== req.session.user.id && !req.session.user.isAdmin)
                return res.status(403).json({ error: 'Пошел нахуй', status: 403 })
            const playerActiveTask = await GameTask.findOne({
                where: {
                    gameId: req.query.gameId,
                    playerId: req.query.playerId,
                    result: null
                },
                order: [['fromCoop', 'DESC']]
            })

            if (!playerActiveTask)
                return res.status(404).json({ error: 'А где', status: 404 })
            if (playerActiveTask.wheelItemId !== req.body.wheelItemId)
                return res.status(400).json({ error: 'Invalid active task', status: 400 })
            const gamePlayer = await GamePlayer.findOne({
                where: {
                    gameId: req.query.gameId,
                    playerId: req.query.playerId,
                }
            })
            if (!gamePlayer)
                return res.status(404).json({ error: 'А где GamePLayer', status: 404 })
            const item = await WheelItem.findOne({ where: { id: playerActiveTask.wheelItemId } })
            if (!item)
                return res.status(404).json({ error: 'А где WheelItem', status: 404 })
            let ptsMult = item.wheelId === '5a698d76-5676-4f2e-934e-c98791ad58ca' ? 1 / item.maxCoopPlayers : 1

            gamePlayer.ended += 1
            gamePlayer.points += Math.round(item.hours * 10 * ptsMult)
            playerActiveTask.result = 'finish'
            playerActiveTask.points = Math.round(item.hours * 10 * ptsMult)
            playerActiveTask.endedAt = new Date().toISOString()
            playerActiveTask.save()
            gamePlayer.save()
            await GameEvent.create({
                gameId: gamePlayer.gameId,
                playerId: gamePlayer.playerId,
                imageId: item.imageId,
                taskId: playerActiveTask.id,
                type: 'contentEnd',
                pointsDelta: playerActiveTask.points,
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
            for (const inv of invites.filter(x => x.vars.inviteParentTaskId === playerActiveTask.id)) {
                inv.isEnded = true
                await inv.save()
            }
            await afterAnyEndCleanup(gamePlayer.gameId, gamePlayer.playerId)
            res.send({
                success: true
            })
            res.socket.server.io?.emit('mutate', [
                `^/api/games/${req.query.gameId}/events`,
                `^/api/games/${req.query.gameId}/players`,
                `^/api/tasks/${playerActiveTask.id}`,
                `^/api/players/${gamePlayer.playerId}`,
            ])

        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .handler(commonErrorHandlers)