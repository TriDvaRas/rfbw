import { NextApiResponse, NextApiRequest } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { NextHandler } from 'next-connect';
import { authOptions } from '../pages/api/auth/[...nextauth]';
export default async function requirePlayer(req: NextApiRequest, res: NextApiResponse, next: NextHandler) {
    if (req.session.user.isPlayer) {
        await next(); 
    }
    else {
        res.status(433).json({ error: 'Ты не игрок', status: 433 })
    }
}