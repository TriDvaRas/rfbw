import multer from 'multer'
import type { NextApiRequest, NextApiResponse } from 'next'
import { createRouter } from "next-connect"
import { ApiError } from '../../../../types/common-api';
import { Image } from '../../../../database/db';
import commonErrorHandlers from '../../../../middleware/commonErrorHandlers';


const router = createRouter<NextApiRequest, NextApiResponse<Image | ApiError>>();

export default router
    .get(async (req, res: NextApiResponse<Image | ApiError>) => {
        const image = await Image.findOne({
            where: {
                id: req.query.id,
                preview: false
            }
        })
        if (image)
            res.status(200).json(image)
        else
            res.status(404).json({ error: `Full image not found`, status: 404 })
    })
    .handler(commonErrorHandlers)

