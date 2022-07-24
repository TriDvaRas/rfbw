export interface GameSpinResult {
    gameId: string
    playerId: string
    wheelId: string
    resultItemId: string
    extraSpin: number
}
export interface GameTaskEndResult {
    success: boolean
}