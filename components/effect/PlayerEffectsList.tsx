import React from 'react';
import { Card } from 'react-bootstrap';
import { useElementSize } from 'usehooks-ts';
import useImage from '../../data/useImage';
import { WheelItem, Effect } from '../../database/db';
import { effectColors } from '../../util/highlightColors';
import { getImageUrl } from '../../util/image';
import { getEffectTypeIcon, getTypeIcon } from '../../util/items';
import { highlightFgClasses } from '../../util/lines';
import TheImage from '../image/TheImage';
import usePlayerEffectStates from '../../data/usePlayerEffects';
import LoadingDots from '../LoadingDots';
import EffectStatePreview from './EffectStatePreview';

interface Props {
    gameId: string
    playerId: string
}
export default function PlayerEffectsList(props: Props) {
    const { playerId, gameId } = props
    const playerEffects = usePlayerEffectStates(gameId,playerId)
    return (
        <div>
            <div className='px-3 d-flex flex-wrap'>
                {!playerEffects.states ? <LoadingDots /> : playerEffects.states?.map(x => <EffectStatePreview key={x.id} className='mb-3 me-2' effectState={x} />)}
            </div>
        </div>
    )
}


