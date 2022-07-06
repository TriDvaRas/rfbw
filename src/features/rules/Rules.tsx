import React, { useEffect } from 'react';
import {
    Card, Container
} from 'react-bootstrap';
import Scrollbars from 'react-custom-scrollbars-2';
import ReactMarkdown from 'react-markdown';
import { useDispatch, useSelector } from 'react-redux';
import rehypeRaw from 'rehype-raw';
import LoadingDots from '../../components/LoadingDots';
import { bgColors, fgColors } from '../../util/highlightColors';
import { highlightMdAll } from '../../util/lines';
import useWindowDimensions from '../../util/useWindowDimensions';
import { fetchRules, getRules } from './rulesSlice';
interface Props {
    fluid?: boolean;
}
export default function Rules({ fluid }: Props) {
    const { height } = useWindowDimensions()
    const maxCardHeight = height
    const rules = useSelector(getRules)
    const dispatch = useDispatch()
    useEffect(() => {
        if (rules.status === 'idle') {
            dispatch(fetchRules())
        }
    }, [rules.status, dispatch])
    return (
        <Scrollbars autoHeight autoHeightMin={maxCardHeight}>
            <Container fluid={fluid}>
                <Card bg='dark' className='m-3'>
                    <Card.Body>
                        {
                            rules.status === 'failed' ? null :
                                rules.markdown ?
                                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                                        {highlightMdAll(rules.markdown, fgColors, bgColors, rules.savedBy || '?', rules.timestamp || '1')}
                                    </ReactMarkdown> :
                                    <LoadingDots />
                        }
                    </Card.Body>
                </Card>
            </Container>
        </Scrollbars>

    )
}