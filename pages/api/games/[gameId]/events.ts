import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { Game, GameWheel, Wheel, GamePlayer, WheelItem, GameEvent } from '../../../../database/db';
import commonErrorHandlers from '../../../../middleware/commonErrorHandlers';
import { ApiError } from '../../../../types/common-api';
import { GameStats } from '../../../../types/stats';
import { Op } from 'sequelize'
import moment from 'moment';


const router = createRouter<NextApiRequest, NextApiResponse<GameEvent[] | ApiError | null>>();
const pageSize = 10
export default router
    .get(async (req, res) => {
        try {
            const date = req.query.date ? {
                createdAt: {
                    [Op.gt]: moment(req.query.date).startOf('day').toDate(),
                    [Op.lt]: moment(req.query.date).endOf('day').toDate(),
                }
            } : {}
            const where: any = {
                gameId: req.query.gameId,
                ...date,
            }
            if (req.query.playerId)
                where.playerId = req.query.playerId
            const events = await GameEvent.findAll({
                where,
                order:[['createdAt','DESC']],
                limit: pageSize,
                offset: (+(req.query.page || 1) - 1) * pageSize,
            })
            res.json(events)

        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .handler(commonErrorHandlers)