import axios, { AxiosError } from 'axios';
import React, { useState } from 'react';
import {
    Card, Form, Image as ReactImage, ProgressBar,
} from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import { resolveImageFilePath } from '../util/image';
import { ApiError } from '../types/common-api';
import { Image } from '../database/db';
import useImage from '../data/useImage';

interface Props {
    container: 'card' | 'raw'
}
export default function TheImagePlaceholder(props: Props) {
    const { container } = props
    return container == 'card' ?
        <Card.Img
            className='rect-img'
            variant="top"
            src={`/errorAvatar.jpg`}
        /> :
        <ReactImage
            className='rect-img'
            src={`/errorAvatar.jpg`}
        />

}