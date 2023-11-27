import { useDispatch, useSelector } from "react-redux"
import { resetUtente } from "../store/slice/utenteSlice";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { useState, useEffect } from "react";
import { ERRORE, HOME, LISTA_CONTI, LISTA_TRANSAZIONI } from "../utility/Route";
import { URL_LISTA_CONTI } from "../utility/Endpoint";


export default function IndexAdmin({setErrore, setPaginaCorrente,setPaginaTabelle}){

    const utente = useSelector(state => state.utente);
    const dispatch = useDispatch();
    const history = useHistory();

    


    useEffect( ()=>{

        setPaginaCorrente("indexAdmin")

       
        if(utente.ruolo){
            if (utente.ruolo.id == 1) {

            } else {
                const errore = {
                    titoloErrore: "ACCESSO NON AUTORIZZATO",
                    descrizioneErrore: "Non hai i permessi per visualizzare la pagina"
                }
                setErrore(errore);
                history.push(ERRORE)
            }
        } else {
            const errore = {
                titoloErrore: "UTENTE NON RICONOSCIUTO",
                descrizioneErrore: "Effettua il login"
            }
            setErrore(errore);
            history.push(ERRORE)
        }


        return () => {
            setPaginaCorrente("")
        }

        
    },[])


    function logout() {

        dispatch(resetUtente())
        history.push(HOME)

    }

    function reindirizza(rotta) {

        (rotta == LISTA_TRANSAZIONI || rotta == LISTA_CONTI || rotta == "lista utente") ? (
            <>
            {setPaginaTabelle(true)}
            {history.push(rotta)}
            </>
        ) : (
            <>
            {history.push(rotta)}
            </>
        )

    }

    return (

        <>
        <>

            <div className="div">
                <div className="div-container">
                    <h3><b>Benvenuto {utente.nome} {utente.cognome}</b> </h3>
                    <h6><b>Ruolo: {(utente.ruolo) ? <> {utente.ruolo.tipoRuolo} </>:<></> }</b> </h6>
                    <p><b>Operazioni disponibili</b></p>
                    <button type="button" onClick={()=> reindirizza(LISTA_TRANSAZIONI)}>Lista transazioni</button>
                    <button type="button"onClick={()=> reindirizza(LISTA_CONTI)}>Lista conti </button>
                    <button type="button">Lista utenti</button>
                </div>
            </div>




        </>
        
        
        
        
        </>





    )

}