import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth/next'
import { createRouter } from 'next-connect'
import { Wheel, WheelItem } from '../../../database/db';
import adminOnly from '../../../middleware/adminOnly';
import commonErrorHandlers from '../../../middleware/commonErrorHandlers'
import requireApiSession from '../../../middleware/requireApiSession'
import requirePlayer from '../../../middleware/requirePlayer'
import { ApiError } from '../../../types/common-api'
import { authOptions } from "../auth/[...nextauth]"
import _ from 'lodash';



const router = createRouter<NextApiRequest, NextApiResponse>();

export default router
    .get(async (req, res: NextApiResponse) => {
        if (process.env.DEV_DEV)
            try {
                const wheelItems = await WheelItem.findAll({ order: [['position', 'ASC']] })
                const groups = _.groupBy(wheelItems, 'wheelId')
                for (const key in groups) {
                    if (Object.prototype.hasOwnProperty.call(groups, key)) {
                        const gr = groups[key];
                        gr.forEach((item, i) => {
                            item.position = i
                            item.save()
                        })
                    }
                }
                res.json(200)
            } catch (error: any) {
                res.status(500).json({ error: error.message, status: 500 })
            }
    })
    .handler(commonErrorHandlers)