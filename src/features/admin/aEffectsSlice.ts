import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '../../app/store'
import { IAEffect } from '../../util/interfaces'


const initialState: {
  effects?: Array<IAEffect>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
} = {
  status: 'idle',
}

export const fetchAEffects = createAsyncThunk('effects/fetchAEffects', async () => {
  const response: { data: Array<IAEffect> } = await axios.get(`/api/effects`)
  return response.data
})


const effectsSlice = createSlice({
  name: 'aEffects',
  initialState,
  reducers: {
    updateEffect: (state, action: {
      payload: {
        [key in keyof IAEffect]?: IAEffect[key];
      },
      type: string
    }) => {
      const payload = action.payload
      if (state.effects) {
        console.dir(state.effects);
        console.dir(payload);
        
        let effect = payload.tempId ? state.effects.find(x => x.id === payload.tempId) : state.effects.find(x => x.id === payload.id)
        console.dir(effect);
        if (effect) {
          // effect = { ...effect, ...payload } //TODO check if this works //it does not...
          if (typeof payload.id === 'number') effect.id = payload.id
          if (typeof payload.title === 'string') effect.title = payload.title
          if (typeof payload.description === 'string') effect.description = payload.description;
          if (typeof payload.groupId === 'number') effect.groupId = payload.groupId === 0 ? undefined : payload.groupId;
          if (typeof payload.isCard === 'boolean') effect.isCard = payload.isCard;
          if (typeof payload.isSecret === 'boolean') effect.isSecret = payload.isSecret;
          if (typeof payload.isPositive === 'boolean') effect.isPositive = payload.isPositive;
          if (typeof payload.isNegative === 'boolean') effect.isNegative = payload.isNegative;
          effect.loading = false;
        }
      }
    }, 
    addEffect: (state, action) => {
      if (state.effects) {
        state.effects = state.effects.concat([{ id: action.payload, loading: true }])
      }
    },
    deleteEffect: (state, action) => {
      if (state.effects) {
        state.effects = state.effects.filter(x => x.id !== action.payload)
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAEffects.pending, (state, action) => {
      state.status = 'loading'
    })
    builder.addCase(fetchAEffects.fulfilled, (state, action) => {
      state.status = 'succeeded'
      state.effects = action.payload
    })
    builder.addCase(fetchAEffects.rejected, (state, action) => {
      state.status = 'failed'
      state.error = action.payload as string
    })


  }
})

export default effectsSlice.reducer
export const { updateEffect, addEffect, deleteEffect } = effectsSlice.actions
export const selectAEffects = (state: RootState) => state.aEffects