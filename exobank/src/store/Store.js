import { configureStore } from "@reduxjs/toolkit";
import utenteSlice from "./slice/utenteSlice";
import contoSlice from "./slice/contoSlice";



export  const store = configureStore({
        reducer:{
            utente : utenteSlice,
            conto : contoSlice
        }
})


