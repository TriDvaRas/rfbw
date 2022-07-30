
import { useElementSize } from 'usehooks-ts';
import useImage from '../../data/useImage';
import usePlayer from '../../data/usePlayer';
import usePlayerActiveTask from '../../data/usePlayerActiveTask';
import useWheelItem from '../../data/useWheelItem';
import { GamePlayer, GameEvent, Player, WheelItem, GameTask, Effect } from '../../database/db';
import { getImageUrl } from '../../util/image';
import PHCard from '../../util/PHCard';
import LoadingDots from '../LoadingDots';
import StatsWheelItemPreview from '../wheelItem/StatsWheelItemPreview';
import StatsWheelItemPreviewPH from '../wheelItem/StatsWheelItemPreviewPH';
import useGameTask from '../../data/useGameTask';
import { ReactElement } from 'react';
import ReactTimeago from 'react-timeago';
//@ts-ignore
import ruLocale from 'react-timeago/lib/language-strings/ru'
//@ts-ignore
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
import useTheEffect from '../../data/useTheEffect';
const formatter = buildFormatter(ruLocale)

interface Props {
    gameEvent: GameEvent
    height?: number
    onClick?: () => void;
    withTask?: boolean
    className?: string
}
export default function GameEventPreview(props: Props) {
    const { gameEvent, withTask, onClick } = props
    const [squareRef, { width, height }] = useElementSize()
    const _player = usePlayer(gameEvent.playerId)
    const _playerTask = useGameTask(gameEvent.taskId)
    const _playerEffect = useTheEffect(gameEvent.effectId)
    const _playerTaskWheelItem = useWheelItem(_playerTask.task?.wheelItemId)
    const player = _player.player
    const playerTask = _playerTask.task
    const effect = _playerEffect.effect
    const wheelItem = _playerTaskWheelItem.item
    const imagePreview = useImage(gameEvent?.imageId, true)
    const image = useImage(undefined)
    const size = props.height || 102
    console.log(player);
    console.log(effect);
    
    const [left, right] = getBlocks(gameEvent, player, playerTask, wheelItem, effect)

    return player && left && right ?
        <div
            ref={squareRef}
            className={`d-flex text-light bg-dark-850 ${onClick ? `darken-bg-on-hover` : ``} ${props.className ? props.className : ''}`}
            onClick={onClick}
            style={{
                height: size,
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: onClick ? 'pointer' : undefined,
                textShadow: '#0008 0 0 7px',
                border: getBorder(gameEvent.type)
            }}>


            {left}
            {right}

            <div className={`flex-shrink-0 w-100`} style={{
                zIndex: 14,
                right: 0,
                backgroundPosition: 'center',
                height: `${height}px`,
                width: `${width}px`,
                marginLeft: `-${width}px`,
                backgroundSize: 'cover',
                backgroundImage: player.imageId ? getImageUrl(imagePreview.image, image.image) : undefined,
                WebkitMaskImage: '-webkit-gradient(linear, 0% top, 100% top, from(rgba(0, 0, 0, 0.1)), to(rgba(0, 0, 0, .23)))',
                filter: 'blur(2.5px)',
                maskImage: 'linear-gradient(to right, rgba(0,0,0,0.1), rgba(0,0,0,.23))',
            }}></div>
        </div>
        : <LoadingDots />
}

function getBlocks(event: GameEvent, player?: Player, task?: GameTask, item?: WheelItem, effect?: Effect) {
    switch (event.type) {
        case 'contentEnd':
            return player && item && [
                <div key={1} className='ms-3 flex-grow-1 my-auto d-flex flex-column '>
                    <h5 className=''>
                        {player.name} <span style={{ fontSize: '80%' }}>завершил контент</span> {item.label}
                    </h5>
                    <ReactTimeago className='mt-auto' date={event.createdAt} formatter={formatter} />
                </div>,
                <div key={2} className='mx-3 d-flex my-auto flex-row'>
                    <h3 className='ms-1 my-auto'>{event.pointsDelta ? '+' : ''}</h3>
                    <h2 className='mb-0 mt-auto'>{event.pointsDelta || ''}</h2>
                </div>
            ] || []
        case 'contentDrop':
            return player && item && [
                <div key={1} className='ms-3 flex-grow-1 my-auto d-flex flex-column '>
                    <h5 className=''>
                        {player.name} <span style={{ fontSize: '80%' }}>дропнул контент</span> {item.label}
                    </h5>
                    <ReactTimeago className='mt-auto' date={event.createdAt} formatter={formatter} />
                </div>,
                <div key={2} className='mx-3 d-flex my-auto flex-row'>
                    <h3 className='ms-1 my-auto'>{event.pointsDelta ? '-' : ''}</h3>
                    <h2 className='mb-0 mt-auto'>{event.pointsDelta ? Math.abs(event.pointsDelta) : ''} </h2>
                </div>
            ] || []
        case 'contentSkip':
            return player && item && [
                <div key={1} className='ms-3 flex-grow-1 my-auto d-flex flex-column '>
                    <h5 className=''>
                        {player.name} <span style={{ fontSize: '80%' }}>рерольнул контент</span> {item.label}
                    </h5>
                    <ReactTimeago className='mt-auto' date={event.createdAt} formatter={formatter} />
                </div>,
                <></>
            ] || []
        case 'contentRoll':
            return player && item && [
                <div key={1} className='ms-3 flex-grow-1 my-auto d-flex flex-column '>
                    <h5 key={1} className=''>
                        {player.name} <span style={{ fontSize: '80%' }}>получил контент</span> {item.label}
                    </h5>
                    <ReactTimeago className='mt-auto' date={event.createdAt} formatter={formatter} />
                </div>,
                <></>
            ] || []
        case 'effectGained':
            return player && effect && [
                <div key={1} className='ms-3 flex-grow-1 my-auto d-flex flex-column '>
                    <h5 key={1} className=''>
                        {player.name} <span style={{ fontSize: '80%' }}>получил событие</span> {effect.title}
                    </h5>
                    <ReactTimeago className='mt-auto' date={event.createdAt} formatter={formatter} />
                </div>,
                <></>
            ] || []
        default:
            return [<>invalid eventType {event.type}</>, <></>]
    }
}
function getBorder(eventType: GameEvent['type']) {
    switch (eventType) {
        case 'contentEnd':
            return '1px solid #99ff0099'
        case 'contentRoll':
            return '1px solid #00ff8199'
        case 'contentSkip':
            return '1px solid #ff620099'
        case 'contentDrop':
            return '1px solid #ff000099'
        case 'effectGained':
            return '1px solid #38E1FF99'

        default:
            return undefined
    }
}