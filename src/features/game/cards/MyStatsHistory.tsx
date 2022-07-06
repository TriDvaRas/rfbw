import React, { useState } from 'react';
import { Card, Collapse, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import LoadingDots from '../../../components/LoadingDots';
import { IPlayer } from '../../../util/interfaces';
import PlayerStatsChart from '../../charts/PlayerStatsChart';


interface Props {
    players?: Array<IPlayer>;
}

export default function MyStatsHistory(props: Props) {
    const { players, } = props
    const [chartType, setChartType] = useState<'points' | 'ended' | 'rerolled' | 'dropped'>('points')
    const [show, setShow] = useState(true)
    return (
        <Card className='bg-dark'>
            <Card.Header className='d-flex justify-content-between ' onClick={() => setShow(!show)}>
                <h3>Графики</h3>
                {show && <ToggleButtonGroup className='float-right' type="radio" name="options" value={chartType} onChange={setChartType}  onClick={(e:any)=>e.stopPropagation()}>
                    <ToggleButton id="tbg-radio-1" value={'points'} variant='secondary'>
                        Очки
                    </ToggleButton>
                    <ToggleButton id="tbg-radio-2" value={'ended'} variant='secondary'>
                        Закончено
                    </ToggleButton>
                    <ToggleButton id="tbg-radio-3" value={'rerolled'} variant='secondary'>
                        Рерольнуто
                    </ToggleButton>
                    <ToggleButton id="tbg-radio-4" value={'dropped'} variant='secondary'>
                        Дропнуто
                    </ToggleButton>
                </ToggleButtonGroup>}
            </Card.Header>
            <Collapse in={show} >
                {
                    players ?
                        <Card.Body className=''>
                            <PlayerStatsChart players={players} type={chartType} />
                        </Card.Body> :
                        <LoadingDots />
                }
            </Collapse>
        </Card>
    );
}