import { Wheel, GameEffectStateWithEffectWithPlayer, GameWheel, GameWheelWithWheel } from '../../database/db';

export function filterWheelsWithEffects(wheels: Wheel[], effectStates: GameEffectStateWithEffectWithPlayer[]): Wheel[] {
    for (const state of effectStates) {
        let _wheels: Wheel[] = []
        switch (state.effect.lid) {
            case 3:
                _wheels = wheels.filter(x => x.id === state.vars.wheelId)
                break;
            case 30:
                _wheels = wheels.filter(x => x.ownedById === state.vars.wheelOwnerId)
                break;
            case 31:
                _wheels = wheels.filter(x => x.id === state.vars.wheelId)
                break;
            case 32:
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
export function filterGameWheelsWithEffects(wheels: GameWheelWithWheel[], effectStates: GameEffectStateWithEffectWithPlayer[]): GameWheelWithWheel[] {
    for (const state of effectStates) {
        let _wheels: GameWheelWithWheel[] = []
        switch (state.effect.lid) {
            case 3:
                _wheels = wheels.filter(x => x.wheelId === state.vars.wheelId)
                break;
            case 30:
                _wheels = wheels.filter(x => x.wheel.ownedById === state.vars.wheelOwnerId)
                break;
            case 31:
                _wheels = wheels.filter(x => x.wheelId === state.vars.wheelId)
                break;
            case 32:
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