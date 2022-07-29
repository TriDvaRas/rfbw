import React from 'react';
import { Card } from 'react-bootstrap';
import { useElementSize } from 'usehooks-ts';
import useImage from '../../data/useImage';
import { WheelItem, Effect } from '../../database/db';
import { effectColors } from '../../util/highlightColors';
import { getImageUrl } from '../../util/image';
import { getTypeIcon } from '../../util/items';
import { highlightFgClasses } from '../../util/lines';
import TheImage from '../image/TheImage';

interface Props {
    onClick?: () => void;
    effect: Effect;
    className?: string;
    useFullImage?: boolean
}
export default function EffectPreview(props: Props) {
    const { onClick, effect, useFullImage } = props
    const [squareRef, { width, height }] = useElementSize()
    const imagePreview = useImage(effect.imageId, true)
    const image = useImage(useFullImage ? effect.imageId : undefined)
    const size = 240
    return (
        <div
            ref={squareRef}
            className={`m-3 d-flex text-light bg-dark ${onClick ? `darken-bg-on-hover` : ``} ${props.className ? props.className : ''}`}
            onClick={onClick}
            style={{
                height: size,
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: onClick ? 'pointer' : undefined,
                textShadow: '#0008 0 0 7px'
            }}>

            <div className='flex-grow-1 me-1 m-3 px-2 d-flex align-items-start flex-column' style={{ zIndex: 15 }}>
                <div className='d-flex w-100'>
                    <h2 className='mb-2 '>{effect.title}</h2>
                    <h2 className='mb-2 ms-auto'>{getTypeIcon(effect.type)}</h2>
                </div>
                <h5 style={{ textOverflow: 'ellipsis' }} dangerouslySetInnerHTML={{ __html: highlightFgClasses(effect.description, effectColors) }}></h5>
            </div>
            {
                width > size * 2.3 ?
                    <div className={`flex-shrink-0`} style={{
                        zIndex: 15,
                        right: 0,
                        backgroundPosition: 'center',
                        height: `${size}px`,
                        width: `${size}px`,
                        backgroundSize: 'cover',
                        backgroundImage: effect.imageId ? getImageUrl(imagePreview.image, image.image) : undefined,
                        WebkitMaskImage: '-webkit-gradient(linear, 0% top, 60% top, from(rgba(0, 0, 0, 0)), to(rgba(0, 0, 0, 1)))',
                        maskImage: 'linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,1))',
                    }}></div> : null
            }
            <div className={`flex-shrink-0`} style={{
                zIndex: 14,
                right: 0,
                backgroundPosition: 'center',
                height: `${size}px`,
                width: `${width}px`,
                marginLeft: `-${width}px`,
                backgroundSize: 'cover',
                backgroundImage: effect.imageId ? getImageUrl(imagePreview.image, image.image) : undefined,
                WebkitMaskImage: '-webkit-gradient(linear, 0% top, 100% top, from(rgba(0, 0, 0, 0.1)), to(rgba(0, 0, 0, .23)))',
                filter: 'blur(5.5px)',
                maskImage: 'linear-gradient(to right, rgba(0,0,0,0.1), rgba(0,0,0,.23))',
            }}></div>
        </div>
    )
}


