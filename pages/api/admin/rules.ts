import type { NextApiRequest, NextApiResponse } from 'next'
import { createRouter } from "next-connect"
import { Player, Rules } from '../../../database/db'
import adminOnly from '../../../middleware/adminOnly'
import commonErrorHandlers from '../../../middleware/commonErrorHandlers'
import requireApiSession from '../../../middleware/requireApiSession'
import { ApiError } from '../../../types/common-api'


const router = createRouter<NextApiRequest, NextApiResponse>();

export default router
    .use(requireApiSession)
    .use(adminOnly)
    .post(async (req, res: NextApiResponse<Rules | ApiError>) => {
        const rules = await Rules.create({
            markdown: req.body.markdown,
            timestamp: new Date(),
            savedById: req.session.user.id,
        })
        res.status(200).json(rules)
    })
    .handler(commonErrorHandlers)