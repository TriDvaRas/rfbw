import React from 'react';
import {
    Card, Table
} from 'react-bootstrap';

import { Player } from '../../database/db';
import TheImage from '../TheImage';
import TheImagePlaceholder from '../TheImagePlaceholder';
import SingleStat from './SingleStat';
interface Props {
    name: string
    about: string
    imageId?: string
    id?: string;
    points?: boolean;
    place?: number;
}
export default function PlayerAboutCard(props: Props) {
    const { name, about, id, points, place, imageId } = props
    console.log(props);
    
    return (
        <Card
            bg='dark'
            text='light'
            className={points ? `` : `m-3 shadow`}
            id={id}
        >
            <div className='rect-img-container overflow-hidden'>
                {
                    imageId ?
                        <TheImage container='card' imageId={imageId} /> :
                        <TheImagePlaceholder container='card' />
                }
            </div>
            {points || <Card.Title style={{ margin: 20, marginBottom: 0 }}>{name}</Card.Title>}
            <div style={{ height: 130 }} >
                <Card.Body>
                    <Card.Text>
                        {about}
                    </Card.Text>
                </Card.Body>
            </div>
        </Card>
    )
}