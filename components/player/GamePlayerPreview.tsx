import useImage from '../../data/useImage';

import { GamePlayer } from '../../database/db';
import { getImageUrl } from '../../util/image';
import usePlayer from '../../data/usePlayer';
import LoadingDots from '../LoadingDots';
import PlayerPreview from './PlayerPreview';
interface Props {
    gamePlayer: GamePlayer
    height?: number
    onClick?: () => void;
}
export default function GamePlayerPreview(props: Props) {
    const player = usePlayer(props.gamePlayer.playerId)
    return player.player ? <PlayerPreview {...props} player={player.player} /> : <LoadingDots />
}