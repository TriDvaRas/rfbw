import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '../../app/store'
import { ICardState, } from '../../util/interfaces'


const initialState: {
    cards?: Array<ICardState>;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error?: string;
} = {
    status: 'idle',
}

export const fetchMyCards = createAsyncThunk('myCards/fetchMyCards', async () => {
    const response: { data: Array<ICardState> } = await axios.get(`/api/game/mycards`)
    return response.data
})


const myCardsSlice = createSlice({
    name: 'myCards',
    initialState,
    reducers: {
        addCard: (state, action) => {
            if (state.cards)
                state.cards = [...state.cards, action.payload]
        },
        endCard: (state, action) => {
            if (state.cards) {
                if (action.payload.cardStateId) {
                    state.cards = state.cards.filter(x => x.id !== action.payload.cardStateId)
                }
                else {
                    const card = state.cards.find(x => x.effect.id === action.payload.effectId)
                    if (card)
                        state.cards = state.cards.filter(x => x.id !== card.id)
                }
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchMyCards.pending, (state, action) => {
            state.status = 'loading'
        })
        builder.addCase(fetchMyCards.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.cards = action.payload
        })
        builder.addCase(fetchMyCards.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.payload as string
        })
    }
})

export default myCardsSlice.reducer
export const { endCard, addCard } = myCardsSlice.actions
export const selectMyCards = (state: RootState) => state.myCards