import React from 'react';
import { Card } from 'react-bootstrap';
import useImage from '../../data/useImage';
import { WheelItem } from '../../database/db';
import { getImageUrl } from '../../util/image';
import { getTypeIcon } from '../../util/items';
import TheImage from '../image/TheImage';

interface Props {
    onClick?: () => void;
    item: WheelItem;
}
export default function WheelItemPreview(props: Props) {
    const { onClick, item } = props
    const imagePreview = useImage(item.imageId || `58b2cad5-5ae6-47c2-8a6b-6e02aa18e874`, true)
    const image = useImage(item.imageId || `58b2cad5-5ae6-47c2-8a6b-6e02aa18e874`)
    const size = 240
    return (
        <div
            className={`m-3 d-flex text-light bg-dark ${onClick ? `darken-bg-on-hover` : ``}`}
            onClick={onClick}
            style={{
                height: size,
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: onClick ? 'pointer' : undefined
            }}>

            <div className='flex-grow-1 m-3 px-2 d-flex align-items-start flex-column'>
                <h2 className=' '>{item.label}</h2>
                <h5>{item.title}</h5>
                <div>{item.comments.slice(0,96)}</div>
                <h4 className='ms-2 mt-auto'>{item.hours}<i className="ms-2 bi bi-clock"></i></h4>
            </div>
            <div className=' m-3 p-2 d-flex align-items-start flex-column justify-content-center'>
                <h4 className='ms-2 '>{getTypeIcon(item.type)}</h4>
                <h4 className='ms-2 '><i color={item.fontColor} className={`bi ${item.showText ? 'bi-square-fill' : 'bi-square'}`}></i></h4>
                <h4 className='ms-2 '><i className={`bi ${item.imageMode === 'height' ? 'bi-arrow-down-up' : 'bi-arrow-left-right'}`}></i></h4>
                <h4 className='ms-2 '><i className={`bi ${item.hasCoop && item.maxCoopPlayers > 1 || item.type !== 'game' ? 'bi-people' : 'bi-person'}`}></i></h4>
                <h4 className='ms-2 '><i className={`bi ${item.audioId ? 'bi-volume-down' : 'bi-volume-mute'}`}></i></h4>
            </div>
            <div className={''} style={{
                backgroundPosition: 'center',
                height: `${size}px`,
                width: `${size}px`,
                backgroundSize: 'cover',
                backgroundImage: item.imageId ? getImageUrl(imagePreview.image, image.image) : undefined,
                WebkitMaskImage: '-webkit-gradient(linear, 0% top, 60% top, from(rgba(0, 0, 0, 0)), to(rgba(0, 0, 0, 1)))',
                maskImage: 'linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,1))',
                right: 0,
            }}></div>
        </div>
    )
}


