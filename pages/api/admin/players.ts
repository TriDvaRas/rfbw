import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth/next'
import { Player, User } from '../../../database/db'
import { ApiError } from '../../../types/common-api'
import { authOptions } from "../auth/[...nextauth]"
import nextConnect from 'next-connect';
import { createRouter } from "next-connect";
import adminOnly from '../../../middleware/adminOnly'
import requireApiSession from '../../../middleware/requireApiSession'
import multer from 'multer'
import commonErrorHandlers from '../../../middleware/commonErrorHandlers'


const router = createRouter<NextApiRequest, NextApiResponse>();

export default router
    .use(requireApiSession)
    .use(adminOnly)
    .get(async (req, res: NextApiResponse<Player[] | ApiError>) => {
        try {
            const players = await Player.findAll()
            if (players)
                res.json(players)
            else
                res.status(404).json({ error: 'А где', status: 404 })
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .put(async (req, res: NextApiResponse<Player | ApiError>) => {
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