import { URL_LISTA_CONTI, URL_LISTA_STATO_CONTO, URL_LISTA_TIPO_TRANSAZIONE, URL_LISTA_TRANSAZIONI_ADMIN, URL_LOGIN_ADMIN, URL_STATI_TRANSAZIONE, URL_UPDATE_CONTO, URL_UPDATE_TRANSAZIONE } from "../utility/Endpoint";
import axios from "axios"
import { emailAggiornamentoStatoConto } from "./emailService";


/*async: Questa parola chiave viene utilizzata prima di una funzione per dichiararla come asincrona.
 Le funzioni asincrone possono contenere l'operatore await. Quando una funzione è dichiarata come asincrona, 
 questa restituirà sempre una promessa implicitamente.

await: Questa parola chiave può essere utilizzata all'interno di una funzione asincrona per "attendere" il completamento di una promessa.
 Quando si utilizza await su una promessa, la funzione asincrona si "blocca" finché la promessa non viene risolta o rigettata. 
 Questo consente di scrivere codice asincrono in uno stile più simile al codice sincrono.
*/



export async function listaConti(setConti,conto){
    return await axios.get(URL_LISTA_CONTI).then((response) => {
        if (response) {
            setConti(response.data.data.filter((e) => e.numeroConto != conto.numeroConto))
        }
    }).catch(error => {
        console.error("Qualcosa è andato storto", error)
    })

}

export async function listaStatiConto(setStati){
    return await axios.get(URL_LISTA_STATO_CONTO).then((response) => {
        setStati(response.data)
    })
}
export async function updateConto(conto,setAggiornamento,setMessaggio,setVisibile,setVisibile2,aggiornamento){
    return await axios.put(URL_UPDATE_CONTO,conto).then( (response) => {
        if(response.data){
            setAggiornamento(!aggiornamento)
            setVisibile2(true)
            setMessaggio("Conto numero: "+conto.numeroConto+" aggiornato con successo")  
            emailAggiornamentoStatoConto(response.data)
        }else{
            setAggiornamento(!aggiornamento)
            setVisibile(true)
            setMessaggio("C'è stato un errore durante l'operazione, contatta l'amministratore") 
        }
        
    })
}
export async function listaTransazioniAdmin(setListaTransazioni){
    return await axios.get(URL_LISTA_TRANSAZIONI_ADMIN).then((response) => {
        if (response.data.success) {
            setListaTransazioni(response.data.data)
            console.log(response.data.data)
        }
    })
}
export async function listaStatiTransazione(setStatiTransazione){
    return await axios.get(URL_STATI_TRANSAZIONE).then((response) => {
        if (response.data) {            // shift rimuove e restituisce il primo elemento di una lista
            response.data.pop();        // pop rimuove e restituisce l'ultimo elemento di una lista
            console.log(response.data)
            setStatiTransazione(response.data)
        }
    })
}
export async function updateTransazione(transazione,setAggiornamento,setVisibile,setVisibile2,setMessaggio,aggiornamento){
    return await axios.put(URL_UPDATE_TRANSAZIONE,transazione).then((response) => {
        if (response.data) {
            setAggiornamento(!aggiornamento)
            setVisibile2(true)
            setMessaggio("Transanzione aggiornata con successo")
        }
    }).catch(error => {
        setAggiornamento(!aggiornamento)
        setVisibile(true)
        setMessaggio("Errore durante la transazione: "+error.response.data)
    })
}
export async function listaTipoTransazione(setListaOperazioni){
    return await axios.get(URL_LISTA_TIPO_TRANSAZIONE).then((response) => {
        if (response.data) {
            setListaOperazioni(response.data)
        }
    }).catch(error => {
        console.error("Qualcosa è andato storto", error)
    })
}