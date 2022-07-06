import { Card } from "react-bootstrap";
import Scrollbars from "react-custom-scrollbars-2";
import { IEffectState } from "../../../util/interfaces";
import EffectCard from "../../effects/EffectCard";

interface Props {
    myEffects?: Array<IEffectState>;
    maxHeight: number;
}
export default function MyActiveEffects(props: Props) {
    const { myEffects, maxHeight } = props
    return < Card className='bg-dark my-3' >
        <Card.Header>
            <h3>Активные эффекты</h3>
        </Card.Header>
        <Scrollbars autoHeight autoHeightMin={68} autoHeightMax={maxHeight}>
            <Card.Body className='py-0'>
                {
                    myEffects?.map(es => <EffectCard noScroll key={es.id} className='my-3' effect={es.effect} compact/>)
                }
                {
                    myEffects?.length === 0 && <h4 className='my-4 text-center'>Нету...</h4>
                }
            </Card.Body>
        </Scrollbars>
    </Card >
}