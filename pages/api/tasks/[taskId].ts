import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { GamePlayer, GameTask } from '../../../database/db';
import adminOnly from '../../../middleware/adminOnly';
import commonErrorHandlers from '../../../middleware/commonErrorHandlers';
import requireApiSession from '../../../middleware/requireApiSession';
import { ApiError } from '../../../types/common-api';



const router = createRouter<NextApiRequest, NextApiResponse>();

export default router
    .get(async (req, res: NextApiResponse<GameTask | ApiError | null>) => {
        try {
            const task = await GameTask.findOne({
                where: {
                    id: req.query.taskId
                }
            })
            if (task)
                res.json(task)
            else
                res.status(404).json({ error: 'А где', status: 404 })
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .handler(commonErrorHandlers)