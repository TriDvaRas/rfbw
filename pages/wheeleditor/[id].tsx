import axios, { AxiosError } from "axios";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import { Alert, Col, Row } from 'react-bootstrap';
import { useElementSize, useWindowSize } from 'usehooks-ts';
import LoadingDots from "../../components/LoadingDots";
import { NotAPlayerCard } from "../../components/NotAPlayerCard";
import TheWheel from '../../components/wheel/TheWheel';
import TheWheelSettings from "../../components/wheel/TheWheelSettings";
import WheelItemEditModal from "../../components/wheelItem/TheWheelItemEditModal";
import WheelItems from "../../components/wheelItem/WheelItems";
import useWheel from "../../data/useWheel";
import useWheelItems from '../../data/useWheelItems';
import { Wheel, WheelItem } from '../../database/db';
import GetThinLayout from '../../layouts/thin';
import { ApiError } from "../../types/common-api";
import { NextPageWithLayout } from "../_app";

interface Props {

}
const WheelEditor: NextPageWithLayout = ({ }: Props) => {
    const session = useSession()
    const router = useRouter()
    const wheelId = router.query.id as string
    const wheel = useWheel(wheelId)
    const wheelItems = useWheelItems(wheelId)
    const [selectedItem, setSelectedItem] = useState<WheelItem | undefined>()

    const { height } = useWindowSize()
    const [wheelContainerRef, { width, }] = useElementSize()
    const maxCardHeight = height - 56 - 32
    const maxCardWidth = width - 56 - 32

    const [newItemLoading, setNewItemLoading] = useState(false)

    const [localWheel, setLocalWheel] = useState<Wheel | undefined>()
    const [localWheelItems, setLocalWheelItems] = useState<WheelItem[] | undefined>()
    useEffect(() => {
        if (wheel.wheel && !localWheel)
            setLocalWheel(wheel.wheel)
    }, [localWheel, wheel.wheel])
    useEffect(() => {
        if (wheelItems.wheelItems && !localWheelItems)
            setLocalWheelItems(wheelItems.wheelItems)
    }, [localWheelItems, wheelItems.wheelItems])

    function onItemAdd() {
        setNewItemLoading(true)
        axios.post<WheelItem>(`/api/wheels/${wheel.wheel?.id}/items`)
            .then((data) => {
                setNewItemLoading(false)
                wheelItems.mutate([...(wheelItems.wheelItems || []), data.data])
                setLocalWheelItems([...(wheelItems.wheelItems || []), data.data])
            }).catch((err: AxiosError<ApiError>) => {
                setNewItemLoading(false)
            })
    }

    function onItemClick(item: WheelItem) {
        setSelectedItem(item)
    }
    //#region 40x
    if (wheel.error?.status == 404 || wheelItems.error?.status == 404) {
        router.replace(`/404`)
        return <></>
    }
    if (wheel.error?.status == 403 || wheelItems.error?.status == 403) {
        router.replace(`/403`)
        return <></>
    }
    if (session.data && !session.data.user.isPlayer)
        return <NotAPlayerCard />
    if (wheel.loading || wheelItems.loading)
        return <LoadingDots />
    if (wheel.error) {
        return wheel.error.status == 433 ? <NotAPlayerCard /> : <Alert className='mb-0' variant={'danger'}>
            {wheel.error.error}
        </Alert>
    }
    if (wheelItems.error) {
        return wheelItems.error.status == 433 ? <NotAPlayerCard /> : <Alert className='mb-0' variant={'danger'}>
            {wheelItems.error.error}
        </Alert>
    }
    //#endregion

    return (wheelItems.wheelItems && localWheel) ?
        <Row className="mh-100 p-0">
            <Col xl={8} ref={wheelContainerRef} lg={12} className="mh-100 p-0" >
                <TheWheel
                    withTitle
                    items={wheelItems.wheelItems}
                    idleSpin
                    height={Math.min(maxCardHeight * 4 / 5, maxCardWidth) - 56}
                    wheel={localWheel}
                    onItemClick={onItemClick}
                />
            </Col>
            <Col xl={4} lg={12} className='mh-100 mb-3 pb-3 p-0'>
                <TheWheelSettings
                    wheel={localWheel}
                    onUpdate={(upd) => setLocalWheel({ ...localWheel, ...upd } as Wheel)}
                    maxHeight={Math.min(maxCardHeight * 4 / 5, maxCardWidth) + 2}
                    onReset={() => {
                        setLocalWheel(wheel.wheel)
                    }}
                    onSave={() => {
                        return axios.patch(`/api/wheels/${localWheel.id}`, localWheel)
                            .then(x => x.data)
                            .then((_wheel: Wheel) => {
                                wheel.mutate(_wheel)
                            })
                    }}
                />
            </Col>
            <Col xl={12} xs={12} className='my-3 p-0'>
                {wheelItems.loading ? <LoadingDots /> :
                    wheelItems.wheelItems && localWheelItems && <WheelItems
                        wheel={localWheel}
                        items={localWheelItems}
                        onSelectEdit={setSelectedItem}
                        onAddNew={onItemAdd}
                        newLoading={newItemLoading}

                    />
                }
            </Col>
            {selectedItem && localWheelItems &&
                <WheelItemEditModal
                    show={!!selectedItem}
                    wheel={localWheel}
                    wheelItems={localWheelItems}
                    selectedItem={selectedItem}
                    onCancel={() => {
                        setSelectedItem(undefined);
                        setLocalWheelItems(wheelItems.wheelItems)
                    }}
                    onSave={async () => {
                        const x = await axios.patch(`/api/wheels/${localWheel.id}/items/${selectedItem.id}`, selectedItem);
                        const item = x.data;
                        wheelItems.mutate(localWheelItems.map(x_1 => x_1.id === item.id ? item : x_1));
                        setSelectedItem(undefined)
                    }}
                    onUpdate={(upd) => {
                        let item = { ...selectedItem, ...upd } as WheelItem
                        setSelectedItem(item)
                        setLocalWheelItems(localWheelItems.map(x => x.id === item.id ? item : x))
                    }} />}
        </Row>
        : <LoadingDots />
}
WheelEditor.getLayout = GetThinLayout
export default WheelEditor
