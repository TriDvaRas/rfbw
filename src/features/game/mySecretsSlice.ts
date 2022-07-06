import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '../../app/store'
import { ISecretState, } from '../../util/interfaces'


const initialState: {
    secrets?: Array<ISecretState>;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error?: string;
} = {
    status: 'idle',
}

export const fetchMySecrets = createAsyncThunk('mySecrets/fetchMySecrets', async () => {
    const response: { data: Array<ISecretState> } = await axios.get(`/api/game/mysecrets`)
    return response.data
})


const mySecretsSlice = createSlice({
    name: 'mySecrets',
    initialState,
    reducers: {
        addSecret: (state, action) => {
            if (state.secrets)
                state.secrets = [...state.secrets, action.payload]
        },
        endSecret: (state, action) => {
            if (state.secrets) {
                if (action.payload.secretStateId) {
                    state.secrets = state.secrets.filter(x => x.id !== action.payload.secretStateId)
                }
                else {
                    const secret = state.secrets.find(x => x.effect.id === action.payload.effectId)
                    if (secret)
                        state.secrets = state.secrets.filter(x => x.id !== secret.id)
                }
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchMySecrets.pending, (state, action) => {
            state.status = 'loading'
        })
        builder.addCase(fetchMySecrets.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.secrets = action.payload
        })
        builder.addCase(fetchMySecrets.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.payload as string
        })
    }
})

export default mySecretsSlice.reducer
export const { endSecret, addSecret } = mySecretsSlice.actions
export const selectMySecrets = (state: RootState) => state.mySecrets