import { useDispatch, useSelector } from "react-redux"
import { ERRORE,INDEX_UTENTE } from "../utility/Route";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { useEffect, useState } from "react";
import { insertTransazione } from "../service/utenteService";


export default function Prelievo({ setErrore }) {




    const utente = useSelector(state => state.utente);
    const conto = useSelector(state => state.conto);
    const history = useHistory();
    const [importo,setImporto]=useState()
    const [visibile,setVisibile] = useState(false)
    const [visibile2,setVisibile2] = useState(false)
    const [messaggio,setMessaggio]= useState("")


    useEffect(() => {

        if (utente.ruolo) {
            if (utente.ruolo.id == 2) {

            } else {
                const errore = {
                    titoloErrore: "ACCESSO NON AUTORIZZATO",
                    descrizioneErrore: "Non hai i permessi per visualizzare la pagina"
                }
                setErrore(errore)
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

        if (conto.stato) {
            if (conto.stato.id == 2 || conto.stato.id == 3) {
                const errore = {
                    titoloErrore: "Conto chiuso o disabilitato",
                    descrizioneErrore: "Siamo spiacenti ma non puoi effetturare operazioni su questo conto"

                }
                setErrore(errore);
                history.push(ERRORE)
            }
        }



    }, []);


    function preleva(){
        if(importo<1000){
            if(importo>0){
                if(importo<=conto.saldo){
                    const tipo={
                        id:2
                    }
                    const statoTransazione={
                        id:3
                    }
                   
                    const transazione={
                        conto:{...conto},
                        importo:(importo),
                        tipo:tipo,
                        statoTransazione:statoTransazione,
                    }
                    insertTransazione(transazione).then((response)=>{
                        if(response.data){
                            setVisibile2(true)
                            setImporto("")
                            setMessaggio("La tua richiesta di prelievo è stata presa in carico")
                            }
                        }).catch(error => {
                            if (error.response.data) {
                              setVisibile(true)
                              setMessaggio(error.response.data)
                            } else {
                              setMessaggio("Errore sconosciuto");
                            }
                          })
                }else{
                    setMessaggio("Operazione non consentita, importo superiore al saldo")
                    setVisibile(true)
                    setImporto("") 
                }
                
            }else{
                setMessaggio("Inserisci un importo positivo")
                setVisibile(true)
                setImporto("")
            }        
        }else{
            setMessaggio("Non è possibile richiedere un prelievo superiore a € 1000.00")
            setVisibile(true)
            setImporto("")
        }
    }


    function errorBanner(messaggio) {
        if (visibile) {
          setTimeout(() => {
            setImporto("")
            setVisibile(false);
            setMessaggio("");
          }, 5000);
          return (
            <div style={{ color: "red" }} className="error-banner">
              {messaggio}
            </div>
          );
        } else if (visibile2) {
          setTimeout(() => {
            setImporto("")
            setVisibile2(false);
            setMessaggio("");
          }, 5000);
          return (
            <div style={{ color: "green" }} className="error-banner">
              {messaggio}
            </div>
          );
        } else {
          return null;
        }
      }

    return (
        <>
        <div className="div"> 
        <div className="container"> 
            <div className="div-container" style={{textAlign:"left"}}>
            <h1> EFFETTUA UN PRELIEVO</h1>
                <h3>I tuoi dati:</h3>
                <label for="nome"><b>NOME: </b></label>
                <label style={{marginLeft:5}} for="nome"> {utente.nome}</label>
                <br/>
                <label for="nome"><b>COGNOME: </b></label>
                <label style={{marginLeft:5}} for="nome"> {utente.cognome}</label>
                <br/>
                <label for="nome"><b>CODICE FISCALE: </b></label>
                <label style={{marginLeft:5}} for="nome"> {utente.codiceFiscale}</label>
                <br/>
                <label for="nome"><b>CONTO NUMERO: </b></label>
                <label style={{marginLeft:5}} for="nome"> {conto.numeroConto}</label>
                <br/>
                <label for="nome"><b>STATO: </b></label>
                <label style={{marginLeft:5}} for="nome">{conto.stato ? <>{conto.stato.statoContoCorrente}</>:<></>} </label>
                <br/>
                <label for="nome"><b>IL TUO SALDO: </b></label>
                <label style={{marginLeft:5}} for="nome"> € {conto.saldo} </label>
                <br />
                <br />
                <label style={{marginLeft:140}} for="importo"><b>INSERISCI L'IMPORTO: </b></label>
                <input style={{marginTop:10,marginLeft:100, width:255}} onChange={(e) => setImporto(e.target.value)} value={importo} type="number" placeholder="Inserisci l'importo da prelevare"></input>
                <button style={{marginTop:20,marginLeft:135, width:180}} onClick={ ()=> preleva()} type="button" className="">PRELEVA</button>
                <button style={{marginLeft:125, width:200}} onClick={ ()=> history.push(INDEX_UTENTE)} type="button" className="">TORNA AL MENU</button>
                {errorBanner(messaggio)}
            </div>
        </div>

        </div>
        

        </>






    )



}