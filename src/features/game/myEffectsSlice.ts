import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '../../app/store'
import { IEffectState, } from '../../util/interfaces'


const initialState: {
    effects?: Array<IEffectState>;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error?: string;
} = {
    status: 'idle',
}

export const fetchMyEffects = createAsyncThunk('myEffects/fetchMyEffects', async () => {
    const response: { data: Array<IEffectState> } = await axios.get(`/api/game/myeffects`)
    return response.data
})


const myEffectsSlice = createSlice({
    name: 'myEffects',
    initialState,
    reducers: {
        addEffect: (state, action) => {
            if (state.effects)
                state.effects = [...state.effects, action.payload]
        },
        updateEffectVars: (state, action) => {
            if (state.effects) {
                const effect = state.effects.find(x => x.id === action.payload.effectStateId)
                if (effect)
                    effect.variables = action.payload.vars
            }
        },
        endEffect: (state, action) => {
            if (state.effects) {
                if (action.payload.effectStateId) {
                    state.effects = state.effects.filter(x => x.id !== action.payload.effectStateId)
                }
                else {
                    const effect = state.effects.find(x => x.effect.id === action.payload.effectId)
                    if (effect)
                        state.effects = state.effects.filter(x => x.id !== effect.id)
                }
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchMyEffects.pending, (state, action) => {
            state.status = 'loading'
        })
        builder.addCase(fetchMyEffects.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.effects = action.payload
        })
        builder.addCase(fetchMyEffects.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.payload as string
        })
    }
})

export default myEffectsSlice.reducer
export const { endEffect, addEffect, updateEffectVars } = myEffectsSlice.actions
export const selectMyEffects = (state: RootState) => state.myEffects