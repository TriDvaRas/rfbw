import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
    Button, Card, Col, OverlayTrigger, Popover, Row, Table
} from 'react-bootstrap';
import LoadingDots from '../LoadingDots';
import { getTypeIcon } from '../../util/items';
import { Wheel, WheelItem } from '../../database/db';
import WheelItemPreview from '../effect/EffectPreview';
import WheelItemNewButton from './WheelItemNewButton';

interface Props {
    wheel: Wheel
    items: WheelItem[];
    onSelectEdit?: (item: WheelItem) => void
    onAddNew?: () => void
    newLoading?: boolean
    fluid?: boolean
}
export default function WheelItems(props: Props) {
    const { wheel, items, newLoading, onAddNew, onSelectEdit, fluid } = props
    const [showDeletePopover, setShowDeletePopover] = useState<string | null>()

    function handleAdd() {
        if (onAddNew)
            onAddNew()
    }
    function handleDelete(evt: any, item?: WheelItem) {
        evt.stopPropagation()

    }
    function handleEdit(item: WheelItem) {
        if (onSelectEdit)
            onSelectEdit(item)

    }

    return <div>
        <Row>
            {items.map(x => <Col xl={fluid ? 4 : 6} md={6} sm={12} key={x.id}><WheelItemPreview item={x} onClick={wheel.locked || !onSelectEdit ? undefined : () => handleEdit(x)} /></Col>)}
            {!wheel.locked && onAddNew && items && items.length < wheel.maxSize && <Col xl={6} md={6} sm={12} key={'new'}><WheelItemNewButton loading={newLoading} onClick={() => handleAdd()} /></Col>}
        </Row>

    </div>
}