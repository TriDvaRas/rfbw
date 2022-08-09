
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
    const _agressorPlayer = usePlayer(gameEvent.vars?.agressorId)
    const _playerTask = useGameTask(gameEvent.taskId)
    const _playerEffect = useTheEffect(gameEvent.effectId)
    const _playerTaskWheelItem = useWheelItem(_playerTask.task?.wheelItemId)
    const player = _player.player
    const agressor = _agressorPlayer.player
    const playerTask = _playerTask.task
    const effect = _playerEffect.effect
    const wheelItem = _playerTaskWheelItem.item
    const imagePreview = useImage(gameEvent?.imageId, true)
    const image = useImage(undefined)

    const [left, right] = getBlocks(gameEvent, player, playerTask, wheelItem, effect, agressor)

    return player && left && right ?
        <div
            ref={squareRef}
            className={`d-flex text-light bg-dark-850 w-100 ${onClick ? `darken-bg-on-hover` : ``} ${props.className ? props.className : ''}`}
            onClick={onClick}
            style={{
                // height: size,
                borderRadius: '16px',
                // minWidth: '100%',
                overflow: 'hidden',
                cursor: onClick ? 'pointer' : undefined,
                textShadow: '#0008 0 0 7px',
                border: getBorder(gameEvent, effect)
            }}>
            <div className={`my-2 w-100`}>
                {left}
            </div>
            {right || <div></div>}

            <div className={`flex-shrink-0 w-100`} style={{
                zIndex: 14,
                right: 0,
                backgroundPosition: 'center',
                minHeight: `100%`,
                minWidth: `105%`,
                overflow: 'hidden',
                marginLeft: `-${width}px`,
                backgroundSize: 'cover',
                backgroundImage: player.imageId ? getImageUrl(imagePreview.image, image.image) : undefined,
                WebkitMaskImage: '-webkit-gradient(linear, 0% top, 100% top, from(rgba(0, 0, 0, 0.1)), to(rgba(0, 0, 0, .23)))',
                filter: 'blur(2.5px)',
                maskImage: 'linear-gradient(to right, rgba(0,0,0,0.1), rgba(0,0,0,.23))',
            }}> </div>
        </div>
        : <LoadingDots />
}

