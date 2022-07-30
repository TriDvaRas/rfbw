import { useState } from 'react';
import { Card } from 'react-bootstrap';
import { useTimeout, useWindowSize } from 'usehooks-ts';
import { effectsConfig } from '../../config';
import { GameEffectWithEffect, WheelItem } from '../../database/db';
import TheEffectsWheelSlice from './TheEffectsWheelSlice';

interface Props {
    //! draw
    items: GameEffectWithEffect[]
    height: number
    idleSpin?: boolean;
    withTitle?: boolean
    noCard?: boolean
    noArrow?: boolean

    //! spin
    selectItemIndex?: number;
    spinDuration?: number
    spin?: boolean;
    prespin?: boolean;
    extraSpin?: number;
    highlightItemId?: string
    autoSpinAfter?: number
}

export default function TheEffectsWheel(props: Props) {
    const {
        items, idleSpin, height, withTitle, noCard, highlightItemId, noArrow,
        selectItemIndex, spinDuration, spin, prespin, extraSpin, autoSpinAfter
    } = props
    const { width } = useWindowSize()
    // const egg = useSelector(selectEggState) //TODO
    const [autoSpin, setAutoSpin] = useState(false)
    useTimeout(() => {
        setAutoSpin(true)
    }, autoSpinAfter || null)
    const isSpinning = autoSpin || spin ? 'spinning' : prespin ? 'prespinning' : '';
    const fullSpins = effectsConfig.fullSpins;

    const wheelSize = 800
    const itemDegr = 360 / props.items.length
    const r = wheelSize / 2
    const h = wheelSize * Math.sin(Math.PI / props.items.length)
    const H = h * r / Math.sqrt(r * r - h * h / 4)
    let rotForDeg = 360 * (fullSpins || 5) - itemDegr * (selectItemIndex || 0)
    let maxSize = Math.min(width - 96, height)
    let scale = maxSize / wheelSize
    rotForDeg += itemDegr * (extraSpin || 0)
    const wheelVars: any = {
        '--nb-item': props.items.length,
        '--rotate-for': `${rotForDeg}deg`,
        '--spinning-duration': `${spinDuration || 5}s`,
        '--wheel-size': `${withTitle ? wheelSize - 62 : wheelSize}px`,
        '--item-bg-height': `${H}px`,
        '--scale-factor': scale,
        // '--border-color': 'white',
        '--wheel-color': '#A9E508',
        '--dot-color': '#A9E508',
        '--pointer-color': '#DB095D',
        // 'opacity': 0.6,
    };


    const wheelDiv = <div>
        <div className={`wheel-container wheel-effects ${noArrow ? '' : 'wheel-container-with-arrow'}`} style={wheelVars}>
            <div className={`${idleSpin ? `inf-rotate` : ''} wheel-effects ${isSpinning} wheel`} style={wheelVars}>
                {items.map((item, index) => <TheEffectsWheelSlice
                    onlyPreviewImage={true}
                    key={item.id}
                    item={item.effect}
                    index={index}
                    backgroundSize={`${scale * r}px auto`}
                />)}
            </div>
        </div>
    </div>

    if (noCard)
        return wheelDiv

    return (
        <Card
            bg='dark'
            text='light'
            className="m-3  wheel-card"
            border={"dark"}
        >
            <Card.Body className="p-3">
                {wheelDiv}
            </Card.Body>
        </Card>

    )
}


