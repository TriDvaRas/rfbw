import React from 'react';
import {
    Card, Table
} from 'react-bootstrap';
import useImage from '../../data/useImage';

import { Player } from '../../database/db';
import { getImageUrl } from '../../util/image';
import TheImage from '../image/TheImage';
import TheImagePlaceholder from '../image/TheImagePlaceholder';
import SingleStat from './SingleStat';
interface Props {
    player: Player
    height?: number
    onClick?: () => void;
}
export default function PlayerPreview(props: Props) {
    const { player, onClick, height } = props
    // const [squareRef, { width, height }] = useElementSize()
    const imagePreview = useImage(player.imageId, true)
    const image = useImage(player.imageId)
    const size = height || 240
    return <div
        // ref={squareRef}
        className={`my-3 p-0 d-flex text-light bg-dark ${onClick ? `darken-bg-on-hover` : ``}`}
        onClick={onClick}
        style={{
            // height: size,
            width: '100%',
            borderRadius: '16px',
            overflow: 'hidden',
            cursor: onClick ? 'pointer' : undefined,
            textShadow: '#0008 0 0 7px'
        }}>

        <div className='flex-grow-1 me-1 m-3 px-2 d-flex align-items-start flex-column' style={{ zIndex: 15 }}>
            <h2 className='mb-0  '>{player.name}</h2>
        </div>
        {/* <div className='flex-grow-0 me-1 m-3 px-2 d-flex align-items-start flex-column' style={{ zIndex: 15 }}>
            {
                gameStats.stats ?
                    <h2 className='mb-0 ms-2 '>{gameStats.stats.players}<i className='ms-1 bi bi-people'></i></h2>
                    : <Spinner animation='grow' variant='secondary' />
            }
        </div>
       */}

        <div className={`flex-shrink-0`} style={{
            zIndex: 14,
            // right: 0,
            backgroundPosition: 'center',
            height: `${size}px`,
            width: `100%`,
            // height: `${height}px`,
            // width: `${width}px`,
            // marginLeft: `-${width}px`,
            backgroundSize: 'cover',
            backgroundImage: player.imageId ? getImageUrl(imagePreview.image, image.image) : undefined,
            WebkitMaskImage: '-webkit-gradient(linear, 0% top, 100% top, from(rgba(0, 0, 0, 0.3)), to(rgba(0, 0, 0, .3)))',
            filter: 'blur(7.5px)',
            maskImage: 'linear-gradient(to right, rgba(0,0,0,0.3), rgba(0,0,0,.3))',
        }}></div>
    </div>
}