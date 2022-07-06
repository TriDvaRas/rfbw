import React from 'react';
import {
    Col, Row
} from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import useWindowDimensions from '../../util/useWindowDimensions';
import AdminEffects from './AdminEffects';
import AdminNavCard from './AdminNavCard';
import AdminPlayers from './AdminPlayers';
import AdminRules from './AdminRules';
import AdminUsers from './AdminUsers';
import AdminWheelItems from './AdminWheelItems';

export default function Admin() {


    const { height } = useWindowDimensions()
    const maxCardHeight = height - 32
    return (
        <Row className=" pr-3">
            <Col xs={2} className="h-100 " style={{ height: maxCardHeight }}>
                <AdminNavCard cardHeight={maxCardHeight} />
            </Col>
            <Col className="h-100 ">
                <Routes>
                    <Route path='/users'
                        element={<AdminUsers cardHeight={maxCardHeight} />}
                    />
                    <Route path='/players'
                        element={<AdminPlayers cardHeight={maxCardHeight} />}                        
                    />
                    <Route path='/wheels'>
                        
                    </Route>
                    <Route path='/items'
                        element={<AdminWheelItems cardHeight={maxCardHeight} />}                        
                    />
                    <Route path='/rules'
                        element={<AdminRules cardHeight={maxCardHeight} />}                        
                    />
                    <Route path='/effects'
                        element={<AdminEffects cardHeight={maxCardHeight} />}                        
                    />
                </Routes>
            </Col>
        </Row >
    )
}