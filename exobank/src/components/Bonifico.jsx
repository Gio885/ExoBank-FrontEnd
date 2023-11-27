import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { ERRORE, INDEX_UTENTE } from "../utility/Route";
import { listaConti, updateConto } from "../service/adminService";
import { findContoUtente, insertTransazione } from "../service/utenteService";
import { setConto } from "../store/slice/contoSlice";



export default function Bonifico({ setErrore }) {


    const utente = useSelector(state => state.utente);
    const conto = useSelector(state => state.conto);
    const dispatch = useDispatch();
    const history = useHistory();
    const [visibile, setVisibile] = useState(false)
    const [messaggio, setMessaggio] = useState("")
    const [importoBonifico, setImportoBonifico] = useState();
    const [ibanBeneficiario, setIbanBeneficiario] = useState();
    const [conti, setConti] = useState();
    const [aggiornamento,setAggiornamento] = useState(false)
    const [visibile2,setVisibile2] = useState(false)


   
    useEffect(() => {

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
        listaConti(setConti,conto);




        if (conto.stato) {
            if (conto.stato.id == 2 || conto.stato.id == 3) {
                const errore = {
                    titoloErrore: "CONTO CHIUSO O DISABILITATO",
                    descrizioneErrore: "Siamo spiacenti ma non puoi effetturare operazioni su questo conto"

                }
                setErrore(errore);
                history.push(ERRORE)
            }
        }

        findContoUtente(utente,setVisibile,setMessaggio,setConto,dispatch);




    }, [aggiornamento])



    function errorBanner(messaggio) {
        if (visibile) {
          setTimeout(() => {
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
    //MA SE IO FACCIO INSERIRE L'IBAN MA COMUNQUE HO UNA FOREING KEY SULL'ID E NON SULL'IBAN SE VADO AD INSERIRE UN IBAN CHE NON E PRESENTE COSA SUCCEDE

    function bonifico() {
        if(importoBonifico>0){
            if (importoBonifico <1000) {
                if(importoBonifico< conto.saldo){
                    if(ibanBeneficiario){
                        if(ibanBeneficiario.length ==27){
                            const statoTransazione = {
                                id: 3
                            }
                            const tipoTransazione = {
                                id: 3
                            }
                            //QUI MI PRENDO IL CONTO RICICLANDOMI LA LISTA, PASSO IL CONTO ALLA TRANSAZIONE E FACCIO LA CHIAMATA PER INSERT TRANSAZIONE
                            const contoBeneficiario = conti.find((iban) => iban.numeroConto === ibanBeneficiario)   //CON IL FIND PRENDI UN OGGETTO DELLA LISTA DOVE LA CONDIZIONE SI VERIFICA
                            // CON IL FILTER PRENDI UNA LISTA DI OGGETTI DOVE LA CONDIZIONE SI VERIFICA
                
                            const transazione = {
                                conto: { ...conto },
                                importo: (importoBonifico),
                                tipo: tipoTransazione,
                                statoTransazione: statoTransazione,
                                contoBeneficiario: contoBeneficiario,
                            }
                            insertTransazione(transazione).then((response) => {
                                if (response.data) {
                                    const importo = parseFloat(importoBonifico)
                                    setMessaggio("La tua richiesta di bonifico di € "+importo.toFixed(2)+" è stata presa in carico");
                                    setVisibile2(true)
                                    setIbanBeneficiario("")
                                }
                            }).catch(error => {
                                if (error.response.data) {
                                  setVisibile(true)
                                  setMessaggio(error.response.data)
                                } else {
                                  setMessaggio("Errore sconosciuto");
                                }
                              }).catch(error => {
                                console.log(error)
                            })
                        }else{
                        setMessaggio("L'iban inserito non è valido");
                        setVisibile(true)
                        setIbanBeneficiario("")
                        }
                    }else{
                    setMessaggio("Operazione non consentita, inserisci l'iban");
                    setVisibile(true)
                    setIbanBeneficiario("")
                    }
                    
                }else{
                setMessaggio("L'importo inserito è superiore al saldo");
                setVisibile(true)
                setIbanBeneficiario("")
            } 
            }else{     
                setMessaggio("Operazione non consentita, l'importo è superiore ad € 1000.00");
                setVisibile(true)
                setIbanBeneficiario("")
            } 
        }else{
            setMessaggio("Operazione non consentita, inserisci un importo positivo");
            setVisibile(true)
            setIbanBeneficiario("")
        }
        setImportoBonifico("")
    
    }

    return (

        <>
            <div className="div">
                <div className="container">
                    <div className="div-container" style={{ textAlign: "left" }}>
                        <h1> EFFETTUA UN BONIFICO</h1>
                        <h3>I tuoi dati:</h3>
                        <label for="nome"><b>NOME: </b></label>
                        <label style={{ marginLeft: 5 }} for="nome"> {utente.nome}</label>
                        <br />
                        <label for="nome"><b>COGNOME: </b></label>
                        <label style={{ marginLeft: 5 }} for="nome"> {utente.cognome}</label>
                        <br />
                        <label for="nome"><b>CODICE FISCALE: </b></label>
                        <label style={{ marginLeft: 5 }} for="nome"> {utente.codiceFiscale}</label>
                        <br />
                        <label for="nome"><b>CONTO NUMERO: </b></label>
                        <label style={{ marginLeft: 5 }} for="nome"> {conto.numeroConto}</label>
                        <br />
                        <label for="nome"><b>STATO: </b></label>
                        <label style={{ marginLeft: 5 }} for="nome">{conto.stato ? <>{conto.stato.statoContoCorrente}</> : <></>} </label>
                        <br />
                        <label for="nome"><b>IL TUO SALDO: </b></label>
                        <label style={{ marginLeft: 5 }} for="nome"> € {conto.saldo} </label>
                        <br />
                        <br />
                        <label for="iban"><b>DIGITA IBAN BENEFICIARIO: </b></label>
                        <input style={{ marginTop: 10, width: 440 }} onChange={(e) => setIbanBeneficiario(e.target.value)} value={ibanBeneficiario} type="text" placeholder="Inserisci IBAN del beneficiario"></input>
                        <br />
                        <p><b>Oppure</b></p>
                        <label for="iban"><b>SELEZIONA IBAN BENEFICIARIO: </b></label>
                        <select
                            style={{ width: 440, height: 40, marginTop: 10, margin: 5 }}
                            onChange={(e) => setIbanBeneficiario(e.target.value)} value={ibanBeneficiario}
                        >
                            <option value=""> &nbsp;Seleziona un IBAN</option>
                            {conti
                                ? conti
                                    .filter((iban) => iban.stato.id === 1)
                                    .map((iban) => (
                                        <option key={iban.numeroConto} value={iban.numeroConto}>
                                            &nbsp;{iban.numeroConto} &nbsp;&nbsp; {iban.utente.nome} &nbsp;&nbsp; {iban.utente.cognome}
                                        </option>
                                    ))
                                : null // Aggiungi null se iban non è definito al momento
                            }
                        </select>
                        <br />
                        <br />

                        <label for="importo"><b>INSERISCI L'IMPORTO: </b></label>
                        <input style={{marginLeft:10, marginTop: 0, width: 255 }} onChange={(e) => setImportoBonifico(e.target.value)} value={importoBonifico} type="number" placeholder="Inserisci l'importo del bonifico"></input>
                        <button style={{ marginTop: 20, marginLeft: 145, padding: 4, width: 160 }} onClick={() => bonifico()} type="button" className="">FAI UN BONIFICO</button>
                        <button style={{ marginLeft: 125, width: 200 }} onClick={() => history.push(INDEX_UTENTE)} type="button" className="">TORNA AL MENU</button>
                        {errorBanner(messaggio)}


                    </div>
                </div>

            </div>


        </>
    )
}