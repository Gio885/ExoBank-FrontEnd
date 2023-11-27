import { useDispatch, useSelector } from "react-redux"
import { resetUtente } from "../store/slice/utenteSlice";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { APRI_CONTO, BONIFICO, DEPOSITO, ERRORE, HOME, LISTA_TRANSAZIONI_UTENTE, OPERAZIONI_UTENTE, PRELIEVO } from "../utility/Route";
import {  findContoUtente, findListaConti } from "../service/utenteService";
import { useState, useEffect } from "react";
import { setConto } from "../store/slice/contoSlice";
import { resetConto } from "../store/slice/contoSlice";



function IndexUtente({ setErrore , setPaginaCorrente, setPaginaTabelle} ) {


    const utente = useSelector(state => state.utente);
    const dispatch = useDispatch();
    const history = useHistory()
    const conto = useSelector(state => state.conto);
    const [visibile,setVisibile] = useState(false)
    const [messaggio,setMessaggio]= useState("")

    useEffect(() => {


        setPaginaCorrente("indexUtente")

        if (utente.ruolo) {
            if (utente.ruolo.id == 2) {

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
        
        findContoUtente(utente,setVisibile,setMessaggio,setConto,dispatch)

        return () => {
            setPaginaCorrente("")
        }


    }, []);

    function errorBanner(messaggio){

        if (visibile) {
          setTimeout(() => {
            setVisibile(false);
            setMessaggio("");
          }, 5000);   
          return (
            <div className="error-banner">
              {messaggio}
            </div>
          );
        } else {
          // Altrimenti, non renderizzare nulla
          return null;
        }
      }
    
  

    function reindirizza(rotta) {
        (conto) ? (
            (rotta == LISTA_TRANSAZIONI_UTENTE) ? <>
            ({setPaginaTabelle(true)}
            {history.push(rotta)})    
            </>:<>
            ({history.push(rotta)})
            </>
        ) : (
            <>
            {setMessaggio("Non hai un conto")}
            {setVisibile(true)}
            </>
        )
       
    }

    function apriConto(rotta) {
        if (!conto) {
            history.push(rotta)
        } else {
            setMessaggio("Hai gia un conto")
            setVisibile(true)
        }
    }

    function datiConto(conto) {
        if (!conto) {
            return <p>Non hai ancora un conto, richiedi l'apertura di un conto per effettuare le operazioni</p>;
        } else{
            return (
                <>
                    <p style={{ marginBottom: 0 }}>
                        <b>Numero conto:</b> {conto.numeroConto}
                    </p>
                    <p style={{ marginBottom: 0 }}>
                        <b>Stato conto:</b> {(conto.stato)?<>{conto.stato.statoContoCorrente}</>:<></>}
                    </p>
                    <p style={{ marginBottom: -10 }}>
                        <b>Saldo:</b> € {(conto.saldo) ? <>{conto.saldo.toFixed(2)}</>:<>0.00</>}
                    </p>
                </>
            );
        }

        
    }

    return (
        <>
            
            <div className="div">

                <div className="div-container">
                    <h3><b>Benvenuto {utente.nome} {utente.cognome}</b> </h3>
                    <h6><b>Ruolo: {(utente.ruolo) ? <>{utente.ruolo.tipoRuolo} </> : <></>}</b> </h6>
                    <p><b>{datiConto(conto)}</b></p>
                    <p><b>Operazioni disponibili</b></p>
                    {(conto)?<><button type="button" onClick={() => reindirizza(DEPOSITO)}>Fai un deposito</button>
                    <button type="button" onClick={() => reindirizza(PRELIEVO)}>Effettua un prelievo</button>
                    <button type="button"  onClick={() => reindirizza(OPERAZIONI_UTENTE)}>Operazione veloce </button>
                    <button type="button"onClick={() => reindirizza(BONIFICO)}>Effettua un bonifico</button>
                    <button type="button" onClick={()=>reindirizza(LISTA_TRANSAZIONI_UTENTE)}>Lista transazioni</button>
                    </>:
                    <>
                    <button type="button"  onClick={() => apriConto(APRI_CONTO)}>Apri conto</button>
                    </>}
                    
                    
                    {errorBanner(messaggio)}
                </div>
            </div>




        </>
    )









} export default IndexUtente