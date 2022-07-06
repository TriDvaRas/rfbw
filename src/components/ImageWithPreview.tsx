import React from 'react';
import { Image, OverlayTrigger, Tooltip } from 'react-bootstrap';

interface Props {
    imageKey: string;
    src: string;
    size: number;
}
export default function ImageWithPreview(props: Props) {
    const { imageKey, src, size } = props
    return (
        <OverlayTrigger
            key={imageKey}
            placement='auto'
            overlay={
                <Tooltip id={`tooltip-${imageKey}`} style={{ opacity: 1 }}>
                    <Image
                        src={src}
                        className='my-1'
                        fluid
                        onError={(e: any) => { e.target.onerror = null; e.target.src = "/errorAvatar.jpg" }}
                    />
                </Tooltip>
            }
        >
            <div className='rect-img-container' style={{ width: size, height: size, left: '0px' }}>
                <Image
                    src={src}
                    roundedCircle
                    width={size}
                    height={size}
                    className='my-1 rect-img'
                    onError={(e: any) => { e.target.onerror = null; e.target.src = "/errorAvatar.jpg" }}
                />
            </div>
        </OverlayTrigger>
    )
}