function getBlocks(event: GameEvent, player?: Player, task?: GameTask, item?: WheelItem, effect?: Effect, agressor?: Player) {
    switch (event.type) {
        case 'contentEnd':
            return player && item && [
                <div key={1} className='mx-3 flex-grow-1 my-auto d-flex flex-column '>
                    <h5 className=''>
                        {player.name} <span style={{ fontSize: '80%' }}>завершил контент</span> {item.label}
                    </h5>
                    <ReactTimeago className='mt-auto' date={event.createdAt} formatter={formatter} />
                </div>,
                <div key={2} className=' d-flex my-auto flex-row'>
                    <h3 className='ms-1 my-auto'>{event.pointsDelta ? '+' : ''}</h3>
                    <h2 className='mb-0 mt-auto'>{event.pointsDelta || ''}</h2>
                </div>
            ] || []
        case 'contentEndCoop':
            return player && item && [
                <div key={1} className='mx-3 flex-grow-1 my-auto d-flex flex-column '>
                    <h5 className=''>
                        {player.name} <span style={{ fontSize: '80%' }}>завершил кооп контент</span> {item.label}
                    </h5>
                    <ReactTimeago className='mt-auto' date={event.createdAt} formatter={formatter} />
                </div>,
                <div key={2} className=' d-flex my-auto flex-row'>
                    <h3 className='ms-1 my-auto'>{event.pointsDelta ? '+' : ''}</h3>
                    <h2 className='mb-0 mt-auto'>{event.pointsDelta || ''}</h2>
                </div>
            ] || []
        case 'contentDrop':
            return player && item && [
                <div key={1} className='mx-3 flex-grow-1 my-auto d-flex flex-column '>
                    <h5 className=''>
                        {player.name} <span style={{ fontSize: '80%' }}>дропнул контент</span> {item.label}
                    </h5>
                    <ReactTimeago className='mt-auto' date={event.createdAt} formatter={formatter} />
                </div>,
                <div key={2} className=' d-flex my-auto flex-row'>
                    <h3 className='ms-1 my-auto'>{event.pointsDelta ? '-' : ''}</h3>
                    <h2 className='mb-0 mt-auto'>{event.pointsDelta ? Math.abs(event.pointsDelta) : ''} </h2>
                </div>
            ] || []
        case 'contentSkip':
            return player && item && [
                <div key={1} className='mx-3 flex-grow-1 my-auto d-flex flex-column '>
                    <h5 className=''>
                        {player.name} <span style={{ fontSize: '80%' }}>рерольнул контент</span> {item.label}
                    </h5>
                    <ReactTimeago className='mt-auto' date={event.createdAt} formatter={formatter} />
                </div>,
                <></>
            ] || []
        case 'contentRoll':
            return player && item && [
                <div key={1} className='mx-3 flex-grow-1 my-auto d-flex flex-column '>
                    <h5 key={1} className=''>
                        {player.name} <span style={{ fontSize: '80%' }}>получает контент</span> {item.label}
                    </h5>
                    <ReactTimeago className='mt-auto' date={event.createdAt} formatter={formatter} />
                </div>,
                <></>
            ] || []
        case 'effectGained':
            return player && effect && [
                <div key={1} className='mx-3 flex-grow-1 my-auto d-flex flex-column '>
                    <h5 key={1} className=''>
                        {player.name} <span style={{ fontSize: '80%' }}>попадает на событие</span> {effect.title}
                    </h5>
                    <ReactTimeago className='mt-auto' date={event.createdAt} formatter={formatter} />
                </div>,
                event.pointsDelta ? <div key={2} className=' d-flex my-auto flex-row'>
                    <h3 className='ms-1 my-auto'>{event.pointsDelta > 0 ? '+' : '-'}</h3>
                    <h2 className='mb-0 mt-auto'>{Math.abs(event.pointsDelta) || ''}</h2>
                </div> : <></>
            ] || []
        case 'effectLost':
            return player && effect && [
                <div key={1} className='mx-3 flex-grow-1 my-auto d-flex flex-column '>
                    <h5 key={1} className=''>
                        {player.name} <span style={{ fontSize: '80%' }}>теряет эффект</span> {effect.title}
                    </h5>
                    <ReactTimeago className='mt-auto' date={event.createdAt} formatter={formatter} />
                </div>,
                <div key={2} className=' d-flex my-auto flex-row'>
                    <h3 className='ms-1 my-auto'>{event.pointsDelta ? '+' : ''}</h3>
                    <h2 className='mb-0 mt-auto'>{event.pointsDelta || ''}</h2>
                </div>
            ] || []
        case 'effectPointsAdd':
            return player && effect && [
                <div key={1} className='mx-3 flex-grow-1 my-auto d-flex flex-column '>
                    <h5 key={1} className=''>
                        {player.name} <span style={{ fontSize: '80%' }}>получает очки за эффект</span> {effect.title}
                    </h5>
                    <ReactTimeago className='mt-auto' date={event.createdAt} formatter={formatter} />
                </div>,
                <div key={2} className=' d-flex my-auto flex-row'>
                    <h3 className='ms-1 my-auto'>{event.pointsDelta ? '+' : ''}</h3>
                    <h2 className='mb-0 mt-auto'>{event.pointsDelta || ''}</h2>
                </div>
            ] || []
        case 'effectPointsRemove':
            return player && effect && [
                <div key={1} className='mx-3 flex-grow-1 my-auto d-flex flex-column '>
                    <h5 key={1} className=''>
                        {player.name} <span style={{ fontSize: '80%' }}>теряет очки за эффект</span> {effect.title}
                    </h5>
                    <ReactTimeago className='mt-auto' date={event.createdAt} formatter={formatter} />
                </div>,
                <div key={2} className=' d-flex my-auto flex-row'>
                    <h3 className='ms-1 my-auto'>{event.pointsDelta ? '+' : ''}</h3>
                    <h2 className='mb-0 mt-auto'>{event.pointsDelta || ''}</h2>
                </div>
            ] || []
        case 'contentJoinCoop':
            return player && item && [
                <div key={1} className='mx-3 flex-grow-1 my-auto d-flex flex-column '>
                    <h5 className=''>
                        {player.name} <span style={{ fontSize: '80%' }}>присоединился к коопу</span> {item.label}
                    </h5>
                    <ReactTimeago className='mt-auto' date={event.createdAt} formatter={formatter} />
                </div>,
                <div key={2} className='me-3 d-flex my-auto flex-row'>
                    <h3 className='ms-1 my-auto'>{event.pointsDelta ? '-' : ''}</h3>
                    <h2 className='mb-0 mt-auto'>{event.pointsDelta ? Math.abs(event.pointsDelta) : ''} </h2>
                </div>
            ] || []
        case 'contentLeaveCoop':
            return player && item && [
                <div key={1} className='mx-3 flex-grow-1 my-auto d-flex flex-column '>
                    <h5 className=''>
                        {player.name} <span style={{ fontSize: '80%' }}>покинул кооп</span> {item.label}
                    </h5>
                    <ReactTimeago className='mt-auto' date={event.createdAt} formatter={formatter} />
                </div>,
                <div key={2} className='me-3 d-flex my-auto flex-row'>
                    <h3 className='ms-1 my-auto'>{event.pointsDelta ? '-' : ''}</h3>
                    <h2 className='mb-0 mt-auto'>{event.pointsDelta ? Math.abs(event.pointsDelta) : ''} </h2>
                </div>
            ] || []
        case 'shootSuccess':
            return player && [
                <div key={1} className='mx-3 flex-grow-1 my-auto d-flex flex-column '>
                    <h5 className=''>
                        {player.name} <span style={{ fontSize: '80%' }}><s>продал револьвер</s>😳 нажимает на курок, но ничего не происходит</span>
                    </h5>
                    <ReactTimeago className='mt-auto' date={event.createdAt} formatter={formatter} />
                </div>,
                <div key={2} className='me-3 d-flex my-auto flex-row'>
                    <h3 className='ms-1 my-auto'>{event.pointsDelta ? '+' : ''}</h3>
                    <h2 className='mb-0 mt-auto'>{event.pointsDelta ? Math.abs(event.pointsDelta) : ''} </h2>
                </div>
            ] || []
        case 'shootSkip':
            return player && [
                <div key={1} className='mx-3 flex-grow-1 my-auto d-flex flex-column '>
                    <h5 className=''>
                        {player.name} <span style={{ fontSize: '80%' }}>зассал и не выстрелил</span>
                    </h5>
                    <ReactTimeago className='mt-auto' date={event.createdAt} formatter={formatter} />
                </div>,
                <div key={2} className='me-3 d-flex my-auto flex-row'>
                    <h3 className='ms-1 my-auto'>{event.pointsDelta ? '+' : ''}</h3>
                    <h2 className='mb-0 mt-auto'>{event.pointsDelta ? Math.abs(event.pointsDelta) : ''} </h2>
                </div>
            ] || []
        case 'shootDeath':
            return player && [
                <div key={1} className='mx-3 flex-grow-1 my-auto d-flex flex-column '>
                    <h5 className=''>
                        {player.name} <span style={{ fontSize: '80%' }}>застрелился😢 и получает эффект</span> Touch Grass
                    </h5>
                    <ReactTimeago className='mt-auto' date={event.createdAt} formatter={formatter} />
                </div>,
                <div key={2} className='me-3 d-flex my-auto flex-row'>

                </div>
            ] || []
        case 'effectApplied':
            return player && effect && agressor && [
                <div key={1} className='mx-3 flex-grow-1 my-auto d-flex flex-column '>
                    <h5 className=''>
                        {agressor.name} <span style={{ fontSize: '80%' }}>применяет эффект</span> {effect.title} <span style={{ fontSize: '80%' }}>на игрока</span> {player.name}
                    </h5>
                    <ReactTimeago className='mt-auto' date={event.createdAt} formatter={formatter} />
                </div>,
                event.pointsDelta ? <div key={2} className=' d-flex my-auto flex-row'>
                    <h3 className='ms-1 my-auto'>{event.pointsDelta > 0 ? '+' : '-'}</h3>
                    <h2 className='mb-0 mt-auto'>{Math.abs(event.pointsDelta) || ''}</h2>
                </div> : <></>
            ] || []
        case 'effectAppliedGood':
        case 'effectAppliedBad':
            return player && effect && agressor && [
                <div key={1} className='mx-3 flex-grow-1 my-auto d-flex flex-column '>
                    <h5 className=''>
                        {player.name} <span style={{ fontSize: '80%' }}>получает событие</span> {effect.title} <span style={{ fontSize: '80%' }}>от игрока</span> {agressor.name}
                    </h5>
                    <ReactTimeago className='mt-auto' date={event.createdAt} formatter={formatter} />
                </div>,
                event.pointsDelta ? <div key={2} className=' d-flex my-auto flex-row'>
                    <h3 className='ms-1 my-auto'>{event.pointsDelta > 0 ? '+' : '-'}</h3>
                    <h2 className='mb-0 mt-auto'>{Math.abs(event.pointsDelta) || ''}</h2>
                </div> : <></>
            ] || []
        case 'rollDiceSuccess':
            return player && effect && agressor && [
                <div key={1} className='mx-3 flex-grow-1 my-auto d-flex flex-column '>
                    <h5 className=''>
                        {player.name} <span style={{ fontSize: '80%' }}>ставит на {event.vars?.guess.lenght == 1 ? `число` : `числа`} </span> {event.vars?.guess.join(', ')} <span style={{ fontSize: '80%' }}>и выпадает</span> {event.vars?.result}
                    </h5>
                    <ReactTimeago className='mt-auto' date={event.createdAt} formatter={formatter} />
                </div>,
                event.pointsDelta ? <div key={2} className=' d-flex my-auto flex-row'>
                    <h3 className='ms-1 my-auto'>{event.pointsDelta > 0 ? '+' : '-'}</h3>
                    <h2 className='mb-0 mt-auto'>{Math.abs(event.pointsDelta) || ''}</h2>
                </div> : <></>
            ] || []
        case 'rollDiceFail':
            return player && effect && agressor && [
                <div key={1} className='mx-3 flex-grow-1 my-auto d-flex flex-column '>
                    <h5 className=''>
                        {player.name} <span style={{ fontSize: '80%' }}>ставит на {event.vars?.guess.lenght == 1 ? `число` : `числа`} </span> {event.vars?.guess.join(', ')} <span style={{ fontSize: '80%' }}>но выпадает</span> {event.vars?.result}
                    </h5>
                    <ReactTimeago className='mt-auto' date={event.createdAt} formatter={formatter} />
                </div>,
                event.pointsDelta ? <div key={2} className=' d-flex my-auto flex-row'>
                    <h3 className='ms-1 my-auto'>{event.pointsDelta > 0 ? '+' : '-'}</h3>
                    <h2 className='mb-0 mt-auto'>{Math.abs(event.pointsDelta) || ''}</h2>
                </div> : <></>
            ] || []
        case 'rollDiceSkip':
            return player && effect && agressor && [
                <div key={1} className='mx-3 flex-grow-1 my-auto d-flex flex-column '>
                    <h5 className=''>
                        {player.name} <span style={{ fontSize: '80%' }}>зассал и не учавствует в рулетке </span>
                    </h5>
                    <ReactTimeago className='mt-auto' date={event.createdAt} formatter={formatter} />
                </div>,
                <></>
            ] || []
        default:
            return [<>invalid eventType {event.type}</>, <>Sex Jopa</>]
    }
}
function getBorder(event: GameEvent, effect?: Effect) {
    switch (event.type) {
        case 'contentEnd':
        case 'contentEndCoop':
            return '1px solid #99ff0099'
        case 'contentRoll':
            return '1px solid #00ff8199'
        case 'contentSkip':
            return '1px solid #ff620099'
        case 'contentDrop':
            return '1px solid #ff000099'
        case 'effectGained':
            if (!event.pointsDelta) {
                if (!effect)
                    return '1px solid #38E1FF99'
                if (effect.type == 'positive')
                    return '1px solid #99ff0099'
                else if (effect.type == 'negative')
                    return '1px solid #ff000099'
                else
                    return '1px solid #DE7D1699'
            }
            if (event.pointsDelta > 0)
                return '1px solid #99ff0099'
            else
                return '1px solid #ff000099'
        case 'rollDiceSuccess':
        case 'rollDiceFail':
            if (!event.pointsDelta)
                return '1px solid #38E1FF99'
            if (event.pointsDelta > 0)
                return '1px solid #99ff0099'
            else
                return '1px solid #ff000099'
        case 'rollDiceSkip':
            return '1px solid #FF38AD99'
        case 'effectLost':
            return '1px solid #00FF7299'
        case 'contentJoinCoop':
            return '1px solid #b8dFf899'
        case 'contentLeaveCoop':
            return '1px solid #FF38AD99'
        case 'shootSuccess':
            return '1px solid #00FF7299'
        case 'shootDeath':
            return '1px solid #ff000099'
        case 'shootSkip':
            return '1px solid #FF38AD99'
        case 'effectApplied':
            if (!effect)
                return '1px solid #38E1FF99'
            if (effect.type == 'positive')
                return '1px solid #99ff0099'
            else if (effect.type == 'negative')
                return '1px solid #ff000099'
            else
                return '1px solid #DE7D1699'
        case 'effectAppliedGood':
            return '1px solid #99ff0099'
        case 'effectAppliedBad':
            return '1px solid #ff000099'
        default:
            return undefined
    }
}