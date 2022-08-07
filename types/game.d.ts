export interface GameSpinResult {
    gameId: string
    playerId: string
    wheelId: string
    resultItemId: string
    extraSpin: number
}
export interface GameSpinEffectResult {
    gameId: string
    playerId: string
    resultItemId: string
    extraSpin: number
}
export interface GameRollDiceResult {
    message: string,
    result?: number
}
export interface GameShootResult {
    message: string,
    result?: number
}
export interface GameTaskEndResult {
    success: boolean
}