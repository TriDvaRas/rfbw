import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth/next'
import { createRouter } from 'next-connect'
import { Game, Wheel, Player, WheelItem, GameTask } from '../../../../database/db';
import commonErrorHandlers from '../../../../middleware/commonErrorHandlers'
import requireApiSession from '../../../../middleware/requireApiSession'
import requirePlayer from '../../../../middleware/requirePlayer'
import { ApiError } from '../../../../types/common-api'
import { authOptions } from "../../auth/[...nextauth]"
import { Op } from 'sequelize';
import { GameSpinResult } from '../../../../types/game';
import _ from 'lodash';



const router = createRouter<NextApiRequest, NextApiResponse<GameSpinResult | ApiError | null>>();

export default router
    .use(requireApiSession)
    .use(requirePlayer)
    .post(async (req, res) => {
        const body: {
            wheelId: string
            activeWheelItemIds: string[]
        } = req.body
        try {
            const user = req.session.user
            const player = await Player.findOne({ where: { id: user.id } }) as Player

            const game = await Game.findOne({ where: { id: req.query.gameId } })
            if (!game) return res.status(400).json({ error: `Invalid gameId`, status: 400 })

            const playerActiveTask = await GameTask.findOne({
                where: {
                    playerId: player.id,
                    result: { [Op.ne]: null }
                },
                order: [['fromCoop', 'DESC']]
            })
            if (playerActiveTask) return res.status(400).json({ error: `Player has unfinished task`, status: 400 })

            const wheel = await Wheel.findOne({ where: { id: body.wheelId } })
            if (!wheel) return res.status(400).json({ error: `Invalid wheelId`, status: 400 })

            const wheelItems = await WheelItem.findAll({ where: { wheelId: wheel.id }, })
            const playerGameTasks = await GameTask.findAll({ where: { gameId: game.id, playerId: player.id } })
            const activeItems = wheelItems.filter(x => !playerGameTasks.find(y => y.wheelItemId === x.id))
            if (activeItems.length == 0) return res.status(400).json({ error: `Empty wheel`, status: 400 })

            const resultItem = _.sample(activeItems) as WheelItem
            const extraSpin = (Math.sqrt(Math.random()) - 0.5) * .99
            res.json({
                extraSpin,
                resultItemId: resultItem.id,

                playerId: user.id,
                gameId: req.query.gameIds as string,
                wheelId: wheel.id,
            })
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .handler(commonErrorHandlers)