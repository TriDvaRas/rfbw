import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'

export const eggSlice = createSlice({
  name: 'egg',
  initialState: {
    enabled: false,
    eggword: 'mabushii',
    counter: 0
  },
  reducers: {
    enable: state => {
      state.enabled = true
    },
    disable: state => {
      state.enabled = false
    },
    handleKeyPress: (state, action) => {
      let key = action.payload
      if (state.eggword[state.counter] === key) {
        state.counter += 1
        if (state.counter === state.eggword.length)
          state.enabled = true
      }
      else {
        state.counter = 0
        if (state.eggword[state.counter] === key)
          state.counter += 1
      }
    }
  }
})

// Action creators are generated for each case reducer function
export const { enable, disable, handleKeyPress } = eggSlice.actions
export const selectEgg = (state: RootState) => state.egg
export const selectEggState = (state: RootState) => state.egg.enabled
export default eggSlice.reducer