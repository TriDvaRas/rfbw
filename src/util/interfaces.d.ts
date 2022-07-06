export interface IWheel {
    id: number;
    ownerId: number;
    border: string;
    pointer: string;
    minimalSpin: number;
    background: string;
    dot: string;
    ownerName?: string;
    ownerTag?: string;
    items?: Array<IWheelItem | IWheelItemLoading>;
}
export interface IWheelItem {
    id: number;
    wheelId: number;
    label: string;
    title: string;
    image: string;
    type: 'game' | 'anime' | 'movie' | 'series';
    altColor: string;
    fontColor: string;
    hours: number;
    loading?: boolean;
    imageMode: 'height' | 'width';
    comments?: string;
    deleted?: boolean;
    disabled?: boolean;
    difficulty?: boolean;
    coop?: number;
}
export interface IWheelItemLoading {
    id: number;
    wheelId?: number;
    label?: string;
    title?: string;
    image?: string;
    type?: 'game' | 'anime' | 'movie' | 'series';
    altColor?: string;
    fontColor?: string;
    hours?: number;
    loading: boolean;
    imageMode?: 'height' | 'width';
    comments?: string;
    deleted?: boolean;
    disabled?: boolean;
    difficulty?: boolean;
    coop?: number;
}


export interface IColor {
    rgb: {
        r: number;
        g: number;
        b: number;
        a?: number;
    };
    hex: string;
}

export interface IUser {
    id: string;
    tag: string;
    avatar: string;
    isAdmin: boolean | 0 | 1;
    isPlayer: boolean | 0 | 1;
}

export interface IPlayer {
    id: number;
    userId: string;
    name: string;
    points: number;
    picture: string;
    about: string;
    ended: number;
    dropped: number;
    rerolled: number;
}

export interface IAPlayer extends IPlayer {
    avatar: string;
    wheelId: number;
    userTag: string;
}

export interface IToast {
    id: number;
    new?: boolean;
    show?: boolean;
    date: string;
    type: 'info' | 'success' | 'error' | 'other';
    autohide?: number;
    title: string;
    text?: string;
}
export interface IToastStyle {
    containerClasses: string;
    headerClasses: string;
    bodyClasses: string;
}


export interface IEffect {
    id: number;
    title: string;
    description: string;
    groupId: number;
    isCard: boolean;
    isSecret: boolean;
    isPositive: boolean;
    isNegative: boolean;
    cooldown?: number;
    shuffleValue: number;
}
export interface IAEffect extends IEffect {
    title?: string;
    description?: string;
    groupId?: number;
    isCard?: boolean;
    isSecret?: boolean;
    isPositive?: boolean;
    isNegative?: boolean;
    loading?: boolean;
    tempId?: number;
    shuffleValue?: number;
}
export interface IEffectCard extends IEffect {
    playerId: number;
    isUsed: boolean;
}
export interface IEffectSecret extends IEffect {
    playerId: number;
    isActive: boolean;
    isUsed: boolean;
}

export interface ITask {
    id: number;
    wheelItem: IWheelItem;
    player: IPlayer;
    finished: boolean;
    dropped: boolean;
    rerolled: boolean;
    hours: number;
    skippable: boolean;
}
export interface IStat {
    id: number;
    timestamp: string;
    points: Array<{ playerId: number, value: number }>;
    ended: Array<{ playerId: number, value: number }>;
    dropped: Array<{ playerId: number, value: number }>;
    rerolled: Array<{ playerId: number, value: number }>;
}
export interface IEffectState {
    id: number;
    effect: IEffect;
    player: IPlayer;
    isEnded: boolean;
    variables?: Object<any>;
}
export interface ISecretState {
    id: number;
    player: IPlayer;
    effect: IEffect;
    isActive: boolean;
    variables?: Object<any>;
}
export interface ICardState {
    id: number;
    player: IPlayer;
    effect: IEffect;
    isUsed: boolean;
    variables?: Object<any>;
}

export type PostTypes = 'spin'| 'end' | 'reroll' | 'drop' | 'points' | 'effectspin'| 'effectcustom' |  'other'
export interface IPost {
    id: number,
    type: PostTypes,
    timestamp: string,
    isTopped: boolean,
    variables: Object<any>
}
export interface IPostSpin extends IPost {
    variables: {
        playerId: number,
        itemName: string,
        ownerName: string;
    }
}
export interface IPostEnd extends IPost {
    variables: {
        playerId: number,
        itemName: string,
    }
}
export interface IPostReroll extends IPost {
    variables: {
        playerId: number,
        itemName: string,
    }
}
export interface IPostDrop extends IPost {
    variables: {
        playerId: number,
        itemName: string,
    }
}
export interface IPostPoints extends IPost {
    variables: {
        playerId: number,
        add: boolean,
        delta: number,
        reason: string;
    }
}
export interface IPostEffectSpin extends IPost {
    variables: {
        playerId: number,
        effectId: number,
        effectVars?: {
            secret?: boolean;
            lostCard?: ICardState;
            wheelOwnerId?: number;
        },
    }
}
export interface IPostCustom extends IPost {
    variables: {
        pattern: string;
        variables: Object<any>;
    }
}