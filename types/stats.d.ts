export interface GameStats {
    gameId: string
    players: number
    wheels: number
    wheelItems: number
}
export interface WheelStats {
    wheelId: string
    total: {
        animes: number
        games: number
        series: number
        movies: number
    }
    completed?: {
        animes: number
        games: number
        series: number
        movies: number
    }
} 