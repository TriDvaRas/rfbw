import React, { useEffect } from 'react';
import { useState } from 'react';
import { IWheelItem } from '../../util/interfaces';
import useWindowDimensions from '../../util/useWindowDimensions';
import './wheel.css';
import $ from 'jquery'
import { Col } from 'react-bootstrap';
interface Props {
    item: IWheelItem;
    itemCount: number;
}
export default function WheelItemPreview(props: Props) {
    const { item, itemCount } = props
    
    const [previewHeight, setPreviewHeight] = useState(0)
    const [previewWidth, setPreviewWidth] = useState(0)
    const { height, width } = useWindowDimensions()
    useEffect(() => {
        setPreviewHeight($(`#wheel-preview-container`)?.outerHeight() || 0)
    }, [itemCount, height])
    useEffect(() => {
        setPreviewWidth($(`#wheel-preview-container`)?.outerWidth() || 0)
    }, [itemCount, width])


    const r = previewWidth
    const a = 2 * Math.PI / itemCount
    const h = 2 * r * Math.sin(a / 2)
    const H = h * r / Math.sqrt(r * r - h * h / 4)
    let maxSize = 900
    const wheelVars = {
        'top': `${-(previewHeight - h) / 2}px`,
        '--nb-item': 0,
        // '--rotate-for': `${rotForDeg}deg`,
        '--item-bg-height': `${H}px`,
        '--wheel-radius':`${r}px`
        // '--border-color': borderColor || 'white',
        // '--wheel-color': wheelColor || '#2b2744',
        // '--dot-color': dotColor || 'white',
        // '--pointer-color': pointerColor || 'white'
    };



    return (
        <Col style={{
            maxHeight: `${h}px`
        }}>
            <div className='py-auto' id='wheel-preview-container'>
                <div className='wheel-preview ' style={wheelVars}>
                    <div className="wheel-item-preview" key={item.id} style={
                        {
                            '--item-nb': 0,
                            'backgroundColor': `${item.altColor}`,
                            'backgroundImage': item.image ? `url('${item.image.startsWith(`blob`) ? '' : '/'}${item.image}')` : 'none',
                            'backgroundSize': item.imageMode === 'height' ? `auto ${Math.min(maxSize, h)}px` : `${r}px auto`,
                            'backgroundPositionY': 'center',
                            'color': item.fontColor,
                            'textShadow': '0px 0px 20px rgba(0,0,0,0.8)'
                        }
                    }>
                        {item.label}
                    </div>
                </div>
            </div>
        </Col>

    )
}

