import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { ERRORE, INDEX_UTENTE } from "../utility/Route";
import { updateConto } from "../service/adminService";
import { findContoUtente, insertTransazione } from "../service/utenteService";
import { setConto } from "../store/slice/contoSlice";






export default function Deposito({setErrore}){


    const utente = useSelector(state => state.utente);
    const conto = useSelector(state => state.conto);
    const dispatch = useDispatch();
    const history = useHistory();
    const [visibile,setVisibile] = useState(false)
    const [visibile2,setVisibile2] = useState(false)
    const [messaggio,setMessaggio]= useState("")
    const [aggiornamento,setAggiornamento] = useState(false)
    const [importo,setImporto] = useState();


    useEffect(()=>{
        if(utente.ruolo){
            if(utente.ruolo.id == 2){
            
            } else {
                const errore = {
                    titoloErrore:"ACCESSO NON AUTORIZZATO",
                    descrizioneErrore:"Non hai i permessi per visualizzare la pagina"
                }
                setErrore(errore);
                history.push(ERRORE)
            }
        }else {
            const errore = {
                titoloErrore: "UTENTE NON RICONOSCIUTO",
                descrizioneErrore: "Effettua il login"
            }
            setErrore(errore);
            history.push(ERRORE)
        }
        
        if(conto.stato){
            if(conto.stato.id==2 || conto.stato.id==3 ){
                const errore = {
                    titoloErrore:"CONTO CHIUSO O DISABILITATO",
                    descrizioneErrore:"Siamo spiacenti ma non puoi effetturare operazioni su questo conto"
                    
                }
                setErrore(errore);
                history.push(ERRORE)
            }
        }

        findContoUtente(utente,setVisibile,setMessaggio,setConto,dispatch);


       
    },[aggiornamento])

    function effettuaDeposito(){
        const contoAggiornato = {...conto}
        const tipo={
            id:1
        }
        const statoTransazione={
            id:1
        }
      
        const transazione = {
            conto:{...contoAggiornato},
            importo:importo,
            tipo:tipo,
            statoTransazione:statoTransazione,
        }
        
        if(importo<20000){
            insertTransazione(transazione).then ((response)=>{
                if(response.data){
                    setVisibile2(true)
                    setAggiornamento(!aggiornamento)
                    setImporto("")
                    const importoNumero = parseFloat(importo)
                    const importoFormattato = importoNumero.toFixed(2);
                    setMessaggio("Hai depositato un importo di € "+importoFormattato+" sul tuo conto numero "+conto.numeroConto)
                }
            }).catch(error => {
                if(error.response){
                    if (error.response.data) {
                        setVisibile(true)
                        setMessaggio(error.response.data)
                      }
                }
                 else {
                  setMessaggio("Errore sconosciuto");
                }
              })
    
        }else{
            setMessaggio("Non è possibile effettuare depositi sopra € 20.000")
            setAggiornamento(!aggiornamento)
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

    return(

        <>
        <div className="div"> 
        <div className="container"> 
            <div className="div-container" style={{textAlign:"left"}}>
            <h1> EFFETTUA UN DEPOSITO</h1>
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
                <br/>
                <br/>
                <label style={{marginLeft:140}} for="importo"><b>INSERISCI L'IMPORTO: </b></label>
                <input style={{marginTop:10,marginLeft:100, width:255}} onChange={(e) => setImporto(e.target.value)} value={importo} type="number" placeholder="Inserisci l'importo da depositare"></input>
                <button style={{marginTop:20,marginLeft:135, width:180}} onClick={ ()=>effettuaDeposito()} type="button" className="">DEPOSITA</button>
                <button style={{marginLeft:125, width:200}} onClick={ ()=> history.push(INDEX_UTENTE)} type="button" className="">TORNA AL MENU</button>
                {errorBanner(messaggio)}


            </div>
        </div>

        </div>
        

        </>
    )




}