
export function startsWithAny(line: string, starts: Array<string>) {
    for (const start of starts)
        if (line.startsWith(start))
            return true
    return false
}

export function highlightMdAll(line: string, colorsFg: Array<{ tag: string; hex: string }>, colorsBg: Array<{ tag: string; hex: string }>, author: string, timestamp: string) {
    line = highlightMdAuthor(line, author)
    line = highlightMdTimestamp(line, timestamp)
    line = highlightMdBg(line, colorsBg)
    line = highlightMdFg(line, colorsFg)
    return line
}

export function highlightMdBg(line: string, colors: Array<{ tag: string; hex: string }>) {
    for (const color of colors) {
        line = line.replace(new RegExp(`\\^${color.tag}\\^(.+?)\\^\\^`, 'g'), `<span class='round-span' style='background-color:${color.hex}'>$1</span>`)
    }
    return line
}

export function highlightMdFg(line: string, colors: Array<{ tag: string; hex: string }>) {
    for (const color of colors) {
        line = line.replace(new RegExp(`\\%\\%(.+?)\\%${color.tag}\\%`, 'g'), `<span style='color:${color.hex}'>$1</span>`)
    }
    return line
}
export function highlightMdAuthor(line: string, author: string) {

    return line.replace(/%AUTHOR%/g, author)
}
export function highlightMdTimestamp(line: string, timestamp: string) {
    const ts = new Date(timestamp)
    const str = `${ts.toLocaleDateString()} ${ts.toISOString().slice(11, 16)}`
    return line.replace(/%TIMESTAMP%/g, str)
}

export function highlightFgClasses(line: string, classes: Array<{ tag: string; class: string }>) {
    for (const color of classes) {
        line = line.replace(new RegExp(`\\%\\%(.+?)\\%${color.tag}\\%`, 'g'), `<span class='round-span ${color.class}'>$1</span>`)
    }
    return line
}
export function formatPointsString(points: number) {
    const p10 = points % 10
    if (p10 === 1 && (points === 1 || points > 20)) {
        return `${points} очко`
    } else if (p10 > 1 && p10 < 5 && (points > 20 || points < 10)) {
        return `${points} очка`
    } else {
        return `${points} очков`
    }
}