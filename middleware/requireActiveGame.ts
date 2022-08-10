import { NextApiResponse, NextApiRequest } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { NextHandler } from 'next-connect';
import { Game } from '../database/db';
import { authOptions } from '../pages/api/auth/[...nextauth]';
export default async function requireActiveGame(req: NextApiRequest, res: NextApiResponse, next: NextHandler) {
    const gameId = req.query.gameId || req.body?.gameId
    if (!gameId) return res.status(455).json({ error: `No gameId`, status: 455 })
    const game = await Game.findOne({ where: { id: gameId } })
    if (!game) return res.status(456).json({ error: `Invalid game`, status: 456 })
    const now = new Date()
    const start = new Date(game.startsAt)
    const end = new Date(game.endsAt)

    if (now < start)
        return res.status(457).json({ error: 'Игра еще не началась', status: 457 })
    if (now > end)
        return res.status(457).json({ error: 'Игра уже закончилась', status: 457 })
    await next();
}