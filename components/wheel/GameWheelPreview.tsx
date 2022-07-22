import React, { useRef, useState } from 'react';
import {
    Alert,
    Button, Card, Col, Collapse, Form, Modal, Row, Spinner
} from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import TextareaAutosize from 'react-textarea-autosize';
import { User, Player, Image, Wheel, GameWheel } from '../../database/db';
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
import useWheel from '../../data/useWheel';
import WheelPreview from './WheelPreview';

interface Props {
    gameWheel: GameWheel,
    fullImages?: boolean
    onClick?: () => void
    admin?: boolean
    withAuthor?: boolean
    height?: number
}
export default function GameWheelPreview(props: Props) {
    const wheel = useWheel(props.gameWheel.wheelId)
    return wheel.wheel ? <WheelPreview {...props} wheel={wheel.wheel} /> : <LoadingDots />
}