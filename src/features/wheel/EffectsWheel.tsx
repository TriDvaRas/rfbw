import React from 'react';
import { Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { shuffle } from '../../util/arrays';
import { IEffect, IWheelItem } from '../../util/interfaces';
import useWindowDimensions from '../../util/useWindowDimensions';
import { selectEggState } from '../egg/eggSlice';
import './wheel.css';
import './effectswheel.css';
interface Props {
    items: Array<IEffect>;
    spinning?: boolean;
    height: number;
    borderColor?: string;
    wheelColor?: string;
    dotColor?: string;
    pointerColor?: string;
    selectItemId?: number;
    spinDuration?: number;
    fullSpins?: number;
    spin?: boolean;
    prespin?: boolean;
    extraSpin?: number;
}
function EffectsWheel(props: Props) {
    const { items, height, spinning, extraSpin, borderColor, wheelColor, dotColor, pointerColor, selectItemId, spin, prespin, spinDuration, fullSpins } = props
    const { width } = useWindowDimensions()
    const egg = useSelector(selectEggState)


    const wheelSize = 800
    const itemDegr = 360 / props.items.length
    let rotForDeg = 360 * (fullSpins || 5) - itemDegr * (selectItemId || 0)
    const maxSize = Math.min(width - 96, height)
    const scale = maxSize / wheelSize
    rotForDeg += itemDegr * (extraSpin || 0)
    const r = wheelSize / 2
    const h = wheelSize * Math.sin(Math.PI / props.items.length)
    const H = h * r / Math.sqrt(r * r - h * h / 4)
    const wheelVars = {
        '--nb-item': props.items.length,
        '--rotate-for': `${rotForDeg}deg`,
        '--spinning-duration': `${spinDuration || 5}s`,
        '--wheel-size': `${wheelSize}px`,
        '--item-bg-height': `${H}px`,
        '--scale-factor': scale,
        '--border-color': '#0000',
        '--wheel-border-size': '12px',
        '--wheel-color': wheelColor || '#2b2744',
        '--dot-color': dotColor || 'white',
        '--pointer-color': pointerColor || 'white'
    };
    const isSpinning = spin ? 'spinning' : prespin ? 'prespinning' : '';
    function getEffectColor(effect: IEffect) {
        if (effect.isCard) return `linear-gradient(340deg, #0C5BA4 0%, #17c0b8 75%)`
        if (effect.isNegative) return `linear-gradient(340deg, #C41879 0%, #b81352 75%)`
        if (effect.isPositive) return `linear-gradient(340deg, #069557 0%, #13D7A7 75%)`
        if (effect.isSecret) return `linear-gradient(340deg, #A98A0F 0%, #EBC632 75%)`
        return `linear-gradient(340deg, #4B334F 0%, #624D66 75%)`
    }
    return (
        <Card
            bg='dark'
            text='light'
            className="m-3  wheel-card"
            border={"dark"}
        >

            <Card.Body className="p-3">
                <div className={`${egg && !spin ? "wheel-container-egg" : "wheel-container"} `} style={wheelVars}>
                    <div className={`${egg ? 'wheel-egg' : 'wheel'} wheel-effects ${!spinning || `${egg ? 'inf-rotate-egg' : 'inf-rotate'}`} ${isSpinning} `} style={wheelVars}>
                        {(items).map((effect, index) => (
                            <div className="wheel-item " key={index} style={
                                {
                                    '--item-nb': index,
                                    'backgroundImage': `${getEffectColor(effect)}`,
                                    'textShadow': '0px 0px 20px rgba(0,0,0,0.8)',
                                    'fontSize': effect.title.length > 9 && !effect.isSecret ? '1.5em' : '2.1em'
                                }
                            }>
                                {effect.isSecret ? `Не Секрет` : effect.title}
                            </div>
                        ))}
                    </div>
                </div>
            </Card.Body>
        </Card>

    )
}


export default EffectsWheel;
