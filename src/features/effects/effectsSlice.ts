import axios from 'axios'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { IEffect, } from '../../util/interfaces'


const initialState: {
  effects?: Array<IEffect>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
  isSpinning: boolean;
  queue?: Array<IEffect>;
} = {
  status: 'idle',
  isSpinning: false,
}

export const fetchEffects = createAsyncThunk('effects/fetchEffects', async () => {
  const response: { data: Array<IEffect> } = await axios.get(`/api/effects`)
  return response.data
})


const effectsSlice = createSlice({
  name: 'effects',
  initialState,
  reducers: {
    updateEffects: (state, action) => {
      if (state.isSpinning)
        state.queue = action.payload
      else
        state.effects = action.payload
    },
    setEffectsWheelSpinning: (state, action) => {
      state.isSpinning = action.payload
      if (action.payload === false && state.queue) {
        state.effects = state.queue
        state.queue = undefined
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchEffects.pending, (state, action) => {
      state.status = 'loading'
    })
    builder.addCase(fetchEffects.fulfilled, (state, action) => {
      state.status = 'succeeded'
      state.effects = action.payload
    })
    builder.addCase(fetchEffects.rejected, (state, action) => {
      state.status = 'failed'
      state.error = action.payload as string
    })


  }
})

export default effectsSlice.reducer
// eslint-disable-next-line no-empty-pattern
export const { updateEffects, setEffectsWheelSpinning } = effectsSlice.actions
export const selectEffects = (state: RootState) => state.effects