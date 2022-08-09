import { Wheel, GameEffectStateWithEffectWithPlayer, GameWheel, GameWheelWithWheel } from '../../database/db';

export function filterWheelsWithEffects(wheels: Wheel[], effectStates: GameEffectStateWithEffectWithPlayer[]): Wheel[] {
    if (effectStates.find(x => x.effect.lid == 58)) {
        let _wheels = wheels.filter(x => x.id == '40e070f0-2254-4099-af87-33a4bc2cdaed')
        if (_wheels.length > 0) {
            return _wheels
        }
    }
    else if (effectStates.find(x => x.effect.lid == 60)) {
        let _wheels = wheels.filter(x => x.id == '5a698d76-5676-4f2e-934e-c98791ad58ca')
        if (_wheels.length > 0) {
            return _wheels
        }
    }
    wheels = wheels.filter(x => x.id !== '5a698d76-5676-4f2e-934e-c98791ad58ca' && x.id !== '40e070f0-2254-4099-af87-33a4bc2cdaed')
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
    if (effectStates.find(x => x.effect.lid == 58)) {
        let _wheels = wheels.filter(x => x.wheelId == '40e070f0-2254-4099-af87-33a4bc2cdaed')
        if (_wheels.length > 0) {
            return _wheels
        }
    }
    else if (effectStates.find(x => x.effect.lid == 60)) {
        let _wheels = wheels.filter(x => x.wheelId == '5a698d76-5676-4f2e-934e-c98791ad58ca')
        if (_wheels.length > 0) {
            return _wheels
        }
    }
    wheels = wheels.filter(x => x.wheelId !== '5a698d76-5676-4f2e-934e-c98791ad58ca' && x.wheelId !== '40e070f0-2254-4099-af87-33a4bc2cdaed')
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