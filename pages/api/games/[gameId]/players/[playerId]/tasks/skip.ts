import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth/next'
import { createRouter } from 'next-connect'
import { Game, Wheel, GamePlayer, GameTask, WheelItem, GameEvent } from '../../../../../../../database/db';
import adminOnly from '../../../../../../../middleware/adminOnly';
import commonErrorHandlers from '../../../../../../../middleware/commonErrorHandlers'
import requireApiSession from '../../../../../../../middleware/requireApiSession'
import requirePlayer from '../../../../../../../middleware/requirePlayer'
import { ApiError } from '../../../../../../../types/common-api'
import { authOptions } from "../../../../../auth/[...nextauth]"
import { GameTaskEndResult } from '../../../../../../../types/game';
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
            gamePlayer.rerolled += 1
            playerActiveTask.result = 'skip'
            playerActiveTask.points = 0
            playerActiveTask.endedAt = new Date().toISOString()
            playerActiveTask.save()
            gamePlayer.save()
            await GameEvent.create({
                gameId: gamePlayer.gameId,
                playerId: gamePlayer.playerId,
                imageId: item.imageId,
                taskId: playerActiveTask.id,
                type: 'contentSkip',
            })
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