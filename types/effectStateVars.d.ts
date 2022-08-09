import { GameEffectWithEffect, GamePlayerWithPlayer, Player, WheelItem, GamePlayer, GameWheelWithWheel, GameTaskWithWheelItem } from '../database/db';

export interface EffectStateQuestionVars {
    question: string,
    players?: GamePlayerWithPlayer[],
    effects?: GameEffectWithEffect[]
    // types?: Array<CustomType>
    // scores?: Array<CustomType>
    player?: Player;
    gamePlayer?: GamePlayerWithPlayer;
    content?: WheelItem
    is21?: boolean;
    is22?: boolean;
    result?: number;
    guess?: number[];
    message?: string;
    rejected?: boolean;
    wheels?: GameWheelWithWheel[];
    // withItems?: boolean;
    inviteParentTaskId?: string
    task?: GameTaskWithWheelItem
    accepted?: boolean
}