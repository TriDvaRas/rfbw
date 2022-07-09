export function resolveImageFilePath(fileName: string, res?: 'comp' | 'preview') {
    if (fileName.startsWith('blob'))
        return fileName
    const a = fileName.split(`/`)
    fileName = a[a.length - 1]
    if (res)
        return `/uploads/${res}/${fileName}`
    return `/uploads/${fileName}`
}