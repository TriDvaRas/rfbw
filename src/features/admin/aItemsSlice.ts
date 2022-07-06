import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '../../app/store'
import { IWheelItem } from '../../util/interfaces'


const initialState: {
  items?: Array<IWheelItem>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: Error;
} = {
  status: 'idle',
}

export const fetchAItems = createAsyncThunk('items/fetchAItems', async () => {
  try {
    const response: { data: Array<IWheelItem> } = await axios.get(`/api/admin/items`)
    return response.data
  } catch (error:any)  {
    throw new Error(`${error.response.data} (${error.response.status})`)
  }

})


const itemsSlice = createSlice({
  name: 'aItems',
  initialState,
  reducers: {
    updateItem: (state, action) => {
      const payload: IWheelItem = action.payload
      if (state.items) {
        let item = state.items.find(x => x.id === payload.id)

        if (item) {
          if (typeof payload.id === 'number') item.id = payload.id
          item.label = typeof payload.label === 'string' ? payload.label : item.label
          item.title = typeof payload.title === 'string' ? payload.title : item.title
          item.altColor = typeof payload.altColor === 'string' ? payload.altColor : item.altColor
          item.fontColor = typeof payload.fontColor === 'string' ? payload.fontColor : item.fontColor
          item.hours = typeof payload.hours === 'string' || typeof payload.hours === 'number' ? payload.hours : item.hours
          item.image = typeof payload.image === 'string' ? payload.image : item.image
          item.imageMode = typeof payload.imageMode === 'string' ? payload.imageMode : item.imageMode
          item.type = typeof payload.type === 'string' ? payload.type : item.type
          item.comments = typeof payload.comments === 'string' ? payload.comments : item.comments
          item.loading = false;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAItems.pending, (state, action) => {
      state.status = 'loading'
    })
    builder.addCase(fetchAItems.fulfilled, (state, action) => {
      state.status = 'succeeded'
      state.items = action.payload
    })
    builder.addCase(fetchAItems.rejected, (state, action) => {
      state.status = 'failed'
      state.error = action.error as Error
    })


  }
})

export default itemsSlice.reducer
export const { updateItem, } = itemsSlice.actions
export const selectAItems = (state: RootState) => state.aItems