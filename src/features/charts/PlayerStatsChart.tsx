import dateformat from 'dateformat';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import chartColorsMap from '../../util/chartColorsMap';
import { IPlayer } from '../../util/interfaces';
import { fetchStats, selectStats } from './statsHistorySlice';
interface Props {
    players: Array<IPlayer>;
    type?: 'points' | 'ended' | 'rerolled' | 'dropped';
}

export default function PlayerStatsChart(props: Props) {
    const { players, type } = props
    const stats = useSelector(selectStats)
    const dispatch = useDispatch()
    useEffect(() => {
        if (stats.status === 'idle')
            dispatch(fetchStats())
    }, [dispatch, stats.status])

    

    if (stats.stats) {
        const data = stats.stats.map(st => {
            const obj: any = {}
            st[type || 'points'].forEach(pt => {
                obj[`${players.find(pl => pl.id === pt.playerId)?.name || 'unknown'}`] = pt.value
            })
            return {
                name: dateformat(st.timestamp, 'dd.mm HH:MM'),
                ...obj
            }
        })
        return (
            <ResponsiveContainer width='100%' height={600}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke='#00000077' />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip contentStyle={{ backgroundColor: '#00000099', borderColor: '#000' }} itemSorter={item => -(item.value as number)} />
                    <Legend />
                    {
                        players.map((player, i) => <Line dot={false} key={i} type="monotone" dataKey={player.name} stroke={chartColorsMap[i]} />)
                    }
                </LineChart>
            </ResponsiveContainer>
        );
    }
    return <ResponsiveContainer width='100%' height={600}>
        <LineChart data={[]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
        </LineChart>
    </ResponsiveContainer>

}