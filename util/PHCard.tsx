import axios, { AxiosError } from 'axios';
import React, { useState } from 'react';
import {
    Card, Form, Image as ReactImage, ProgressBar,
} from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import { resolveImageFilePath } from '../util/image';
import { ApiError } from '../types/common-api';
import { Audio, Image } from '../database/db';
import { parseApiError } from '../util/error';
import useAudio from '../data/useAudio';
import LoadingDots from '../components/LoadingDots';

interface Props {
    height: number | string
    loading?: boolean
    children?: React.ReactNode | React.ReactNode[]
    opacity?: number
    borderRadius?: number | string
    className?: string
}
export default function PHCard(props: Props) {

    return <Card style={{
        height: props.height,
        opacity: props.opacity || 1,
        borderRadius: props.borderRadius ? props.borderRadius : undefined,
    }} bg='dark' text="light" className={`d-flex align-items-center justify-content-center ${props.className || ''} `}>
        {props.loading ? <LoadingDots /> : props.children}
    </Card>
}