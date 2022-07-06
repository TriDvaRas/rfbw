import _ from "lodash";
import effectsApplyMap from "./effectsApplyMap";
import { IEffect, IEffectState, IWheel } from "./interfaces";

export function getEffectType(effect: IEffect) {
    if (effect.isPositive)
        return 'positive'
    if (effect.isNegative)
        return 'negative'
    if (effect.isCard)
        return 'card'
    if (effect.isSecret)
        return 'secret'
    return 'neutral'
}
export function getTypeEffect(type: string) {
    return {
        isPositive: type === 'positive',
        isNegative: type === 'negative',
        isCard: type === 'card',
        isSecret: type === 'secret',
    }
}
export function isNeutral(effect: IEffect) {
    return !(effect.isCard || effect.isNegative || effect.isPositive || effect.isSecret)
}

export function applyEffects(wheels: Array<IWheel>, effects: Array<IEffectState>) {
    let filteredWheels = _.cloneDeep(wheels)

    for (const effect of effects) {
        const fn = effectsApplyMap.get(effect.effect.id)
        if (fn) {   
            const newFilteredWheels = fn(filteredWheels, effect.variables)
            if (newFilteredWheels.length > 0)
                filteredWheels = newFilteredWheels
        }
        if (filteredWheels.length === 1)
            break
    }
    return filteredWheels
}