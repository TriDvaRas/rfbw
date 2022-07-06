import React from 'react';
import {
    Card, Table
} from 'react-bootstrap';
import Scrollbars from 'react-custom-scrollbars-2';
import '../../assets/scss/rect-img.sass';
import { IPlayer } from '../../util/interfaces';
import SingleStat from './SingleStat';
interface Props {
    player: IPlayer;
    id?: string;
    points?: boolean;
    place?: number;
}
export default function PlayerAboutCard(props: Props) {
    const { player, id, points, place } = props
    return (
        <Card
            bg='dark'
            text='light'
            className={points ? `` : `m-3 shadow`}
            id={id}
        >
            <div className='rect-img-container'>
                <Card.Img
                    className='rect-img'
                    variant="top"
                    src={`${player.picture?.startsWith(`blob`) ? '' : '/'}${player.picture || 'errorAvatar.jpg'}`}
                    onError={(e: any) => { e.target.onerror = null; e.target.src = "/errorAvatar.jpg" }}
                />
            </div>
            {points || <Card.Title style={{ margin: 20, marginBottom: 0 }}>{player.name}</Card.Title>}
            {
                points ?
                    <Card.Body className='text-center'>
                        <SingleStat title={'Очки:'} value={`${player.points}`} />
                        <SingleStat title={'Место:'} value={`${place === undefined ? `...` : place + 1}`} />
                        <SingleStat title={'Завершено:'} value={`${player.ended}`} />
                        <SingleStat title={'Рерольнуто:'} value={`${player.rerolled}`} />
                        <SingleStat title={'Дропнуто:'} value={`${player.dropped}`} />
                    </Card.Body> :
                    <Scrollbars autoHeight autoHeightMax={130} autoHeightMin={130} >
                        <Card.Body>
                            <Card.Text>
                                {player.about}
                            </Card.Text>
                        </Card.Body>
                    </Scrollbars>
            }


        </Card>
    )
}