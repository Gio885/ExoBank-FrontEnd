import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ERRORE, INDEX_UTENTE } from "../utility/Route";
import { findContoUtente, insertTransazione } from "../service/utenteService";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { listaConti, listaTipoTransazione } from "../service/adminService";
import { setConto } from "../store/slice/contoSlice";
import { BOLLETTINO, BONIFICO, DEPOSITO, Operazione, PRELIEVO, RICARICA, datiConto, errorBanner, returnOperazione } from "../utility/Funzioni";



export default function OperazioniUtente({ setErrore }) {


    
    const conto = useSelector(state => state.conto);
    const utente = useSelector(state => state.utente);
    const dispatch = useDispatch();
    const history = useHistory();
    const [tipoOperazione, setTipoOperazione] = useState();
    const [conti, setConti] = useState();
    const [listaOperazioni, setListaOperazioni] = useState();
    const [visibile, setVisibile] = useState(false)
    const [visibile2, setVisibile2] = useState(false)
    const [messaggio, setMessaggio] = useState("")
    const [aggiornamento, setAggiornamento] = useState(false)
    const [importo, setImporto] = useState();
    const [ibanBeneficiario, setIbanBeneficiario] = useState();



   /*
    QUESTE SI POSSONO SPOSTARE TUTTE
        messaggio,
        setMessaggio,
        setImporto,
        visibile,
        visibile2,
        setVisibile,
        setVisibile2,
        setIbanBeneficiario,
        importo,
        ibanBeneficiario,
      */  

    useEffect(() => {

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

        listaConti(setConti,conto);

        listaTipoTransazione(setListaOperazioni);



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

    return (
        <>
            <div className="div">
                <div className="div-container">
                    <h3><b>DATI CONTO:</b></h3>
                    <br />
                    <p><b>{datiConto(conto)}</b></p>
                    <p><b>Effettua un operazione</b></p>
                    <select
                        style={{ marginTop: 10, margin: 5 }}
                        onChange={(e) => setTipoOperazione(e.target.value)}
                    >
                        <option value="" >Seleziona un operazione</option>
                        {listaOperazioni ? (
                            <>
                                {listaOperazioni.map((o) => (
                                    <option key={o.id} value={o.id}>
                                        {o.tipoTransazione}
                                    </option>
                                ))}
                            </>
                        ) : (
                            <>
                            </>
                        )}
                    </select>
                    {returnOperazione(tipoOperazione,
                                        messaggio,
                                        setMessaggio,
                                        setImporto,
                                        visibile,
                                        visibile2,
                                        setVisibile,
                                        setVisibile2,
                                        setIbanBeneficiario,
                                        conti,
                                        importo,
                                        ibanBeneficiario,
                                        conto,
                                        setAggiornamento,
                                        aggiornamento
                    )}
                </div>
            </div>
        </>
    )
}