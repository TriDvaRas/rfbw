import React from 'react'

import {
    Row,
    Col
} from 'react-bootstrap';
// import Switch from 'react-bootstrap/esm/Switch';
import { BrowserRouter, Route,Routes } from 'react-router-dom';
import MePlayerEdit from '../features/me/MePlayerEditor';
import WheelEditor from '../features/wheelEditor/WheelEditor';
import useWindowDimensions from '../util/useWindowDimensions';

export default function Me() {
    const { height } = useWindowDimensions()
    const maxCardHeight = height - 32
    return (
        <Routes>
            <Route path='/me/wheel'>
                <WheelEditor />
            </Route>
            <Route path='/me'>
                <MePlayerEdit maxCardHeight={height} />
            </Route>
        </Routes>
    )
}