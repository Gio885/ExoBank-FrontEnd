import axios from "axios"
import {ULR_INSERT_TRANSAZIONE, ULR__FIND_CONTO_UTENTE, URL_DOWNLOAD_LISTA_TRANSAZIONI, URL_DOWNLOAD_LISTA_TRANSAZIONI_EXCEL, URL_INSERT_CONTO, URL_LISTA_TRANSAZIONI_UTENTE, URL_LOGIN, URL_REGISTRAZIONE } from "../utility/Endpoint"
import { INDEX_ADMIN, INDEX_UTENTE } from "../utility/Route"
import { email,emailAperturaConto,emailBenvenuto } from "./emailService"

/*async: Questa parola chiave viene utilizzata prima di una funzione per dichiararla come asincrona.
 Le funzioni asincrone possono contenere l'operatore await. Quando una funzione è dichiarata come asincrona, 
 questa restituirà sempre una promessa implicitamente.

await: Questa parola chiave può essere utilizzata all'interno di una funzione asincrona per "attendere" il completamento di una promessa.
 Quando si utilizza await su una promessa, la funzione asincrona si "blocca" finché la promessa non viene risolta o rigettata. 
 Questo consente di scrivere codice asincrono in uno stile più simile al codice sincrono.
*/


export async function utenteLogin(utente,dispatch,setUtente,setPaginaCorrente,history,setMessaggio,setVisibile){
    return await axios.post(URL_LOGIN,utente).then((response) => {
        console.log(response)
        if (response.data) {
          dispatch(setUtente(response.data))
          if (response.data.ruolo.id === 2) {
            const pagina = "indexUtente"
            setPaginaCorrente(pagina)
            history.push(INDEX_UTENTE)
          } else { setPaginaCorrente("indexAdmin")
           history.push(INDEX_ADMIN)}

        }
      }).catch(error => {
        if (error.response) {
          setMessaggio(error.response.data)
          setVisibile(true)
        } else {
          setMessaggio("Errore sconosciuto");
        }
      })
}
export async function insertConto(utente,setMessaggio,setVisibile,setVisibile2){
    return await axios.post(URL_INSERT_CONTO,utente).then( (response) =>{
        setMessaggio("La tua richiesta di apertura conto è stata presa in carico. Conto numero " + response.data.data.numeroConto)
        emailAperturaConto(utente);
        setVisibile2(true)
    }).catch(error =>{
        setMessaggio("C'e stato un errore, contatta l'assistenza "+error.response.data)
        setVisibile(true)
      })
}

export async function registrazione(utente,dispatch,setUtente,setMessaggio,setVisibile,setVisibile2){
    return await axios.post(URL_REGISTRAZIONE,utente).then((response) => {
        if (response.data) {
          console.log(response.data)
          dispatch(setUtente(response.data));
          setMessaggio("Registrazione effettuata con successo, a breve riceverai una email di conferma attivazione. Stai per essere reindirizzato al menu principale");
          setVisibile2(true);
          emailBenvenuto(response.data,1)
        } else {
          alert("Qualcosa è andato storto");
        }
      }).catch(error => {
        if (error.response && error.response.status) {
          setVisibile(true);
          setMessaggio(error.response.data);
        } else {
          setVisibile(true);
          setMessaggio(error.response.status)
          setMessaggio("Errore sconosciuto");
        }
      });
}

export async function findContoUtente(utente,setVisibile,setMessaggio,setConto,dispatch){
    return await axios.post(ULR__FIND_CONTO_UTENTE,utente).then((response) => {
        if (response.data.success) {
            dispatch(setConto(response.data.data))
        } else {
            dispatch(setConto(""))
        }
    }).catch(error => {
        if (error.response.data) {
            setVisibile(true)
            setMessaggio(error.response.data)
        } else {
            setVisibile(true)
            setMessaggio("Errore sconosciuto");
        }
    })
}
export async function insertTransazione(transazione){
    return await axios.post(ULR_INSERT_TRANSAZIONE,transazione)
}
export async function transazioniUtente(utente,setListaTransazioni){
    return await axios.post(URL_LISTA_TRANSAZIONI_UTENTE,utente).then((response) => {
        console.log(response.data.data)
        setListaTransazioni(response.data.data)
    })

}
export async function downloadTransazioniExcel(utente){
    return await axios.post(URL_DOWNLOAD_LISTA_TRANSAZIONI_EXCEL,utente)
}
export async function downloadTransazioniWord(utente){
    return await axios.post(URL_DOWNLOAD_LISTA_TRANSAZIONI_EXCEL,utente)
}