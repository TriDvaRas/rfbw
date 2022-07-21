import React from 'react';

interface Props {
    onClick: () => void;
    text?: string;
}
export default function NewButton(props: Props) {
    const { onClick, text } = props
    return (
        <div className={`h-100 w-100 bg-dark-950`} onClick={onClick} style={{ cursor: 'pointer' }}>
            <div className='darken-bg-on-hover border border-secondary  fw-bold d-flex flex-column justify-content-center align-items-center w-100 h-100 text-shadow'>
                <div><i className=" fs-1 bi bi-plus-lg text-shadow"></i></div>
                {text && <div className='mb-3' style={{ marginTop: '-.7em' }}>{text}</div>}
            </div>

        </div>
    )
}


