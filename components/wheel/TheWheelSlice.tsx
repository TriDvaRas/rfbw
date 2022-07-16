import { Card } from 'react-bootstrap';
import { useWindowSize } from 'usehooks-ts';
import useImage from '../../data/useImage';
import { Image, Wheel, WheelItem } from '../../database/db';
import { getImageUrl } from '../../util/image';

interface Props {
    item: WheelItem
    onClick?: (item: WheelItem) => void;
    index: number
    disabled?: boolean
    backgroundSize: string
    onlyPreviewImage?: boolean
}

export default function TheWheelSlice(props: Props) {
    const { item, onClick, index, disabled, backgroundSize, onlyPreviewImage } = props
    const imagePreview = useImage(item.imageId || `58b2cad5-5ae6-47c2-8a6b-6e02aa18e874`, true)
    const image = useImage(item.imageId || `58b2cad5-5ae6-47c2-8a6b-6e02aa18e874`, onlyPreviewImage)
    return <div className={`wheel-item ${onClick ? `darken-on-hover${item.imageId && imagePreview.image && !image.image ? '-blurred' : ''}` : ''} `} onClick={() => onClick && onClick(item)} style={{
        'cursor': onClick ? 'pointer' : undefined,
        //@ts-ignore
        '--item-nb': index,
        'backgroundColor': `${item.altColor}`,
        'backgroundImage': item.imageId ?
            getImageUrl(imagePreview.image, image.image)
            : 'none',
        backgroundSize,// 
        filter: !onClick && item.imageId && imagePreview.image && !image.image ? 'blur(8px)' : undefined,
        'backgroundPositionY': 'center',
        'color': disabled ? `${item.fontColor}55` : item.fontColor,
        'textShadow': '0px 0px 20px rgba(0,0,0,0.8)',
        'boxShadow': disabled ? `inset 0 0 0 1000px ${item.altColor}da` : `none`
    }}>
        {item.showText ? item.label : ''}
    </div>
}




