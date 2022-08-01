import { Wheel, GameEffectStateWithEffectWithPlayer, GameWheel } from '../../database/db';

export function filterWheelsWithEffects(wheels: Wheel[], effectStates: GameEffectStateWithEffectWithPlayer[]): Wheel[] {
    for (const state of effectStates) {
        let _wheels: Wheel[] = []
        switch (state.effect.lid) {
            case 3:
                _wheels = wheels.filter(x => x.id === state.vars.wheelId)
                break;
            default:
                break;
        }
        if (_wheels.length > 0)
            wheels = _wheels
        else
            continue
    }
    return wheels
}
export function filterGameWheelsWithEffects(wheels: GameWheel[], effectStates: GameEffectStateWithEffectWithPlayer[]): GameWheel[] {
    for (const state of effectStates) {
        let _wheels: GameWheel[] = []
        switch (state.effect.lid) {
            case 3:
                _wheels = wheels.filter(x => x.wheelId === state.vars.wheelId)
                break;
            default:
                break;
        }
        if (_wheels.length > 0)
            wheels = _wheels
        else
            continue
    }
    return wheels
}