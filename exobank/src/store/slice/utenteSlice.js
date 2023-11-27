import {createSlice} from "@reduxjs/toolkit";


const initialState = {

}

export const utenteSlice = createSlice({
  name: "utente",
  initialState,
  reducers: {
    setUtente: (state,action) =>{
        return state= action.payload
    },
    resetUtente: (state,action) => {
        return (state=initialState)     
    }
       
  }
});

export const {
    setUtente,
    resetUtente
} = utenteSlice.actions

export default utenteSlice.reducer