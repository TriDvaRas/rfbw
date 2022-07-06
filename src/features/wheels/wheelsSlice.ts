import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '../../app/store'
import { IWheel, IWheelItem } from '../../util/interfaces'


const initialState: {
  wheels?: Array<IWheel>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
} = {
  status: 'idle',
}

export const fetchWheels = createAsyncThunk('wheels/fetchWheels', async () => {
  const response: { data: Array<IWheel> } = await axios.get(`/api/wheels`)
  return response.data
})


const wheelsSlice = createSlice({
  name: 'wheels',
  initialState,
  reducers: {
    updateWheel: (state, action) => {
      if (state.wheels) {
        let wheel = state.wheels.find(x => x.id === action.payload.id)
        if (wheel) {
          if (action.payload.border) wheel.border = action.payload.border
          if (action.payload.background) wheel.background = action.payload.background
          if (action.payload.dot) wheel.dot = action.payload.dot
          if (action.payload.pointer) wheel.pointer = action.payload.pointer
        }
      }
    },
    addItem: (state, action) => {
      const payload: {
        wheelId: number,
        item: IWheelItem,
      } = action.payload
      if (state.wheels) {
        let wheel = state.wheels.find(x => x.id === +payload.wheelId)
        if (wheel && wheel.items) {
          wheel.items = wheel.items.concat([payload.item])
        }
      }
    },
    deleteItem: (state, action) => {
      const payload: {
        wheelId: number,
        itemId: number,
      } = action.payload
      if (state.wheels) {
        let wheel = state.wheels.find(x => x.id === +payload.wheelId)
        if (wheel && wheel.items) {
          wheel.items = wheel.items.filter(x => x.id !== payload.itemId)
        }
      }
    },
    updateItem: (state, action) => {
      const payload: {
        wheelId: number,
        item: IWheelItem,
      } = action.payload
      if (state.wheels) {
        let wheel = state.wheels.find(x => x.id === +payload.wheelId)
        if (wheel && wheel.items) {
          let item = wheel.items.find(x => x.id === +payload.item.id)
          if (item) {
            item.label = typeof payload.item.label === 'string' ? payload.item.label : item.label
            item.title = typeof payload.item.title === 'string' ? payload.item.title : item.title
            item.altColor = typeof payload.item.altColor === 'string' ? payload.item.altColor : item.altColor
            item.fontColor = typeof payload.item.fontColor === 'string' ? payload.item.fontColor : item.fontColor
            item.hours = typeof payload.item.hours === 'string' || typeof payload.item.hours === 'number' ? payload.item.hours : item.hours
            item.image = typeof payload.item.image === 'string' ? payload.item.image : item.image
            item.imageMode = typeof payload.item.imageMode === 'string' ? payload.item.imageMode : item.imageMode
            item.type = typeof payload.item.type === 'string' ? payload.item.type : item.type
            item.comments = typeof payload.item.comments === 'string' ? payload.item.comments : item.comments
            item.disabled = typeof payload.item.disabled === 'boolean' ? payload.item.disabled : item.disabled
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchWheels.pending, (state, action) => {
      state.status = 'loading'
    })
    builder.addCase(fetchWheels.fulfilled, (state, action) => {
      state.status = 'succeeded'
      state.wheels = action.payload
    })
    builder.addCase(fetchWheels.rejected, (state, action) => {
      state.status = 'failed'
      state.error = action.payload as string
    })


  }
})

export default wheelsSlice.reducer
export const { addItem, deleteItem, updateWheel, updateItem } = wheelsSlice.actions
export const selectWheels = (state: RootState) => state.wheels