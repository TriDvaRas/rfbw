import React, { useEffect, useState } from 'react'
import {
    Row,
    Col,
    Card
} from 'react-bootstrap';
import Wheel from '../wheel/Wheel'
import useWindowDimensions from '../../util/useWindowDimensions';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyWheel, selectMyWheel } from '../me/myWheelSlice';
import WheelSettings from './WheelSettings';
import WheelItems from './WheelItems';
import { getUserInfo } from '../userinfo/userInfoSlice';
import { IWheelItem } from '../../util/interfaces';

export default function WheelEditor() {
    const userinfo = useSelector(getUserInfo)
    const myWheel = useSelector(selectMyWheel)
    const [clickedItem, setClickedItem] = useState<IWheelItem | null>(null)
    const dispatch = useDispatch()

    useEffect(() => {
        if (myWheel.status === 'idle') {
            dispatch(fetchMyWheel())
        }
    }, [myWheel.status, dispatch])

    const { height } = useWindowDimensions()
    const maxCardHeight = height - 32
    function onItemClick(item: IWheelItem) {
        setClickedItem(item)
    }
    if (userinfo.user?.isPlayer === 0)
        return (
            <Card className='text-center bg-dark'>Ты не игрок, я тебе запрещаю колёса делать.</Card>
        )
    return (
        <Row className="mh-100">
            <Col xl={5} xs={12} className="mh-100 pr-0" style={{ height: maxCardHeight }}>
                <Row className="mh-100">
                    <Col xs={12} className="mh-100 " style={{ height: maxCardHeight * 2 / 3 }}>
                        <Wheel
                            items={myWheel.wheel?.items as Array<IWheelItem> || []}
                            spinning
                            height={maxCardHeight * 2 / 3 - 80}
                            // height={800}
                            borderColor={myWheel.wheel?.border}
                            wheelColor={myWheel.wheel?.background}
                            pointerColor={myWheel.wheel?.pointer}
                            dotColor={myWheel.wheel?.dot}
                            onItemClick={onItemClick}
                        />
                    </Col>
                    <Col xs={12}>
                        <WheelSettings wheel={myWheel.wheel} height={maxCardHeight * 1 / 3} />
                    </Col>
                </Row>
            </Col>
            <Col xl={7} xs={12} className='pl-0'>
                <WheelItems
                    height={maxCardHeight}
                    wheel={myWheel.wheel}
                    editItem={clickedItem}
                    setEditItem={setClickedItem}
                />
            </Col>
        </Row>
    )
}