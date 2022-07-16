import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth/next'
import { Rules } from '../../../database/db'
import { ApiError } from '../../../types/common-api'
import { authOptions } from "../../api/auth/[...nextauth]"


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Rules | ApiError | null>
) {
    try {
        const rules = await Rules.findOne({
            order: [['timestamp', 'DESC']]
        })
        if (rules)
            res.send(rules)
        else
            res.status(404).send({ error: 'А где', status: 404 })
    } catch (error: any) {
        res.status(500).send({ error: error.message, status: 500 })
    }

}