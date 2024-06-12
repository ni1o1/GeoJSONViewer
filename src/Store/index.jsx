import BMap from './modules/BMap'
import {configureStore} from '@reduxjs/toolkit' 
const store = configureStore({
  reducer:{
    BMap:BMap
  }
})
export default store