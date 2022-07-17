import React from 'react';
import { Card } from 'react-bootstrap';
import { useElementSize } from 'usehooks-ts';
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
    const [squareRef, { width, height }] = useElementSize()
    const imagePreview = useImage(item.imageId || `58b2cad5-5ae6-47c2-8a6b-6e02aa18e874`, true)
    const image = useImage(item.imageId || `58b2cad5-5ae6-47c2-8a6b-6e02aa18e874`)
    const size = 240
    return (
        <div
            ref={squareRef}
            className={`m-3 d-flex text-light bg-dark ${onClick ? `darken-bg-on-hover` : ``}`}
            onClick={onClick}
            style={{
                height: size,
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: onClick ? 'pointer' : undefined,
                textShadow:'#0008 0 0 7px'
            }}>

            <div className='flex-grow-1 me-1 m-3 px-2 d-flex align-items-start flex-column' style={{ zIndex: 15 }}>
                <h2 className='mb-1 '>{item.label}</h2>
                <h5 style={{ textOverflow: 'ellipsis' }}>{item.title}</h5>
                {/* <div>{item.comments.slice(0,96)}</div> */}
                <h4 className='ms-2 mt-auto'>{item.hours}<i className="ms-2 bi bi-clock"></i></h4>
            </div>
            <div className=' m-3 ms-1 p-2 d-flex align-items-center flex-column justify-content-center' style={{ zIndex: 15 }}>
                <h4 className='ms-2 mt-2'>{getTypeIcon(item.type)}</h4>
                <h4 className='ms-2 '><i color={item.fontColor} className={`bi ${item.showText ? 'bi-square-fill' : 'bi-square'}`}></i></h4>
                <h4 className='ms-2 '><i className={`bi ${item.imageMode === 'height' ? 'bi-arrow-down-up' : 'bi-arrow-left-right'}`}></i></h4>
                <h4 className='ms-2 '><i className={`bi ${item.hasCoop && item.maxCoopPlayers > 1 || item.type !== 'game' ? 'bi-people' : 'bi-person'}`}></i></h4>
                <h4 className='ms-2 '><i className={`bi ${item.audioId ? 'bi-volume-down' : 'bi-volume-mute'}`}></i></h4>
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
                        backgroundImage: item.imageId ? getImageUrl(imagePreview.image, image.image) : undefined,
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
                backgroundImage: item.imageId ? getImageUrl(imagePreview.image, image.image) : undefined,
                WebkitMaskImage: '-webkit-gradient(linear, 0% top, 100% top, from(rgba(0, 0, 0, 0.1)), to(rgba(0, 0, 0, .23)))',
                filter: 'blur(5.5px)',
                maskImage: 'linear-gradient(to right, rgba(0,0,0,0.1), rgba(0,0,0,.23))',
            }}></div>
        </div>
    )
}


