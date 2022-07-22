import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth/next'
import { Player, User, Wheel } from '../../../../../database/db'
import { ApiError } from '../../../../../types/common-api'
import { authOptions } from "../../../auth/[...nextauth]"
import nextConnect from 'next-connect';
import { createRouter } from "next-connect";
import adminOnly from '../../../../../middleware/adminOnly'
import requireApiSession from '../../../../../middleware/requireApiSession'
import multer from 'multer'
import commonErrorHandlers from '../../../../../middleware/commonErrorHandlers'


const router = createRouter<NextApiRequest, NextApiResponse>();

export default router
    .use(requireApiSession)
    .use(adminOnly)
    .post(async (req, res: NextApiResponse<Wheel | ApiError>) => {
        const wheel = await Wheel.findOne({ where: { id: req.query.wheelId } })
        if (!wheel)
            return res.status(400).json({ error: `Wheel ${req.query.wheelId} doesn't exist`, status: 400 })
        wheel.locked = true
        wheel.save()
        res.status(200).json(wheel)
    })
    .handler(commonErrorHandlers)