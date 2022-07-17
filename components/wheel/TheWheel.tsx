import { useState } from 'react';
import { Card } from 'react-bootstrap';
import { useTimeout, useWindowSize } from 'usehooks-ts';
import { Wheel, WheelItem } from '../../database/db';
import TheWheelSlice from './TheWheelSlice';

interface Props {
    //! draw
    wheel: Wheel
    items: WheelItem[]
    disabledItemIds?: string[]
    onlyPreviewImages?: boolean
    height: number
    onItemClick?: (item: WheelItem) => void;
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

export default function TheWheel(props: Props) {
    const {
        wheel, items, idleSpin, height, onItemClick, withTitle, disabledItemIds, noCard, highlightItemId, onlyPreviewImages, noArrow,
        selectItemIndex, spinDuration, spin, prespin, extraSpin, autoSpinAfter
    } = props

    const { width } = useWindowSize()
    // const egg = useSelector(selectEggState) //TODO
    const [autoSpin, setAutoSpin] = useState(false)
    useTimeout(() => {
        setAutoSpin(true)
    }, autoSpinAfter || null)
    const isSpinning = autoSpin || spin ? 'spinning' : prespin ? 'prespinning' : '';
    const fullSpins = wheel.minimalSpin;

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
        '--border-color': wheel.borderColor,
        '--wheel-color': wheel.backgroundColor,
        '--dot-color': wheel.dotColor,
        '--pointer-color': wheel.pointerColor,
        // 'opacity': 0.6,
    };


    const wheelDiv = <div>
        {withTitle && wheel.title && <h2 className='text-center mb-3'>{wheel.title}</h2>}
        <div className={`wheel-container ${noArrow ? '' : 'wheel-container-with-arrow'}`} style={wheelVars}>
            <div className={`${idleSpin ? `inf-rotate` : ''} ${isSpinning} wheel`} style={wheelVars}>
                {items.map((item, index) => <TheWheelSlice
                    onlyPreviewImage={onlyPreviewImages}
                    key={item.id}
                    item={item}
                    index={index}
                    disabled={disabledItemIds?.includes(item.id) || (!!highlightItemId && item.id !== highlightItemId && (!autoSpinAfter || autoSpin))}
                    backgroundSize={item.imageMode === 'height' ? `auto ${Math.min(maxSize, H)}px` : `${scale * r}px auto`}
                    onClick={onItemClick}
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


