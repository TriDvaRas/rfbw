
import { useElementSize } from 'usehooks-ts';
import useImage from '../../data/useImage';
import usePlayer from '../../data/usePlayer';
import usePlayerActiveTask from '../../data/usePlayerActiveTask';
import useWheelItem from '../../data/useWheelItem';
import { GamePlayer } from '../../database/db';
import { getImageUrl } from '../../util/image';
import PHCard from '../../util/PHCard';
import LoadingDots from '../LoadingDots';
import StatsWheelItemPreview from '../wheelItem/StatsWheelItemPreview';
import StatsWheelItemPreviewPH from '../wheelItem/StatsWheelItemPreviewPH';
interface Props {
    gamePlayer: GamePlayer
    height?: number
    onClick?: () => void;
    withTask?: boolean
    className?: string
}
export default function GamePlayerStats(props: Props) {
    const { gamePlayer, withTask, onClick } = props
    const [squareRef, { width, height }] = useElementSize()
    const _player = usePlayer(gamePlayer.playerId)
    const _playerTask = usePlayerActiveTask(gamePlayer.gameId, gamePlayer.playerId)
    const _playerTaskWheelItem = useWheelItem(_playerTask.task == 'none' ? undefined : _playerTask.task?.wheelItemId)
    const player = _player.player
    const playerTask = _playerTask.task
    const wheelItem = _playerTaskWheelItem.item
    const imagePreview = useImage(player?.imageId, true)
    const image = useImage(undefined)
    const size = props.height || 230
    return player && (playerTask || !withTask) ?
        <div
            ref={squareRef}
            className={`d-flex text-light bg-dark-850 ${onClick ? `darken-bg-on-hover` : ``} ${props.className ? props.className : ''}`}
            onClick={onClick}
            style={{
                // height: 70,
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: onClick ? 'pointer' : undefined,
                textShadow: '#0008 0 0 7px'
            }}>

            {
                width > size * 2.3 ?
                    <div className={`flex-shrink-0`} style={{
                        zIndex: 15,
                        right: 0,
                        backgroundPosition: 'center',
                        height: `${height}px`,
                        width: `${height}px`,
                        backgroundSize: 'cover',
                        backgroundImage: player.imageId ? getImageUrl(imagePreview.image, image.image) : undefined,
                        WebkitMaskImage: '-webkit-gradient(linear, 100% top, 100% top, from(rgba(0, 0, 0, 0)), to(rgba(0, 0, 0, 1)))',
                        maskImage: 'linear-gradient(to left, rgba(0,0,0,0), rgba(0,0,0,1))',
                        borderRadius: '16px',
                    }}></div> : null
            }
            <h2 className='ms-2 flex-grow-1 my-auto'>{player.name}</h2>
            {/* <h5 style={{ textOverflow: 'ellipsis' }}>{player.about}</h5> */}
            {/* <div>{item.comments.slice(0,96)}</div> */}
            <div className='ms-5 d-flex my-auto flex-row'>
                <h1 className='mb-0 mt-auto'>{gamePlayer.points} </h1>
                <h5 className='ms-1 mb-1 mt-auto'>pts</h5>
            </div>
            <div className='  me-1  px-2 d-flex align-items-start flex-column justify-content-center' style={{ zIndex: 15, fontSize: '50%' }}>


                {/* <h4 className='ms-2 mt-2'>{getTypeIcon(item.type)}</h4>
                <h4 className='ms-2 '><i style={{ color: item.fontColor }} className={`bi ${item.showText ? 'bi-square-fill' : 'bi-square'}`}></i></h4>
                <h4 className='ms-2 '><i className={`bi ${item.imageMode === 'height' ? 'bi-arrow-down-up' : 'bi-arrow-left-right'}`}></i></h4>
                <h4 className='ms-2 '><i className={`bi ${item.hasCoop && item.maxCoopPlayers > 1 || item.type !== 'game' ? 'bi-people' : 'bi-person'}`}></i></h4>
                <h4 className='ms-2 '><i className={`bi ${item.audioId ? 'bi-volume-down' : 'bi-volume-mute'}`}></i></h4> */}
            </div>
            <div className='flex-grow-0 w-50 align-items-center justify-content-center d-flex flex-column'>
                <div className='w-100 '>
                    {playerTask == 'none' ?
                        <StatsWheelItemPreviewPH /> :
                        wheelItem && <StatsWheelItemPreview item={wheelItem} />}
                </div>
            </div>
            {/* <div className={`flex-shrink-0`} style={{
                zIndex: 14,
                right: 0,
                backgroundPosition: 'center',
                height: `${height}px`,
                width: `${width}px`,
                marginLeft: `-${width}px`,
                backgroundSize: 'cover',
                backgroundImage: player.imageId ? getImageUrl(imagePreview.image, image.image) : undefined,
                WebkitMaskImage: '-webkit-gradient(linear, 0% top, 100% top, from(rgba(0, 0, 0, 0.1)), to(rgba(0, 0, 0, .23)))',
                filter: 'blur(5.5px)',
                maskImage: 'linear-gradient(to right, rgba(0,0,0,0.1), rgba(0,0,0,.23))',
            }}></div> */}
        </div>
        : <LoadingDots />
}