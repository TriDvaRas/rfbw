import { contrastColor } from 'contrast-color';
import React, { useEffect, useState } from 'react';
import { Badge, OverlayTrigger, Popover } from 'react-bootstrap';
import { SketchPicker } from 'react-color';
import rgbHex from 'rgb-hex';

export interface IColor {
    rgb: {
        r: number;
        g: number;
        b: number;
        a?: number;
    };
    hex: string;
}
interface Props {
    defColor: IColor;
    onChange?: (color: IColor) => void;
    onPicked?: (color: IColor) => void;
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
    return (<OverlayTrigger trigger="click" onToggle={handleComplete} rootClose placement={props.placement || 'right'} overlay={popover}>
        <h4 className='w-100 text-center border border-dark shadow p-1'
            style={{
                fontFamily: 'Roboto Mono, monospace',
                fontWeight: 'bold',
                color: contrastColor({ bgColor: color.hex }),
                backgroundColor: color.hex,
                marginTop: -3,
                borderRadius: '11px'
            }}
        >
            {color.hex}
        </h4 >
    </OverlayTrigger>
    )
}