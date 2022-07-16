import React from 'react';
import { Card, Spinner } from 'react-bootstrap';
import useImage from '../../data/useImage';
import { WheelItem } from '../../database/db';
import { getImageUrl } from '../../util/image';
import TheImage from '../image/TheImage';

interface Props {
    onClick?: () => void;
    text?: string
    loading?: boolean
}
export default function WheelItemNewButton(props: Props) {
    const { onClick, text, loading } = props
    const size = 208
    return (
        <div className={`p-3 h-100 w-100 bg-dark-950`} onClick={loading ? undefined : onClick} style={{
            cursor: onClick && !loading ? 'pointer' : undefined,
            borderRadius: '16px',
            overflow: 'hidden',
        }}>
            <div style={{
                borderRadius: '16px',
                overflow: 'hidden',
            }}
                className={`bg-dark ${onClick && !loading ? 'darken-bg-on-hover' : ''}   fw-bold d-flex flex-column justify-content-center align-items-center w-100 h-100 text-shadow`}>
                <div>
                    {loading ?
                        <Spinner animation='border' /> :
                        <i className=" fs-1 bi bi-plus-lg text-shadow"></i>}
                </div>
                {text && <div className='mb-3' style={{ marginTop: '-.7em' }}>{text}</div>}
            </div>

        </div>
    )
}


