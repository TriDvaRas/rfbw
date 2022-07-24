import { useRef, useState } from 'react';
import { Collapse, Spinner } from 'react-bootstrap';
import { useElementSize, useHover } from 'usehooks-ts';
import usePlayer from '../../data/usePlayer';
import useWheelItems from '../../data/useWheelItems';
import useWheelStats from '../../data/useWheelStats';
import { Wheel } from '../../database/db';
import { getTypeIcon } from '../../util/items';
import TheWheel from './TheWheel';
import LoadingDots from '../LoadingDots';

interface Props {
    wheel: Wheel,
    expandable?: boolean
    onClick?: () => void
    admin?: boolean
    withAuthor?: boolean
    height?: number
    gameId?: string
}
export default function WheelPreview(props: Props) {
    const { wheel, expandable, admin, onClick, withAuthor, height, gameId } = props
    const author = usePlayer(wheel.ownedById)
    const [squareRef, { width, }] = useElementSize()
    const hoverRef = useRef(null)
    const wheelStats = useWheelStats(wheel.id, gameId)
    const wheelItems = useWheelItems(expandable ? wheel.id : undefined)
    const fullHeight = height || 272
    const [showWheel, setShowWheel] = useState(false)
    return <div
        ref={squareRef}
        className={`my-3 p-0     ${onClick || expandable ? `darken-bg-on-hover` : ``}`}
        onClick={onClick || (() => setShowWheel(!showWheel))}
        style={{
            // height: size,
            width: '100%',
            borderRadius: '16px',
            overflow: 'hidden',
            cursor: onClick ? 'pointer' : undefined,
            textShadow: '#0008 0 0 7px',
            backgroundColor: wheel.backgroundColor,
            border: `3px solid ${wheel.borderColor}`,
            color: admin ? 'crimson' : undefined
        }}>
        <div className='d-flex'>
            <div className='flex-grow-1 me-1 m-3 px-2 d-flex align-items-start flex-column' style={{ zIndex: 15 }}>
                <h3 className='mb-0  '>{wheel.title}</h3>
                {withAuthor && author.player && <h5 className='my-0 ms-1 pe-4'>by {author.player.name}</h5>}
            </div>
            <div className='flex-grow-0 me-1 m-3 px-2 d-flex align-items-center ' style={{ zIndex: 18 }}>
                {
                    wheelStats.stats ?
                        <h3 className='mb-0 mx-2 '>
                            <span className='me-1'>{wheelStats.stats.completed ? `${wheelStats.stats.completed.games}/` : ''}{wheelStats.stats.total.games}</span>
                            {getTypeIcon('game')}
                        </h3>
                        : <Spinner animation='grow' variant='secondary' />
                }
                {
                    wheelStats.stats ?
                        <h3 className='mb-0 mx-2 '>
                            <span className='me-1'>{wheelStats.stats.completed ? `${wheelStats.stats.completed.movies}/` : ''}{wheelStats.stats.total.movies}</span>
                            {getTypeIcon('movie')}
                        </h3>
                        : <Spinner animation='grow' variant='secondary' />
                }
                {
                    wheelStats.stats ?
                        <h3 className='mb-0 mx-2 '>
                            <span className='me-1 ' style={{ fontSize: '100%' }}>{wheelStats.stats.completed ? `${wheelStats.stats.completed.series}/` : ''}{wheelStats.stats.total.series}</span>
                            {getTypeIcon('series')}
                        </h3>
                        : <Spinner animation='grow' variant='secondary' />
                }
                {
                    wheelStats.stats ?
                        <h3 className='mb-0 mx-2 '>
                            <span className='me-1'>{wheelStats.stats.completed ? `${wheelStats.stats.completed.animes}/` : ''}{wheelStats.stats.total.animes}</span>
                            {getTypeIcon('anime')}
                        </h3>
                        : <Spinner animation='grow' variant='secondary' />
                }
            </div>
        </div>
        {
            expandable && <Collapse
                in={showWheel}>
                <div
                    style={{
                        // marginTop: showWheel ? -32 : undefined
                    }}>
                    {wheelItems.wheelItems ?
                        <TheWheel
                            idleSpin
                            noArrow
                            noCard
                            items={wheelItems.wheelItems}
                            height={fullHeight}
                            wheel={wheel}
                        /> : <LoadingDots />
                    }
                </div>
            </Collapse>
        }
    </div >
}