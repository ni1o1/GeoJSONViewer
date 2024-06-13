//编写store
import { createSlice } from "@reduxjs/toolkit"
const bmapStore = createSlice({
  name: 'BMap',
  initialState: {
    map: null,
    customlayers:[],
    tooltip:{
      x:'0',
      y:'0',
      show:false,
      info:{}
    },
    currentcoords:{
      bd09coord:[0,0],
      gcj02coord:[0,0],
      wgs84coord:[0,0]
    }
  },
  reducers: {
    setMap(state, action) {
      state.map = action.payload;
    },
    addCustomLayers(state, action) {
      state.customlayers = [...state.customlayers, action.payload]
    },
    removeCustomLayers(state, action) {
      state.customlayers = state.customlayers.filter(item => item.layerName != action.payload)
    },
    setTooltip(state, action) {
      state.tooltip = action.payload
    },
    setCurrentCoords(state, action) {
      state.currentcoords = action.payload
    }
  }
})
const { setMap,addCustomLayers,removeCustomLayers,setTooltip,setCurrentCoords } = bmapStore.actions
export { setMap,addCustomLayers,removeCustomLayers,setTooltip,setCurrentCoords }

const reducer = bmapStore.reducer
export default reducer