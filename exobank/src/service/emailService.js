import axios from "axios"
import { URL_EMAIL_AGGIORNAMENTO_CONTO, URL_EMAIL_BENEVENUTO, URL_EMAIL_RICHIESTA_APERTURA_CONTO } from "../utility/Endpoint"

export async function emailBenvenuto(utente){
  return await axios.post(URL_EMAIL_BENEVENUTO,utente).then((response)=>{

  }).catch((error)=>{
      console.log(error)
  })
}

export async function emailAperturaConto(utente){
  return await axios.post(URL_EMAIL_RICHIESTA_APERTURA_CONTO,utente).then((response)=>{

  }).catch((error)=>{
      console.log(error)
  })
}


export async function emailAggiornamentoStatoConto(utente){
  return await axios.post(URL_EMAIL_AGGIORNAMENTO_CONTO,utente).then((response)=>{

  }).catch((error)=>{
      console.log(error)
  })
}
