import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '../../app/store'
import { IWheel, IWheelItem } from '../../util/interfaces'


const initialState: {
  wheel?: IWheel;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
} = {
  status: 'idle',
}

export const fetchMyWheel = createAsyncThunk('myWheel/fetchMyWheel', async () => {
  const response: { data: IWheel } = await axios.get(`/api/wheels/my`)
  return response.data
})


const myWheelSlice = createSlice({
  name: 'myWheel',
  initialState,
  reducers: {
    updateBorder: (state, action) => {
      if (state.wheel)
        state.wheel.border = action.payload
    },
    updateBackground: (state, action) => {
      if (state.wheel)
        state.wheel.background = action.payload
    },
    updatePointer: (state, action) => {
      if (state.wheel)
        state.wheel.pointer = action.payload
    },
    updateDot: (state, action) => {
      if (state.wheel)
        state.wheel.dot = action.payload
    },
    updateItem: (state, action) => {
      const payload: {
        tempId?: number,
        item: IWheelItem,
      } = action.payload
      if (state.wheel && state.wheel.items) {
        if (payload.tempId) {
          let item = state.wheel.items.find(x => x.id === payload.tempId)
          if (item) {
            item.id = payload.item.id
            item.wheelId = payload.item.wheelId
            item.label = payload.item.label
            item.title = payload.item.title
            item.altColor = payload.item.altColor
            item.fontColor = payload.item.fontColor
            item.hours = payload.item.hours
            item.image = payload.item.image
            item.imageMode = payload.item.imageMode
            item.type = payload.item.type
            item.comments = payload.item.comments
            item.coop = payload.item.coop
            item.difficulty = payload.item.difficulty
            item.loading = false
          }
        }
        else {
          let item = state.wheel.items.find(x => x.id === +payload.item.id)
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
            item.coop = typeof payload.item.coop === 'string' ? payload.item.coop : item.coop
            item.difficulty = typeof payload.item.difficulty !== 'undefined' ? payload.item.difficulty : item.difficulty
          }
        }
      }
    },
    addItem: (state, action) => {
      if (state.wheel && state.wheel.items) {
        state.wheel.items = state.wheel.items.concat([{ id: action.payload, loading: true }])
      }
    },
    deleteItem: (state, action) => {

      if (state.wheel && state.wheel.items) {
        state.wheel.items = state.wheel.items.filter(x => x.id !== action.payload)
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMyWheel.pending, (state, action) => {
      state.status = 'loading'
    })
    builder.addCase(fetchMyWheel.fulfilled, (state, action) => {
      state.status = 'succeeded'
      state.wheel = action.payload
    })
    builder.addCase(fetchMyWheel.rejected, (state, action) => {
      state.status = 'failed'
      state.error = action.payload as string
    })


  }
})

export default myWheelSlice.reducer
export const { updateBorder, updateBackground, updatePointer, updateDot, updateItem, addItem, deleteItem } = myWheelSlice.actions
export const selectMyWheel = (state: RootState) => state.myWheel