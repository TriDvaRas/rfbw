import React from 'react'
import { Spinner } from 'react-bootstrap'

interface Props {
    variant?: string;
    count?: number;
    size?: 'sm';
    className?: string;
}
export default function LoadingDots(props: Props) {
    const spinners = []
    for (let i = 0; i < (props.count || 3); i++)
        spinners.push(<Spinner key={i} className='mx-2' animation="grow" size={props.size} variant={props.variant || "secondary"} />)
    return (
        <div className={`${props.className||``} text-center`}>
            {spinners}
        </div>
    )
}