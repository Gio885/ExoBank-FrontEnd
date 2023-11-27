import { createSlice } from "@reduxjs/toolkit";
   
const initialState = {

}

export const contoSlice = createSlice({
  name: "conto",
  initialState,
  reducers: {
    setConto: (state,action) =>{
        return state= action.payload
    },
    resetConto: (state,action) => {
        return (state=initialState)     
    }
       
  }
});

export const {
    setConto,
    resetConto
} = contoSlice.actions

export default contoSlice.reducer