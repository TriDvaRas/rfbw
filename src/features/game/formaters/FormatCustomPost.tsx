import { IEffect, IPlayer, IPostCustom } from "../../../util/interfaces";
import React, { useEffect, useState } from 'react';
import { getEffectType } from "../../../util/effects";

import dateFormat from 'dateformat';
import TimeAgo from 'react-timeago';
//@ts-ignore
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import ruDateFormater from '../cards/ruDateFormater';
const formatter = buildFormatter(ruDateFormater)
interface Props {
    post: IPostCustom, effects?: IEffect[], players?: IPlayer[]
}
export default function FormatCustomPost(props: Props) {
    const { post, effects, players, } = props
    const tags = post.variables.pattern.match(/(?<=\{).+?(?=\})/g)
    const words = post.variables.pattern.split(/ +/)
    return <span>
        {words.map((word, i) => {
            if (word.startsWith(`{`) && (word.endsWith(`}`)||word.endsWith(`}.`)))
                return replaceTag(word.replace(/[{}.]/g, ''), post, players, effects)
            else
                return `${word} `
        })}
    </span>
}

function replaceTag(tag: string, post: IPostCustom, players?: IPlayer[], effects?: IEffect[]) {
    switch (tag) {
        case 'player':
            return playerName(players, post.variables.variables.playerId)
        case 'owner':
            return playerName(players, post.variables.variables.ownerId)
        case 'target':
            return playerName(players, post.variables.variables.targetId)
        case 'effect':
            return effectName(effects, post.variables.variables.effectId)
        case 'effect1':
            return effectName(effects, post.variables.variables.effectId1)
        case 'reason':
            return formatReason(post.variables.variables.reason)
        case 'guess':
            return formatTextColor(post.variables.variables.guess, `neutral`)
        case 'result':
            return formatTextColor(post.variables.variables.result, `good`)
        case 'timeago':
            return formatTimeAgo(post.variables.variables.timeago)
        case 'selection':
            return formatTextColor(post.variables.variables.selection, `neutral`)
        case 'number':
            return formatTextColor(post.variables.variables.number, `neutral`)
        case 'content':
            return formatTextColor(post.variables.variables.content, `neutral`)
        default:
            return `??`
    }
}

function playerName(players: IPlayer[] | undefined, playerId: number) {
    return <span className='post-player'>
        {(players?.find(x => x.id === playerId)?.name || '?') + ' '}
    </span>
}
function effectName(effects: IEffect[] | undefined, effectId: number) {
    const effect = effects?.find(x => x.id === effectId)
    return <span className={`post-effect-${effect && getEffectType(effect)}`}>
        {(effect?.title || `?`) + ` `}
    </span>
}
function formatReason(reason: string) {
    return <span className='post-reason'>
        {reason + ' '}
    </span>
}
function formatTextColor(reason: string, type: string) {
    return <span className={`post-text-color-${type}`}>
        {reason + ' '}
    </span>
}
function formatTimeAgo(date: any) {
    return <span className={`post-timeago`}>
        <TimeAgo date={new Date(date)} title={dateFormat(new Date(date), `dd.mm.yyyy HH:MM:ss`)} formatter={formatter} />
    </span>
}

