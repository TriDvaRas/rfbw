import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { createRouter } from 'next-connect';
import { Wheel, WheelItem, GameTask } from '../../../../database/db';
import commonErrorHandlers from '../../../../middleware/commonErrorHandlers';
import { ApiError } from '../../../../types/common-api';
import { WheelStats } from '../../../../types/stats';
import { authOptions } from '../../auth/[...nextauth]';
import { Op } from 'sequelize';


const router = createRouter<NextApiRequest, NextApiResponse<WheelStats | ApiError | null>>();

export default router
    .get(async (req, res) => {
        const session = await unstable_getServerSession(req, res, authOptions)
        try {
            const wheel = await Wheel.findOne({
                where: {
                    id: req.query.wheelId
                }
            })
            if (!wheel)
                return res.status(404).json({ error: 'А где', status: 404 })
            const wheelItems = await WheelItem.findAll({ where: { wheelId: wheel.id } })
            const animes = wheelItems.filter(x => x.type == 'anime')
            const games = wheelItems.filter(x => x.type == 'game')
            const movies = wheelItems.filter(x => x.type == 'movie')
            const series = wheelItems.filter(x => x.type == 'series')
            let completed
            if (session && req.query.gameId) {
                const tasks = await GameTask.findAll({
                    where: {
                        playerId: session.user.id,
                        gameId: req.query.gameId,
                        wheelItemId: {
                            [Op.in]: wheelItems.map(x => x.id)
                        }
                    }
                })
                completed = {
                    animes: animes.filter(x => tasks.find(t => t.wheelItemId === x.id)).length,
                    games: games.filter(x => tasks.find(t => t.wheelItemId === x.id)).length,
                    movies: movies.filter(x => tasks.find(t => t.wheelItemId === x.id)).length,
                    series: series.filter(x => tasks.find(t => t.wheelItemId === x.id)).length,
                }
            }
            res.json({
                wheelId: wheel.id,
                total: {
                    animes: animes.length,
                    games: games.length,
                    movies: movies.length,
                    series: series.length,
                },
                completed
            })

        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .handler(commonErrorHandlers)