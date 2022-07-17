import React, { useRef, useState } from 'react';
import {
    Alert,
    Button, Card, Col, Collapse, Form, Modal, Row, Spinner
} from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import TextareaAutosize from 'react-textarea-autosize';
import { User, Player, Image, Wheel } from '../../database/db';
import usePlayer from '../../data/usePlayer';
import LoadingDots from '../LoadingDots';
import { useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { ApiError } from '../../types/common-api';
import ImageUpload from '../ImageUpload';
import { parseApiError } from '../../util/error';
import TheWheel from './TheWheel';
import useWheelItems from '../../data/useWheelItems';
import { useHover } from 'usehooks-ts';

interface Props {
    wheel: Wheel,
    fullImages?: boolean
    onClick?: () => void
    admin?: boolean
    withAuthor?: boolean
    height?: number
}
export default function WheelPreview(props: Props) {
    const { wheel, fullImages, admin, onClick, withAuthor, height } = props
    const author = usePlayer(wheel.ownedById)
    const hoverRef = useRef(null)
    const isHover = useHover(hoverRef)

    const wheelItems = useWheelItems(wheel.id)
    const fullHeight = height || 272
    return <div className='p-3 d-flex align-items-center justify-content-center '
        onClick={onClick}
        ref={hoverRef}
        style={{
            cursor: onClick ? 'pointer' : '',
            height: fullHeight + 46,
            padding: 'auto',
            // backgroundColor: onClick && isHover ? '#0002' : '',
        }}>
        <Card bg='dark' text='light'
            className='d-flex align-middle '
            style={{
                borderColor: admin ? 'red' : undefined,
                width: 'auto',
                marginRight: '-1.5em',
                boxShadow: onClick && isHover ? '0 0 7px 0 #fff4' : '',
            }}>
            <Card.Body>
                <h3 className='my-0 pe-4'>{wheel.title}</h3>
                {withAuthor && author.player && <h5 className='my-0 ms-1 pe-4'>by {author.player.name}</h5>}
            </Card.Body>
        </Card>
        <div
            style={{
                // boxShadow: onClick && isHover ? '0 0 7px 0 #fff4' : '',
            }}>
            {wheelItems.wheelItems ?
                <TheWheel
                    idleSpin
                    noArrow
                    noCard
                    items={wheelItems.wheelItems}
                    height={fullHeight}
                    wheel={wheel}
                /> : <LoadingDots />
            }
        </div>

    </div>
}