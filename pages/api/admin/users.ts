import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth/next'
import { User } from '../../../database/db'
import { ApiError } from '../../../types/common-api'
import { authOptions } from "../../api/auth/[...nextauth]"


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<User[] | ApiError | null>
) {
    const session = await unstable_getServerSession(req, res, authOptions)
    if (session)
        try {
            const users = await User.findAll()
            if (users)
                res.json(users)
            else
                res.status(404).json({ error: 'А где', status: 404 })
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    else
        res.status(403).json({ error: 'Иди нахуй', status: 403 })

}