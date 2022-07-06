import axios from 'axios';
import hexRgb from 'hex-rgb';
import React from 'react';
import {
    Card, Col, Row
} from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { IColor, IWheel } from '../../util/interfaces';
import { updateBackground, updateBorder, updateDot, updatePointer } from "../me/myWheelSlice";
import { newToast } from '../toasts/toastsSlice';
import ColorPicker from './ColorPicker';
interface Props {
    wheel?: IWheel;
    height: number;
}
export default function WheelSettings(props: Props) {
    const { wheel, height } = props
    let border = hexRgb(wheel?.border || `#fff`)
    let background = hexRgb(wheel?.background || `#2b2744`)
    let pointer = hexRgb(wheel?.pointer || `#fff`)
    let dot = hexRgb(wheel?.dot || `#fff`)
    const dispatch = useDispatch()
    function handleUpdateBorder(color: IColor, updateBD: boolean) {
        dispatch(updateBorder(color.hex))
        if (updateBD)
            axios.post(`/api/wheels/my`, { border: color.hex })
                .then(
                    () => {
                        dispatch(newToast({
                            id: Math.random(),
                            date: `${Date.now()}`,
                            type: 'success',
                            title: 'Сохранил',
                            autohide: 5000
                        }))
                    },
                    (err) => {
                        dispatch(newToast({
                            id: Math.random(),
                            date: `${Date.now()}`,
                            type: 'error',
                            title: 'Ошибка',
                            text: err.response.data,
                        }))
                    });
    }
    function handleUpdateBackground(color: IColor, updateBD: boolean) {
        dispatch(updateBackground(color.hex))
        if (updateBD)
            axios.post(`/api/wheels/my`, { background: color.hex })
                .then(
                    () => {
                        dispatch(newToast({
                            id: Math.random(),
                            date: `${Date.now()}`,
                            type: 'success',
                            title: 'Сохранил',
                            autohide: 5000
                        }))
                    },
                    (err) => {
                        dispatch(newToast({
                            id: Math.random(),
                            date: `${Date.now()}`,
                            type: 'error',
                            title: 'Ошибка',
                            text: err.response.data,
                        }))
                    });
    }
    function handleUpdatePoiner(color: IColor, updateBD: boolean) {
        dispatch(updatePointer(color.hex))
        if (updateBD)
            axios.post(`/api/wheels/my`, { pointer: color.hex })
                .then(
                    () => {
                        dispatch(newToast({
                            id: Math.random(),
                            date: `${Date.now()}`,
                            type: 'success',
                            title: 'Сохранил',
                            autohide: 5000
                        }))
                    },
                    (err) => {
                        dispatch(newToast({
                            id: Math.random(),
                            date: `${Date.now()}`,
                            type: 'error',
                            title: 'Ошибка',
                            text: err.response.data,
                        }))
                    });;
    }
    function handleUpdateDot(color: IColor, updateBD: boolean) {
        dispatch(updateDot(color.hex))
        if (updateBD)
            axios.post(`/api/wheels/my`, { dot: color.hex })
                .then(
                    () => {
                        dispatch(newToast({
                            id: Math.random(),
                            date: `${Date.now()}`,
                            type: 'success',
                            title: 'Сохранил',
                            autohide: 5000
                        }))
                    },
                    (err) => {
                        dispatch(newToast({
                            id: Math.random(),
                            date: `${Date.now()}`,
                            type: 'error',
                            title: 'Ошибка',
                            text: err.response.data,
                        }))
                    });;
    }
    return (
        <Card
            bg='dark'
            text='light'
            className="m-3  wheel-card"
            border={"dark"}
            style={{ height: height }}
        >
            <Card.Header>
                <h3>Наcтройка колеса(можно жмакать)</h3>
            </Card.Header>
            <Card.Body>
                {
                    !wheel ||
                    <Row>
                        <Col >
                            <h4>Обводка</h4>
                            <ColorPicker
                                placement='right'
                                onChange={(color: IColor) => handleUpdateBorder(color, false)}
                                onPicked={(color: IColor) => handleUpdateBorder(color, true)}
                                defColor={{ rgb: { r: border.red, g: border.green, b: border.blue }, hex: wheel.border || '#fff' }}
                            />
                        </Col>
                        <Col >
                            <h4>Фон</h4>
                            <ColorPicker
                                placement='right'
                                onChange={(color: IColor) => handleUpdateBackground(color, false)}
                                onPicked={(color: IColor) => handleUpdateBackground(color, true)}
                                defColor={{ rgb: { r: background.red, g: background.green, b: background.blue }, hex: wheel.background || '#2b2744' }}
                            />
                        </Col>
                        <Col >
                            <h4>Центр</h4>
                            <ColorPicker
                                placement='right'
                                onChange={(color: IColor) => handleUpdateDot(color, false)}
                                onPicked={(color: IColor) => handleUpdateDot(color, true)}
                                defColor={{ rgb: { r: dot.red, g: dot.green, b: dot.blue }, hex: wheel.dot || '#2b2744' }}
                            />
                        </Col>
                        <Col >
                            <h4>Указатель</h4>
                            <ColorPicker
                                placement='right'
                                onChange={(color: IColor) => handleUpdatePoiner(color, false)}
                                onPicked={(color: IColor) => handleUpdatePoiner(color, true)}
                                defColor={{ rgb: { r: pointer.red, g: pointer.green, b: pointer.blue }, hex: wheel.pointer || '#2b2744' }}
                            />
                        </Col>
                    </Row>
                }


            </Card.Body>
        </Card>
    )
}