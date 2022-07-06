export function shuffle(array: any[]) {
    for (let i = 0; i < array.length; i++) {
        const j: any = Math.floor(Math.random() * array.length) as Number
        [array[i], array[j]] = [array[j], array[i]]
    }
    return array
}