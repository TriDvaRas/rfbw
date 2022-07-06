import { Card, Button } from "react-bootstrap";
import Scrollbars from "react-custom-scrollbars-2";
import { effectColors } from "../../util/highlightColors";
import { IEffect } from "../../util/interfaces";
import { highlightFgClasses } from "../../util/lines";

interface Props {
    effect: IEffect;
    id?: string;
    className?: string;
    compact?: boolean;
    onOk?: Function;
    noScroll?: boolean;
    okDisabled?: boolean;
    okText?: string;
}

export default function EffectCard(props: Props) {
    const { effect, compact, onOk, noScroll, okText,okDisabled } = props
    const effectColor = effect.isPositive ? 'primary' :
        effect.isCard ? 'info' :
            effect.isSecret ? 'warning' :
                effect.isNegative ? 'danger' : 'secondary'
    return (
        <Card className={`bg-dark text-light border-${effectColor} ${props.className} `} id={props.id}>
            <Card.Header>
                <h3 className='mb-0'>{effect.title}</h3>
            </Card.Header>
            {
                onOk || noScroll ?
                    <Card.Body>
                        <Card.Text dangerouslySetInnerHTML={{ __html: highlightFgClasses(effect.description, effectColors) }} />
                        {onOk && <Button variant="primary" disabled={okDisabled} className='float-right' onClick={(evt) => onOk(evt)}>{okText || `Продолжить`}</Button>}
                    </Card.Body> :
                    <Scrollbars autoHeight autoHeightMax={100} autoHeightMin={compact ? 0 : 100} >
                        <Card.Body>
                            <Card.Text dangerouslySetInnerHTML={{ __html: highlightFgClasses(effect.description, effectColors) }} />
                        </Card.Body>
                    </Scrollbars>
            }

        </Card>
    )
};