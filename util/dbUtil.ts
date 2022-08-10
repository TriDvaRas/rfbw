import { effectsConfig } from "../config"
import { GameEffectStateWithEffectWithPlayer, Effect, Player, GameEvent } from "../database/db"

export async function afterAnyEndCleanup(gameId: string, playerId: string) {

    for (const lid of effectsConfig.afterAnyEndClears) {
        const eff = await GameEffectStateWithEffectWithPlayer<any>.findOne({
            where: {
                gameId,
                playerId,
            },
            include: [{
                model: Effect,
                required: true,
                where: {
                    lid
                }
            }, Player]
        })
        if (!eff)
            continue
        eff.isEnded = true
        await eff.save()
        await GameEvent.create({
            gameId,
            playerId,
            effectId: eff.effectId,
            imageId: eff.effect.imageId,
            type: 'effectLost',
        })
    }
}