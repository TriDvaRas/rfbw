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



export const fetchARules = createAsyncThunk('rules/getARules', async () => {
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


const aRulesSlice = createSlice({
  name: 'aRules',
  initialState,
  reducers: {
    updateMarkdown: (state, action) => {
      if (state.markdown) {
        state.markdown = action.payload
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchARules.pending, (state, action) => {
      state.status = 'loading'
    })
    builder.addCase(fetchARules.fulfilled, (state, action) => {
      state.status = 'succeeded'
      state.markdown = action.payload.markdown
      state.timestamp = action.payload.timestamp
      state.savedById = action.payload.savedById
      state.savedBy = action.payload.savedBy
      state.savedByAvatar = action.payload.savedByAvatar
    })
    builder.addCase(fetchARules.rejected, (state, action) => {
      state.status = 'failed'
      state.error = action.payload as string
    })
  }
})
export default aRulesSlice.reducer
export const { updateMarkdown } = aRulesSlice.actions
export const getARules = (state: RootState) => state.aRules