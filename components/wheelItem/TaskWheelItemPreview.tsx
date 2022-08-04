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
    height?: number
    showComments?: boolean
}
export default function TaskWheelItemPreview(props: Props) {
    const { onClick, item, height, showComments } = props

    const [squareRef, { width, height: elHeight }] = useElementSize()
    const imagePreview = useImage(item.imageId, true)
    const image = useImage(item.imageId)
    const size = height || 240
    return (
        <div>
            <div
                ref={squareRef}
                className={`d-flex text-light bg-dark ${onClick ? `darken-bg-on-hover` : ``} ${props.className ? props.className : ''}`}
                onClick={onClick}
                style={{
                    'zIndex': 3,
                    height: size,
                    borderRadius: '16px',
                    overflow: 'hidden',
                    cursor: onClick ? 'pointer' : undefined,
                    textShadow: '#0008 0 0 7px'
                }}>

                <div className='flex-grow-1 me-1 m-3 px-2 d-flex align-items-start flex-column' style={{ zIndex: 15 }}>
                    <h2 className='mb-1 '>{item.label}</h2>
                    <h5 style={{ textOverflow: 'ellipsis' }}>{item.title}</h5>
                    {/* <div>{item.comments.slice(0,96)}</div> */}
                    <div className='d-flex mt-auto'>
                        <h4 className='ms-2 '>{getTypeIcon(item.type)}</h4>
                        <h4 className='ms-2 '><i className={`bi ${item.hasCoop && item.maxCoopPlayers > 1 || item.type !== 'game' ? 'bi-people' : 'bi-person'}`}></i></h4>
                        <h4 className='ms-4 '>{item.hours}<i className="ms-1 bi bi-clock"></i></h4>

                    </div>
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
            {showComments && (item.comments || item.endCondition) && <div
                ref={squareRef}
                className={` text-light bg-dark `}
                onClick={onClick}
                style={{
                    'zIndex': 0,
                    borderRadius: '16px',
                    overflow: 'hidden',
                    cursor: onClick ? 'pointer' : undefined,
                    textShadow: '#0008 0 0 7px',
                    marginTop: '-16px',
                    paddingTop: '16px',
                    marginLeft: '16px',
                    marginRight: '16px',
                }}>
                {item.comments && <div className='p-2 px-3'>
                    <b className='ms-1'>Комментарий:</b>
                    <div className=''>{item.comments}</div>
                    </div>}
                {item.endCondition && <div className='p-2 px-3'>
                    <b className='ms-1'>Условие завершения:</b>
                    <div className=''>{item.endCondition}</div>
                    </div>}
            </div>}
        </div>
    )
}


