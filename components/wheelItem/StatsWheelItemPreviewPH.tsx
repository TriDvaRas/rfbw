import React from 'react';
import { Card } from 'react-bootstrap';
import { useElementSize } from 'usehooks-ts';
import useImage from '../../data/useImage';
import { WheelItem } from '../../database/db';
import { getImageUrl } from '../../util/image';
import { getTypeIcon } from '../../util/items';
import TheImage from '../image/TheImage';
import useWheelItem from '../../data/useWheelItem';
import PHCard from '../../util/PHCard';

interface Props {
    onClick?: () => void;
    className?: string
}
export default function StatsWheelItemPreviewPH(props: Props) {
    const { onClick, } = props

    const [squareRef, { width, height }] = useElementSize()
    const imagePreview = useImage('3a2a482d-0bd0-42cf-a02b-7772d562f939', true)
    const image = useImage()
    const size = height || 'auto'
    return (
        <div
            ref={squareRef}
            className={`d-flex text-light bg-dark ${onClick ? `darken-bg-on-hover` : ``} ${props.className ? props.className : ''}`}
            onClick={onClick}
            style={{
                height: size,
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: onClick ? 'pointer' : undefined,
                textShadow: '#0008 0 0 7px'
            }}>

            <div className='flex-grow-1 me-1 m-3 px-2 d-flex align-items-start flex-row' style={{ zIndex: 15 }}>
                <div className='my-auto'><h3 className='mb-1' style={{ textOverflow: 'ellipsis' }}>Contentless</h3></div>
            </div>
            {
                width > height * 2.3 ?
                    <div className={`flex-shrink-0`} style={{
                        zIndex: 15,
                        right: 0,
                        backgroundPosition: 'center',
                        height: `${size}px`,
                        width: `${size}px`,
                        backgroundSize: 'cover',
                        backgroundImage: getImageUrl(imagePreview.image, image.image),
                        WebkitMaskImage: '-webkit-gradient(linear, 0% top, 10% top, from(rgba(0, 0, 0, 0)), to(rgba(0, 0, 0, .9)))',
                        maskImage: 'linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,.9))',
                    }}></div> : null
            }
            {/* <div className={`flex-shrink-0`} style={{
                zIndex: 14,
                right: 0,
                backgroundPosition: 'center',
                height: `${size}`,
                width: `${width}px`,
                marginLeft: `-${width}px`,
                backgroundSize: 'cover',
                backgroundImage: getImageUrl(imagePreview.image, image.image),
                WebkitMaskImage: '-webkit-gradient(linear, 0% top, 100% top, from(rgba(0, 0, 0, 0.1)), to(rgba(0, 0, 0, .23)))',
                filter: 'blur(5.5px)',
                maskImage: 'linear-gradient(to right, rgba(0,0,0,0.1), rgba(0,0,0,.23))',
            }}></div> */}
        </div>
    )
}


