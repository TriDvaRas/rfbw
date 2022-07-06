import '../../../assets/scss/posts.sass'
import React, { useEffect, useState } from 'react';
import { Button, Card, Collapse, Table, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import Scrollbars from 'react-custom-scrollbars-2';
import { useSelector, useDispatch } from 'react-redux';
import LoadingDots from '../../../components/LoadingDots';
import { IEffect, IPlayer, IPost, IPostCustom, IPostDrop, IPostEffectSpin, IPostEnd, IPostPoints, IPostReroll, IPostSpin } from '../../../util/interfaces';
import { fetchMorePosts, fetchPosts, selectPosts } from '../postsSlice';
import dateFormat from 'dateformat';

import TimeAgo from 'react-timeago';
//@ts-ignore
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import ruDateFormater from './ruDateFormater';
import { getEffectType } from '../../../util/effects';
import FormatCustomPost from '../formaters/FormatCustomPost';

const formatter = buildFormatter(ruDateFormater)

interface Props {
    players?: IPlayer[];
    effects?: IEffect[]
}

export default function PostsHistory(props: Props) {
    const { players, effects } = props
    const [chartType, setChartType] = useState<'all' | 'effectdrops' | 'drops' | 'points'>('all')
    const posts = useSelector(selectPosts)
    const dispatch = useDispatch()
    useEffect(() => {
        if (posts.status === 'idle')
            dispatch(fetchPosts())
    }, [dispatch, posts.status])
    const [show, setShow] = useState(true)
    const [showSize, setShowSize] = useState<number>(250)
    function toggleSize() {
        switch (showSize) {
            case 250:
                setShowSize(600)
                break;
            case 600:
                setShowSize(250)
                break;
            default:
                break;
        }
    }
    return (
        <Card className='bg-dark hidden-scrollbar'>
            <Card.Header className='d-flex justify-content-between ' onClick={() => setShow(!show)}>
                <h3>История</h3>
                {show && <div onClick={(e: any) => e.stopPropagation()}>
                    <Button className='mx-3' onClick={toggleSize} variant='secondary'>
                        {showSize === 250 ? `Шыре*(выше)` : `Уже*(ниже?)`}
                    </Button>
                    <ToggleButtonGroup className='float-right' type="radio" name="options" value={chartType} onChange={setChartType} >

                        <ToggleButton id="tbg-radio-1" value={'all'} variant='secondary'>
                            Все
                        </ToggleButton>
                        <ToggleButton id="tbg-radio-2" value={'ended'} variant='secondary'>
                            События
                        </ToggleButton>
                        <ToggleButton id="tbg-radio-3" value={'rerolled'} variant='secondary'>
                            Контент
                        </ToggleButton>
                        <ToggleButton id="tbg-radio-4" value={'dropped'} variant='secondary'>
                            Очки
                        </ToggleButton>
                    </ToggleButtonGroup></div>}
            </Card.Header>
            <Collapse in={show}>
                {
                    posts.posts && players && effects ?
                        <Scrollbars
                            autoHeight
                            autoHeightMax={showSize}
                            universal={true}
                            style={{ transition: 'linear .3s' }}
                        >
                            <Table variant='dark' className='m-0' >
                                {
                                    posts.posts.map(post => {
                                        let p: IPost = post
                                        let effect: IEffect | undefined
                                        switch (post.type) {
                                            case 'spin':
                                                p = post as IPostSpin
                                                return <tr className='post-bg-spin'>
                                                    <td className='td-min-width post-text'><i className="bi bi-pin-fill"></i></td>
                                                    <td className='post-text ' colSpan={40}>
                                                        <span className='post-player'>
                                                            {players.find(x => x.id === p.variables.playerId)?.name || '?'}
                                                        </span>
                                                        {` крутит колесо `}
                                                        <span className='post-player'>
                                                            {p.variables.ownerName}
                                                        </span>
                                                        {` и получает `}
                                                        <span className='post-wheelitem'>
                                                            {p.variables.itemName}
                                                        </span>
                                                    </td>
                                                    <td className='td-min-width post-time'><TimeAgo date={new Date(p.timestamp)} title={dateFormat(new Date(p.timestamp), `dd.mm.yyyy HH:MM:ss`)} formatter={formatter} /></td>
                                                </tr>
                                            case 'end':
                                                p = post as IPostEnd
                                                return <tr className='post-bg-end'>
                                                    <td className='td-min-width post-text'><i className="bi bi-pin-fill"></i></td>
                                                    <td className='post-text ' colSpan={40}>
                                                        <span className='post-player'>
                                                            {players.find(x => x.id === p.variables.playerId)?.name || '?'}
                                                        </span>
                                                        {` завершает `}
                                                        <span className='post-wheelitem'>
                                                            {p.variables.itemName}
                                                        </span>
                                                    </td>
                                                    <td className='td-min-width post-time'><TimeAgo date={new Date(p.timestamp)} title={dateFormat(new Date(p.timestamp), `dd.mm.yyyy HH:MM:ss`)} formatter={formatter} /></td>
                                                </tr>
                                            case 'reroll':
                                                p = post as IPostReroll
                                                return <tr className='post-bg-reroll'>
                                                    <td className='td-min-width post-text'><i className="bi bi-pin-fill"></i></td>
                                                    <td className='post-text ' colSpan={40}>
                                                        <span className='post-player'>
                                                            {players.find(x => x.id === p.variables.playerId)?.name || '?'}
                                                        </span>
                                                        {` рероллит `}
                                                        <span className='post-wheelitem'>
                                                            {p.variables.itemName}
                                                        </span>
                                                    </td>
                                                    <td className='td-min-width post-time'><TimeAgo date={new Date(p.timestamp)} title={dateFormat(new Date(p.timestamp), `dd.mm.yyyy HH:MM:ss`)} formatter={formatter} /></td>
                                                </tr>
                                            case 'drop':
                                                p = post as IPostDrop
                                                return <tr className='post-bg-drop'>
                                                    <td className='td-min-width post-text'><i className="bi bi-pin-fill"></i></td>
                                                    <td className='post-text ' colSpan={40}>
                                                        <span className='post-player'>
                                                            {players.find(x => x.id === p.variables.playerId)?.name || '?'}
                                                        </span>
                                                        {` дропает `}
                                                        <span className='post-wheelitem'>
                                                            {p.variables.itemName}
                                                        </span>
                                                    </td>
                                                    <td className='td-min-width post-time'><TimeAgo date={new Date(p.timestamp)} title={dateFormat(new Date(p.timestamp), `dd.mm.yyyy HH:MM:ss`)} formatter={formatter} /></td>
                                                </tr>
                                            case 'points':
                                                p = post as IPostPoints
                                                return <tr className={`post-bg-points${p.variables.add ? `a` : `r`}`}>
                                                    <td className='td-min-width post-text'><i className="bi bi-pin-fill"></i></td>
                                                    <td className='post-text ' colSpan={40}>
                                                        <span className='post-player'>
                                                            {players.find(x => x.id === p.variables.playerId)?.name || '?'}
                                                        </span>
                                                        {` ${p.variables.add ? `получает` : `теряет`} `}
                                                        <span className='post-points'>
                                                            {p.variables.delta}
                                                        </span>
                                                        {` очков по причине `}
                                                        <span className='post-reason'>
                                                            {p.variables.reason}
                                                        </span>
                                                    </td>
                                                    <td className='td-min-width post-time'><TimeAgo date={new Date(p.timestamp)} title={dateFormat(new Date(p.timestamp), `dd.mm.yyyy HH:MM:ss`)} formatter={formatter} /></td>
                                                </tr>
                                            case 'effectspin':
                                                p = post as IPostEffectSpin
                                                effect = effects.find(x => x.id === p.variables.effectId)
                                                return <tr className={`post-bg-spineffect`}>
                                                    <td className='td-min-width post-text'><i className="bi bi-pin-fill"></i></td>
                                                    <td className='post-text ' colSpan={40}>
                                                        <span className='post-player'>
                                                            {players.find(x => x.id === p.variables.playerId)?.name || '?'}
                                                        </span>
                                                        {` крутит колесо событий и получает `}
                                                        <span className={`post-effect-${p.variables.effectId === 47 ? `secret` : effect && getEffectType(effect)}`}>
                                                            {p.variables.effectId===47?`Секрет`:effect?.title || `?`}
                                                        </span>
                                                    </td>
                                                    <td className='td-min-width post-time'><TimeAgo date={new Date(p.timestamp)} title={dateFormat(new Date(p.timestamp), `dd.mm.yyyy HH:MM:ss`)} formatter={formatter} /></td>
                                                </tr>
                                            case 'effectcustom':
                                                p = post as IPostCustom
                                                return <tr className={`post-bg-spineffect`}>
                                                    <td className='td-min-width post-text'><i className="bi bi-pin-fill"></i></td>
                                                    <td className='post-text ' colSpan={40}>
                                                        <FormatCustomPost post={p} effects={effects} players={players} />
                                                    </td>
                                                    <td className='td-min-width post-time'><TimeAgo date={new Date(p.timestamp)} title={dateFormat(new Date(p.timestamp), `dd.mm.yyyy HH:MM:ss`)} formatter={formatter} /></td>
                                                </tr>
                                            default:
                                                return <tr>
                                                    <td colSpan={42}>а че это?</td>
                                                </tr>
                                        }
                                    })
                                }
                            </Table>
                        </Scrollbars> :
                        <LoadingDots />
                }
            </Collapse>
        </Card>
    );
}