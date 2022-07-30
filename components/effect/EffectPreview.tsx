import React from 'react';
import { Card } from 'react-bootstrap';
import { useElementSize } from 'usehooks-ts';
import useImage from '../../data/useImage';
import { WheelItem, Effect } from '../../database/db';
import { effectColors } from '../../util/highlightColors';
import { getImageUrl } from '../../util/image';
import { getEffectTypeIcon, getTypeIcon } from '../../util/items';
import { highlightFgClasses } from '../../util/lines';
import TheImage from '../image/TheImage';

interface Props {
    onClick?: () => void;
    effect: Effect;
    className?: string;
    useFullImage?: boolean;
    shadow?: boolean
}
export default function EffectPreview(props: Props) {
    const { onClick, effect, useFullImage, shadow } = props
    const [squareRef, { width, height }] = useElementSize()
    const imagePreview = useImage(effect.imageId, true)
    const image = useImage(useFullImage ? effect.imageId : undefined)
    const size = 'auto'
    return (
        <div
            ref={squareRef}
            className={` d-flex text-light bg-dark ${onClick ? `darken-bg-on-hover` : ``} border effect-border-${effect.type}  ${props.className ? props.className : ''}`}
            onClick={onClick}
            style={{
                height: size,
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: onClick ? 'pointer' : undefined,
                textShadow: '#0008 0 0 7px',
                boxShadow: shadow ? ' #0007 0 0 15px' : undefined,
            }}>

            <div className='flex-grow-1 me-1 m-3 px-2 d-flex align-items-start flex-column' style={{ zIndex: 15 }}>
                <div className='d-flex w-100' style={{ whiteSpace: 'nowrap' }}>
                    <h2 className='mb-2 me-2'>{effect.title}</h2>
                    <h2 className='mb-2 ms-auto me-2'>{getEffectTypeIcon(effect.type)}</h2>
                </div>
                <h5 style={{ textOverflow: 'ellipsis' }} dangerouslySetInnerHTML={{ __html: highlightFgClasses(effect.description, effectColors) }}></h5>
            </div>
            <div className={`flex-shrink-0`} style={{
                zIndex: 14,
                right: 0,
                backgroundPosition: 'center',
                height: `auto`,
                width: `${width}px`,
                marginLeft: `-${width}px`,
                backgroundSize: 'cover',
                backgroundImage: effect.imageId ? getImageUrl(imagePreview.image, image.image) : undefined,
                WebkitMaskImage: '-webkit-gradient(linear, 0% top, 100% top, from(rgba(0, 0, 0, 0.23)), to(rgba(0, 0, 0, .23)))',
                filter: 'blur(5.5px)',
                maskImage: 'linear-gradient(to right, rgba(0,0,0,0.23), rgba(0,0,0,.23))',
            }}></div>
        </div >
    )
}


