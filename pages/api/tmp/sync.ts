import type { NextApiRequest, NextApiResponse } from 'next'
import { syncTables } from '../../../database/db';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await syncTables()
    res.send(200)
}