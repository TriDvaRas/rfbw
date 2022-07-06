import React, { useEffect, useState } from 'react';
import { Badge, OverlayTrigger, Popover } from 'react-bootstrap';
import { SketchPicker } from 'react-color';
import rgbHex from 'rgb-hex';
import { IColor } from '../../util/interfaces';

interface Props {
    defColor: IColor;
    onChange?: Function;
    onPicked?: Function;
    placement?: 'top' | 'left' | 'bottom' | 'right';
}
export default function ColorPicker(props: Props) {
    const { defColor, onChange, onPicked } = props
    const [color, setColor] = useState<IColor>(defColor)
    useEffect(() => {
        setColor(defColor)
    }, [defColor])
    function handleChange(newColor: { rgb: { r: number, g: number, b: number, a?: number } }) {
        let col = { rgb: newColor.rgb, hex: `#${rgbHex(newColor.rgb.r, newColor.rgb.g, newColor.rgb.b)}` }
        setColor(col)
        if (onChange)
            onChange(col)

    };
    function handleComplete(newState: boolean) {
        if (!newState && onPicked)
            onPicked(color)
    };



    const popover = <Popover id="color-picker" show={true}>
        <SketchPicker color={color.rgb} onChange={handleChange} />
    </Popover>
    return (<h2 style={{ marginTop: -3, marginBottom: 0 }}>
        <OverlayTrigger trigger="click" onToggle={handleComplete} rootClose placement={props.placement || 'right'} overlay={popover}>
            <Badge style={{ backgroundColor: color.hex, paddingTop: 7, paddingBottom: 7 }} className='border border-dark w-100' >{color.hex}</Badge>
        </OverlayTrigger>
    </h2 >
    )
}
// const { defColor, onChange, onPicked } = props
// const [color, setColor] = useState<IColor>(defColor)
// function handleChange(newColor: { rgb: { r: number, g: number, b: number, a?: number } }) {
//     let col = { rgb: newColor.rgb, hex: rgbHex(newColor.rgb.r, newColor.rgb.g, newColor.rgb.b) }
//     setColor(col)
//     if (onChange)
//         onChange(col)

// };
// function handleComplete(newState:boolean) {
//     if (!newState && onPicked)
//         onPicked(color)
// };



// const popover = <Popover id="color-picker" show={true}>
//     <SketchPicker color={color.rgb} onChange={handleChange}  />
// </Popover>
// return (
//     <OverlayTrigger trigger="click" onToggle={handleComplete} rootClose placement="right" overlay={popover}>
//         <Form.Control value={color.hex} style={{ backgroundColor: color.hex }} />
//     </OverlayTrigger>
// )
