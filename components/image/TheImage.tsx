import axios, { AxiosError } from 'axios';
import React, { useState } from 'react';
import {
    Card, Form, Image as ReactImage, ProgressBar,
} from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import { resolveImageFilePath } from '../../util/image';
import { ApiError } from '../../types/common-api';
import { Image } from '../../database/db';
import useImage from '../../data/useImage';
import LoadingDots from '../LoadingDots';

interface Props {
    container: 'card' | 'raw'
    imageId: string
}
export default function TheImage(props: Props) {
    const { container, imageId } = props
    const image = useImage(imageId, true)
    const imageFull = useImage(imageId)
    if (imageFull.image)
        return (
            <Card.Img
                className='rect-img'
                variant="top"
                src={`data:${imageFull.image.mime};base64,${imageFull.image.imageData}`}
            // onError={(e: any) => { e.target.onerror = null; e.target.src = "/errorAvatar.jpg" }}
            />
        )
    if (image.image)
        return (
            <Card.Img
                style={{ filter: 'blur(16px)' }}
                className='rect-img '
                variant="top"
                src={`data:${image.image.mime};base64,${image.image.imageData}`}
            // onError={(e: any) => { e.target.onerror = null; e.target.src = "/errorAvatar.jpg" }}
            />
        )
    return (
        <LoadingDots className='rect-img'/>
        // <Card.Img
        //     // style={{ opacity: 0 }}
        //     className='rect-img'
        //     variant="top"
        //     src={`/errorAvatar.jpg`}
        // />
    )
}