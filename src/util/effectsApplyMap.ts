import _ from "lodash";
import { IWheel } from "./interfaces"

type GenericObject = { [key: string]: any };

const effectsApplyMap = new Map<number, Function>()

effectsApplyMap.set(3, (wheels: Array<IWheel>, effectVariables: GenericObject) => {
    return wheels.filter(w => w.id === effectVariables.wheelId)
})

effectsApplyMap.set(5, (wheels: Array<IWheel>, effectVariables: GenericObject) => {
    for (const wheel of wheels) {
        if (wheel.items) {
            const animes = wheel.items.filter(x => x.type === 'anime' && !x.disabled)
            if (animes?.length !== 0)
                for (const item of wheel.items) {
                    item.disabled = item.disabled || item.type !== 'anime'
                }
        }
    }
    return wheels
})

effectsApplyMap.set(6, (wheels: Array<IWheel>, effectVariables: GenericObject) => {
    for (const wheel of wheels) {
        if (wheel.items) {
            const games = wheel.items.filter(x => x.type === 'game' && !x.disabled)
            if (games?.length !== 0)
                for (const item of wheel.items ) {
                    item.disabled = item.disabled || item.type !== 'game'
                }
        }
    }
    return wheels
})

effectsApplyMap.set(7, (wheels: Array<IWheel>, effectVariables: GenericObject) => {
    for (const wheel of wheels) {
        if (wheel.items) {
            const games = wheel.items.filter(x => (x.type === 'movie' || x.type === 'series') && !x.disabled)
            if (games?.length !== 0)
                wheel.items = wheel.items.map(x => ({
                    ...x,
                    disabled: x.disabled || (x.type !== 'movie' && x.type !== 'series')
                }))
        }
    }
    return wheels
})

effectsApplyMap.set(29, (wheels: Array<IWheel>, effectVariables: GenericObject) => {
    return wheels.filter(w => w.id === effectVariables.wheelId)
})

effectsApplyMap.set(30, (wheels: Array<IWheel>, effectVariables: GenericObject) => {
    return wheels.filter(w => w.id === effectVariables.wheelId)
})

effectsApplyMap.set(31, (wheels: Array<IWheel>, effectVariables: GenericObject) => {
    return wheels.filter(w => w.id === effectVariables.wheelId)
})

effectsApplyMap.set(32, (wheels: Array<IWheel>, effectVariables: GenericObject) => {
    return wheels.filter(w => w.id === effectVariables.wheelId)
})

effectsApplyMap.set(33, (wheels: Array<IWheel>, effectVariables: GenericObject) => {
    return wheels.filter(w => w.id === effectVariables.wheelId)
})

effectsApplyMap.set(50, (wheels: Array<IWheel>, effectVariables: GenericObject) => {
    return wheels.filter(w => w.id === effectVariables.wheelId)
})

effectsApplyMap.set(53, (wheels: Array<IWheel>, effectVariables: GenericObject) => {
    const wheel = wheels.find(w => w.id === effectVariables.wheelId)
    const wheelItem = wheel?.items?.find(i => i.id === effectVariables.wheelItemId)
    if (wheelItem)
        wheelItem.disabled = true
    return wheels
})
export default effectsApplyMap