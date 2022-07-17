import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from "next-connect";
import { Audio } from '../../../../database/db';
import commonErrorHandlers from '../../../../middleware/commonErrorHandlers';
import { ApiError } from '../../../../types/common-api';
import fs from 'fs'

const router = createRouter<NextApiRequest, NextApiResponse<Buffer | ApiError>>();

export default router
    .get(async (req, res: NextApiResponse<Buffer | ApiError>) => {
        const image = await Audio.findOne({
            where: {
                id: req.query.id,
            }
        })
        if (!image)
            return res.status(404).json({ error: `Audio not found`, status: 404 })
        res.send(fs.readFileSync(`./uploads/${image.filePath}`))
    })
    .handler(commonErrorHandlers)

