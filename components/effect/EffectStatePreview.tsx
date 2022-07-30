import React from 'react';
import { Card, OverlayTrigger, Popover } from 'react-bootstrap';
import { useElementSize } from 'usehooks-ts';
import useImage from '../../data/useImage';
import { WheelItem, Effect, GameEffectState } from '../../database/db';
import { effectColors } from '../../util/highlightColors';
import { getImageUrl } from '../../util/image';
import { getTypeIcon, getEffectTypeIcon } from '../../util/items';
import { highlightFgClasses } from '../../util/lines';
import TheImage from '../image/TheImage';
import useTheEffect from '../../data/useTheEffect';
import LoadingDots from '../LoadingDots';
import EffectPreview from './EffectPreview';

interface Props {
    onClick?: () => void;
    effectState: GameEffectState;
    className?: string;
    useFullImage?: boolean
}
export default function EffectStatePreview(props: Props) {
    const { onClick, effectState, useFullImage } = props
    const [squareRef, { width, height }] = useElementSize()
    const _effect = useTheEffect(effectState.effectId)
    const effect = _effect.effect
    const imagePreview = useImage(effect?.imageId, true)
    const image = useImage(useFullImage ? effect?.imageId : undefined)
    return (!effect ? <LoadingDots /> :
        <OverlayTrigger  placement="bottom" overlay={
            <Popover id={effect.id}
                style={{
                    backgroundColor: '#0000',
                    borderColor: '#0000',
                    padding: 0,
                    maxWidth: 'none',
                }}>
                <EffectPreview effect={effect} shadow />
            </Popover>}
        >
            < div
                ref={squareRef}
                className={` d-flex text-light bg-dark ${onClick ? `darken-bg-on-hover` : ``} border effect-border-${effect.type} ${props.className ? props.className : ''}`}
                onClick={onClick}
                style={{
                    borderRadius: '16px',
                    overflow: 'hidden',
                    cursor: onClick ? 'pointer' : undefined,
                    textShadow: '#0008 0 0 7px'
                }}>

                <div className='flex-grow-1 mx-1 my-2 px-2 d-flex align-items-start flex-column' style={{ zIndex: 15 }}>
                    <div className='d-flex w-100'>
                        <h4 className='mb-0 '>{effect.title}</h4>
                        <h4 className='mb-0 ms-2 '>{getEffectTypeIcon(effect.type)}</h4>
                    </div>
                    {/* <p style={{ textOverflow: 'ellipsis' }} dangerouslySetInnerHTML={{ __html: highlightFgClasses(effect.description, effectColors) }}></p> */}
                </div>
                <div className={`flex-shrink-0`} style={{
                    zIndex: 14,
                    right: 0,
                    backgroundPosition: 'center',
                    height: `auto`,
                    width: `100%`,
                    marginLeft: `-100%`,
                    backgroundSize: 'cover',
                    backgroundImage: effect.imageId ? getImageUrl(imagePreview.image, image.image) : undefined,
                    WebkitMaskImage: '-webkit-gradient(linear, 0% top, 100% top, from(rgba(0, 0, 0, 0.1)), to(rgba(0, 0, 0, .23)))',
                    filter: 'blur(5.5px)',
                    maskImage: 'linear-gradient(to right, rgba(0,0,0,0.1), rgba(0,0,0,.23))',
                }}></div>
            </div >
        </OverlayTrigger>

    )
}


