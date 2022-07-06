import React from 'react';
import { Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { IWheelItem } from '../../util/interfaces';
import useWindowDimensions from '../../util/useWindowDimensions';
import { selectEggState } from '../egg/eggSlice';
import './wheel.css';
interface Props {
    items: Array<IWheelItem>;
    spinning?: boolean;
    title?: string;
    height: number;
    onSelectItem?: Function;
    onItemClick?: Function;
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
function Wheel(props: Props) {
    const { title, items, height, spinning, extraSpin, borderColor, wheelColor, dotColor, pointerColor, onItemClick, selectItemId, spin, prespin, spinDuration, fullSpins } = props
    const { width } = useWindowDimensions()
    const egg = useSelector(selectEggState)

    function _onItemClick(item: IWheelItem) {
        if (onItemClick)
            onItemClick(item)
    }

    const wheelSize = 800
    const itemDegr = 360 / props.items.length
    const r = wheelSize / 2
    const h = wheelSize * Math.sin(Math.PI / props.items.length)
    const H = h * r / Math.sqrt(r * r - h * h / 4)
    let rotForDeg = 360 * (fullSpins || 5) - itemDegr * (selectItemId || 0)
    let maxSize = Math.min(width - 96, height)
    let scale = maxSize / wheelSize
    rotForDeg += itemDegr * (extraSpin || 0)
    const wheelVars = {
        '--nb-item': props.items.length,
        '--rotate-for': `${rotForDeg}deg`,
        '--spinning-duration': `${spinDuration || 5}s`,
        '--wheel-size': `${title ? wheelSize - 48 : wheelSize}px`,
        '--item-bg-height': `${H}px`,
        '--scale-factor': scale,
        '--border-color': borderColor || 'white',
        '--wheel-color': wheelColor || '#2b2744',
        '--dot-color': dotColor || 'white',
        '--pointer-color': pointerColor || 'white'
    };
    const isSpinning = spin ? 'spinning' : prespin ? 'prespinning' : '';
    return (
        <Card
            bg='dark'
            text='light'
            className="m-3  wheel-card"
            border={"dark"}
        >

            <Card.Body className="p-3">
                <h2 className='text-center'>{title}</h2>
                <div className={` ${egg && !spin ? "wheel-container-egg" : "wheel-container"} `} style={wheelVars}>
                    <div className={`${egg ? 'wheel-egg' : 'wheel'} ${!spinning || `${egg ? 'inf-rotate-egg' : 'inf-rotate'}`} ${isSpinning} `} style={wheelVars}>
                        {items.map((item, index) => (
                            <div className="wheel-item" key={index} onClick={() => _onItemClick(item)} style={
                                {
                                    'cursor': onItemClick ? 'pointer' : 'default',
                                    '--item-nb': index,
                                    'backgroundColor': `${item.altColor}`,
                                    'backgroundImage': item.image ? `url('${item.image.startsWith(`blob`) ? '' : '/'}${item.image}')` : 'none',
                                    'backgroundSize': item.imageMode === 'height' ? `auto ${Math.min(maxSize, H)}px` : `${scale * r}px auto`,
                                    'backgroundPositionY': 'center',
                                    'color': item.disabled === true ? `${item.fontColor}55` : item.fontColor,
                                    'textShadow': '0px 0px 20px rgba(0,0,0,0.8)',
                                    'boxShadow': item.disabled === true ? `inset 0 0 0 1000px ${item.altColor}da` : `none`
                                }
                            }>
                                {item.label}
                            </div>
                        ))}
                    </div>
                </div>
            </Card.Body>
        </Card>

    )
}


export default Wheel;
