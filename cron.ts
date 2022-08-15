import { schedule } from "node-cron"
import { GameEffectStateWithEffectWithPlayer, Player, Effect, GameEvent } from "./database/db"

schedule(`0 0 * * *`, async () => {
    

}, {
    timezone: 'Europe/Kyiv',
})