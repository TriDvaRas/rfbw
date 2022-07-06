import axios from 'axios'
import { createSlice,  createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'


const initialState: {
  markdown?: string;
  savedById?: string;
  savedBy?: string;
  savedByAvatar?: string;
  timestamp?: string;
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  error?: string;
} = {
  status: 'idle'
}



export const fetchRules = createAsyncThunk('rules/getRules', async () => {
  const response: {
    data: {
      id: number;
      markdown: string;
      timestamp: string;
      savedById: string;
      savedBy: string;
      savedByAvatar: string;
    }
  } = await axios.get('/api/rules')
  return response.data
})


const rulesSlice = createSlice({
  name: 'rules',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchRules.pending, (state, action) => {
      state.status = 'loading'
    })
    builder.addCase(fetchRules.fulfilled, (state, action) => {
      state.status = 'succeeded'
      state.markdown = action.payload.markdown
      state.timestamp = action.payload.timestamp
      state.savedById = action.payload.savedById
      state.savedBy = action.payload.savedBy
      state.savedByAvatar = action.payload.savedByAvatar
    })
    builder.addCase(fetchRules.rejected, (state, action) => {
      state.status = 'failed'
      state.error = action.payload as string
    })
  }
})
export default rulesSlice.reducer
export const getRules = (state: RootState) => state.rules