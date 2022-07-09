import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth/next'
import { Player, User } from '../../../database/db'
import { ApiError } from '../../../types/common-api'
import { authOptions } from "../auth/[...nextauth]"
import nextConnect from 'next-connect';
import { createRouter } from "next-connect";
import adminOnly from '../../../middleware/adminOnly'
import requireApiSession from '../../../middleware/requireApiSession copy'
import multer from 'multer'
import commonErrorHandlers from '../../../middleware/commonErrorHandlers'


const router = createRouter<NextApiRequest, NextApiResponse<Player | ApiError>>();

export default router
    .use(requireApiSession)
    .use(adminOnly)
    .put(async (req, res) => {
        const body: {
            id: string,
            name: string,
            about: string,
            imageId?: string,
        } = req.body
        const user = await User.findOne({ where: { id: body.id } })
        if (!user)
            return res.status(400).json({ error: `User ${body.id} doesn't exist`, status: 400 })
        const player = await Player.create({
            id: body.id,
            name: body.name,
            about: body.about,
            imageId: body.imageId,
            addedById: req.session.user.id
        })
        user.isPlayer = true
        user.save()
        res.status(200).json(player)
    })
    .handler(commonErrorHandlers)