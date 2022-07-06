import React, { useEffect } from 'react';
import {
    Carousel
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import LoadingDots from '../../components/LoadingDots';
import { IWheelItem } from '../../util/interfaces';
import Wheel from '../wheel/Wheel';
import { fetchWheels, selectWheels } from './wheelsSlice';

interface Props {
    height:number;
}
export default function WheelsList(props: Props) {
    const wheels = useSelector(selectWheels)
    const dispatch = useDispatch()
    useEffect(() => {
        if (wheels.status === 'idle') {
            dispatch(fetchWheels())
        }
    }, [wheels.status, dispatch])
    return (
        <Carousel interval={null}>
            {
                !wheels.wheels ?
                    <LoadingDots /> :
                    wheels.wheels.map(wheel =>
                        <Carousel.Item>
                            <Wheel
                                title={wheel.ownerTag}
                                items={wheel?.items as Array<IWheelItem> || []}
                                spinning
                                height={props.height-80}
                                // height={800}
                                borderColor={wheel?.border}
                                wheelColor={wheel?.background}
                                pointerColor={wheel?.pointer}
                                dotColor={wheel?.dot}
                            />
                        </Carousel.Item>
                    )
            }
        </Carousel>


    )
}

