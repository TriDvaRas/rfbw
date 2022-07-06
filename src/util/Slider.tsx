import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import RangeSlider from 'react-bootstrap-range-slider';

interface Props {
    defaultValue: number;
    onChange?: Function;
}
export default function Slider(props: Props) {
    const [value, setValue] = useState(props.defaultValue);
    function _onChange(e: React.ChangeEvent<HTMLInputElement>) {
        setValue(+e.target.value)
        if (props.onChange)
            props.onChange(+e.target.value)
    }
    return (
        <Row className="m-3">
            <Col xs={'auto'}>
                Заполненность колеса: {value}
            </Col>
            <Col>
                <RangeSlider
                    min={3}
                    max={20}
                    value={value}
                    onChange={_onChange}
                    tooltipPlacement='top'
                    variant='secondary'
                    inputProps={{ className: 'w-100' }}
                    tooltipLabel={() => ''}
                />
            </Col>
        </Row>
    );

};