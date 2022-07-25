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
    item: WheelItem;
    className?: string
    fromCoop?: boolean
}
export default function StatsWheelItemPreview(props: Props) {
    const { onClick, item, fromCoop } = props

    const [squareRef, { width, height }] = useElementSize()
    const imagePreview = useImage(item.imageId, true)
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
                <div className='my-auto'><h3 className='mb-1' style={{ textOverflow: 'ellipsis' }}>{item.label}</h3></div>
                {/* <div>{item.comments.slice(0,96)}</div> */}
                <h4 className='ms-4 my-auto '>{getTypeIcon(item.type)}</h4>
                <h4 className='ms-2 my-auto  me-auto' style={{ color: fromCoop ? '#d6ec20' : undefined }}><i className={`bi ${item.hasCoop && item.maxCoopPlayers > 1 || item.type !== 'game' ? 'bi-people' : 'bi-person'}`}></i></h4>
                <h4 className='ms-2 my-auto '>{item.hours}<i className="ms-1 bi bi-clock"></i></h4>
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
                        backgroundImage: item.imageId ? getImageUrl(imagePreview.image, image.image) : undefined,
                        WebkitMaskImage: '-webkit-gradient(linear, 0% top, 60% top, from(rgba(0, 0, 0, 0)), to(rgba(0, 0, 0, .9)))',
                        maskImage: 'linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,.9))',
                    }}></div> : null
            }
            <div className={`flex-shrink-0`} style={{
                zIndex: 14,
                right: 0,
                backgroundPosition: 'center',
                height: `${size}`,
                width: `${width}px`,
                marginLeft: `-${width}px`,
                backgroundSize: 'cover',
                backgroundImage: item.imageId ? getImageUrl(imagePreview.image, image.image) : undefined,
                WebkitMaskImage: '-webkit-gradient(linear, 0% top, 100% top, from(rgba(0, 0, 0, 0.1)), to(rgba(0, 0, 0, .23)))',
                filter: 'blur(5.5px)',
                maskImage: 'linear-gradient(to right, rgba(0,0,0,0.1), rgba(0,0,0,.23))',
            }}></div>
        </div>
    )
}


