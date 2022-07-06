import axios from 'axios'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { IStat } from '../../util/interfaces'


const initialState: {
    stats?: Array<IStat>;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error?: string;
} = {
    status: 'idle',
}

export const fetchStats = createAsyncThunk('stats/fetchStats', async () => {
    const response: { data: Array<IStat> } = await axios.get(`/api/stats`)
    return response.data
})


const statsSlice = createSlice({
    name: 'stats',
    initialState,
    reducers: {
        addStat: (state, action: {
            payload: IStat,
            type: string
        }) => {
            if (state.stats) {
                state.stats = [...state.stats, action.payload]
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchStats.pending, (state, action) => {
            state.status = 'loading'
        })
        builder.addCase(fetchStats.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.stats = action.payload
        })
        builder.addCase(fetchStats.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.payload as string
        })


    }
})

export default statsSlice.reducer
export const { addStat } = statsSlice.actions
export const selectStats = (state: RootState) => state.stats