import React from 'react';
import { Card, Spinner } from 'react-bootstrap';
import { useElementSize } from 'usehooks-ts';
import useImage from '../../data/useImage';
import { WheelItem, Game } from '../../database/db';
import { getImageUrl } from '../../util/image';
import { getTypeIcon } from '../../util/items';
import TheImage from '../image/TheImage';
import useGameStats from '../../data/useGameStats';

interface Props {
    onClick?: () => void;
    game: Game;
}
export default function GamePreview(props: Props) {
    const { onClick, game } = props
    const [squareRef, { width, height }] = useElementSize()
    const imagePreview = useImage(game.imageId, true)
    const image = useImage(game.imageId)
    const gameStats = useGameStats(game.id)
    return (
        <div
            ref={squareRef}
            className={`m-3 d-flex text-light bg-dark ${onClick ? `darken-bg-on-hover` : ``}`}
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
                <h2 className='mb-0  '>{game.name}</h2>
            </div>
            <div className='flex-grow-0 me-1 m-3 px-2 d-flex align-items-start flex-column' style={{ zIndex: 15 }}>
                {
                    gameStats.stats ?
                        <h2 className='mb-0 ms-2 '>{gameStats.stats.players}<i className='ms-1 bi bi-people'></i></h2>
                        : <Spinner animation='grow' variant='secondary' />
                }
            </div>
            <div className='flex-grow-0 me-1 m-3 px-2 d-flex align-items-start flex-column' style={{ zIndex: 15 }}>
                {
                    gameStats.stats ?
                        <h2 className='mb-0 ms-2 '>{gameStats.stats.wheels}<i className='ms-1 bi bi-circle'></i></h2>
                        : <Spinner animation='grow' variant='secondary' />
                }
            </div>
            <div className='flex-grow-0 me-1 m-3 px-2 d-flex align-items-start flex-column me-5' style={{ zIndex: 15 }}>
                {
                    gameStats.stats ?
                        <h2 className='mb-0 ms-2 '>{gameStats.stats.wheelItems}<i className='ms-1 bi bi-pie-chart'></i></h2>
                        : <Spinner animation='grow' variant='secondary' />
                }
            </div>

            <div className={`flex-shrink-0`} style={{
                zIndex: 14,
                right: 0,
                backgroundPosition: 'center',
                height: `${height}px`,
                width: `${width}px`,
                marginLeft: `-${width}px`,
                backgroundSize: 'cover',
                backgroundImage: game.imageId ? getImageUrl(imagePreview.image, image.image) : undefined,
                WebkitMaskImage: '-webkit-gradient(linear, 0% top, 100% top, from(rgba(0, 0, 0, 0.3)), to(rgba(0, 0, 0, .3)))',
                filter: 'blur(7.5px)',
                maskImage: 'linear-gradient(to right, rgba(0,0,0,0.3), rgba(0,0,0,.3))',
            }}></div>
        </div>
    )
}


