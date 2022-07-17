export function randomInt(min: number, max: number) {
    const m = Math.ceil(min)
    return Math.floor(Math.random() * (max - m)) + m
}