import { includes } from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth/next'
import { createRouter } from 'next-connect'
import { GameTaskWithWheelItem, WheelItem, GamePlayerWithPlayer, GameEffectState, GameEffectStateWithEffectWithPlayer, Effect, Player } from '../../../../../../database/db';
import commonErrorHandlers from '../../../../../../middleware/commonErrorHandlers';
import { ApiError } from '../../../../../../types/common-api';
import { EffectStateQuestionVars } from '../../../../../../types/effectStateVars';
import { Op } from 'sequelize';




const router = createRouter<NextApiRequest, NextApiResponse>();

export default router
    .get(async (req, res: NextApiResponse<GamePlayerWithPlayer[] | ApiError | null>) => {
        try {
            const invites = await GameEffectStateWithEffectWithPlayer<EffectStateQuestionVars>.findAll({
                where: {
                    gameId: req.query.gameId,
                    isEnded: false
                },
                include: [{
                    model: Effect,
                    required: true,
                    where: {
                        lid: 99
                    }
                }, Player]
            })
            const playerIds = invites.filter(x => x.vars?.inviteParentTaskId == req.query.parentId).map(x => x.playerId)
            const tasks = await GamePlayerWithPlayer.findAll({
                where: {
                    gameId: req.query.gameId,
                    playerId: { [Op.in]: playerIds }
                },
                include: Player
            })
            res.json(tasks)
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .handler(commonErrorHandlers)