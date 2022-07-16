import { Image } from "../database/db"

export function resolveImageFilePath(fileName: string, res?: 'comp' | 'preview') {
    if (fileName.startsWith('blob'))
        return fileName
    const a = fileName.split(`/`)
    fileName = a[a.length - 1]
    if (res)
        return `/uploads/${res}/${fileName}`
    return `/uploads/${fileName}`
}

export function getImageUrl(imagePreview?: Image, image?: Image) {
    if (image?.imageData)
        return `url(data:${image.mime};base64,${image.imageData})`
    if (imagePreview?.imageData)
        return `url(data:${imagePreview.mime};base64,${imagePreview.imageData})`
    return 'none'
}