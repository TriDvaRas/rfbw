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

interface Props {
    height: number | string
}
export default function PHCard(props: Props) {

    return <Card style={{ height: props.height }} bg='dark' text="light">

    </Card>
}