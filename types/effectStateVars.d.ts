import { GameEffectWithEffect, GamePlayerWithPlayer, Player, WheelItem } from '../database/db';

export interface EffectStateQuestionVars {
    question: string,
    players?: GamePlayerWithPlayer[],
    effects?: GameEffectWithEffect[]
    // types?: Array<CustomType>
    // scores?: Array<CustomType>
    player?: Player;
    content?: WheelItem
    // is21?: boolean;
    // is22?: boolean;
    // result?: number;
    // guess?: number[];
    // message?: string;
    // rejected?: boolean;
    // wheels?: IWheel[];
    // withItems?: boolean;
}