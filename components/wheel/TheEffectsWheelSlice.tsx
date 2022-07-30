import { Card } from 'react-bootstrap';
import { useWindowSize } from 'usehooks-ts';
import useImage from '../../data/useImage';
import { Image, Wheel, WheelItem, Effect } from '../../database/db';
import { getImageUrl } from '../../util/image';

interface Props {
    item: Effect
    onClick?: (item: Effect) => void;
    index: number
    backgroundSize: string
    onlyPreviewImage?: boolean
}

export default function TheEffectsWheelSlice(props: Props) {
    const { item, onClick, index, backgroundSize, onlyPreviewImage } = props
    const imagePreview = useImage(item.imageId, true)
    const image = useImage(onlyPreviewImage ? item.imageId : undefined)
    return <div>
        <div key={1} className={`wheel-item ${onClick ? `darken-on-hover${item.imageId && imagePreview.image && !image.image ? '-blurred' : ''}` : ''} `} onClick={() => onClick && onClick(item)} style={{
            'cursor': onClick ? 'pointer' : undefined,
            //@ts-ignore
            '--item-nb': index,
            'backgroundImage': item.imageId ?
                getImageUrl(imagePreview.image, image.image)
                : getEffectColor(item.type),
            backgroundSize,// 
            filter: !onClick && item.imageId && imagePreview.image && !image.image ? 'blur(8px) brightness(70%) ' : undefined,
            'backgroundPositionY': 'center',
        }}>
        </div >
        <div key={2} className={`wheel-item  ${onClick ? `darken-on-hover${item.imageId && imagePreview.image && !image.image ? '-blurred' : ''}` : ''} `} onClick={() => onClick && onClick(item)} style={{
            'cursor': onClick ? 'pointer' : undefined,
            //@ts-ignore
            '--item-nb': index,
            zIndex: 100,
            'backgroundPositionY': 'center',
            'color': 'white',
            'textShadow': '0px 0px 10px rgba(0,0,0,0.8)',
        }}>
            {item.title}
        </div >
    </div>
}
function getEffectColor(type: Effect['type']) {
    switch (type) {
        case 'positive':
            return `linear-gradient(340deg, #0D9F60 0%, #13D7A7 75%)`
        case 'neutral':
            return `linear-gradient(340deg, #543E1F 0%, #9E6719 75%)`
        case 'negative':
            return `linear-gradient(340deg, #8F215F 0%, #C7175A 75%)`
        case 'card':
            return `linear-gradient(340deg, #0C5BA4 0%, #17c0b8 75%)`
        case 'secret':
            return `linear-gradient(340deg, #A98A0F 0%, #EBC632 75%)`
        case 'system':
            return `linear-gradient(340deg, #561A60 0%, #922FA3 75%)`

        default:
            return `linear-gradient(340deg, #0000 0%, #0000 75%)`
    }
}




