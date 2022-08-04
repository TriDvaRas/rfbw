import { GameEffectStateWithEffectWithPlayer, WheelItem } from '../../database/db';

export function filterWheelItemsWithEffects(items: WheelItem[], effectStates: GameEffectStateWithEffectWithPlayer[]): WheelItem[] {
    for (const state of effectStates) {
        let _items: WheelItem[] = []
        switch (state.effect.lid) {
            case 5:
                _items = items.filter(x => x.type === 'anime')
                break;
            case 6:
                _items = items.filter(x => x.type === 'game')
                break;
            case 7:
                _items = items.filter(x => x.type === 'series' || x.type === 'movie')
                break;
            default:
                break;
        }
        if (_items.length > 0)
            items = _items
        else
            continue
    }
    return items
}