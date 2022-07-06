import React from 'react';
import '../../assets/scss/rect-img.sass';
interface Props {
    title: string;
    value: string;
}
export default function SingleStat(props: Props) {
    const { title, value } = props
    return (
        <div className='my-3'>
            <div className='fs-2'>
                {title}
            </div>
            <div className='fs-4' style={{ marginTop: '-15px' }}>
                {value}
            </div>
        </div>
    )
}
