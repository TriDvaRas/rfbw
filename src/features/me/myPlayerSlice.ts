import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '../../app/store'
import { IPlayer } from '../../util/interfaces'


const initialState: {
  player?: IPlayer;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
} = {
  status: 'idle',
}

export const fetchMyPlayer = createAsyncThunk('myPlayer/fetchMyPlayer', async () => {
  const response: { data: IPlayer } = await axios.get(`/api/players/me`)
  return response.data
})


const myPlayerSlice = createSlice({
  name: 'myPlayer',
  initialState,
  reducers: {
    updateMyPlayer: (state, action: {
      payload: { [key in keyof IPlayer]?: IPlayer[key]; },
      type: string
    }) => {
      if (state.player)
        state.player = { ...state.player, ...action.payload }
    },

  },
  extraReducers: (builder) => {
    builder.addCase(fetchMyPlayer.pending, (state, action) => {
      state.status = 'loading'
    })
    builder.addCase(fetchMyPlayer.fulfilled, (state, action) => {
      state.status = 'succeeded'
      state.player = action.payload
    })
    builder.addCase(fetchMyPlayer.rejected, (state, action) => {
      state.status = 'failed'
      state.error = action.payload as string
    })
  }
})

export default myPlayerSlice.reducer
export const { updateMyPlayer } = myPlayerSlice.actions
export const selectMyPlayer = (state: RootState) => state.myPlayer