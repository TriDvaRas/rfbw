import multer from 'multer'
import type { NextApiRequest, NextApiResponse } from 'next'
import { createRouter } from "next-connect"
import { ApiError } from '../../../../types/common-api';
import { Audio, Image } from '../../../../database/db';
import commonErrorHandlers from '../../../../middleware/commonErrorHandlers';


const router = createRouter<NextApiRequest, NextApiResponse<Audio | ApiError>>();

export default router
    .get(async (req, res: NextApiResponse<Audio | ApiError>) => {
        const image = await Audio.findOne({
            where: {
                id: req.query.id,
            }
        })
        if (image)
            res.status(200).json(image)
        else
            res.status(404).json({ error: `Audio not found`, status: 404 })
    })
    .handler(commonErrorHandlers)

