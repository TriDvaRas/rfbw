import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { Game, GameWheel, Wheel, GamePlayer, WheelItem } from '../../../../database/db';
import commonErrorHandlers from '../../../../middleware/commonErrorHandlers';
import { ApiError } from '../../../../types/common-api';
import { GameStats } from '../../../../types/stats';
import { Op } from 'sequelize'


const router = createRouter<NextApiRequest, NextApiResponse<GameStats | ApiError | null>>();

export default router
    .get(async (req, res) => {
        try {
            const game = await Game.findOne({
                where: {
                    id: req.query.gameId
                }
            })
            if (!game)
                return res.status(404).json({ error: 'А где', status: 404 })
            const gameWheels = await GameWheel.findAll({
                where: {
                    gameId: game.id
                }
            })
            const wheelItems = await WheelItem.count({
                where: {
                    wheelId: {
                        [Op.in]: gameWheels.map(x => x.wheelId)
                    }
                }
            })
            const players = await GamePlayer.count({
                where: {
                    gameId: game.id
                }
            })
            const wheels = gameWheels.length
            res.json({
                gameId: game.id,
                players,
                wheels,
                wheelItems,
            })

        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .handler(commonErrorHandlers)