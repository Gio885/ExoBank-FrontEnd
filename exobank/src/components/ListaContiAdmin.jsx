import { useState, useEffect } from "react"
import { listaConti, listaStatiConto, updateConto } from "../service/adminService"
import axios from "axios";
import { URL_LISTA_CONTI } from "../utility/Endpoint";
import { findConto } from "../service/utenteService";
import { ERRORE, INDEX_ADMIN, LISTA_CONTI } from "../utility/Route";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { useSelector } from "react-redux";
import { errorBanner, modificaStato } from "../utility/Funzioni";



export default function ListaContiAdmin({setErrore,setPaginaTabelle}) {


    const utente = useSelector(state => state.utente);
    const [conti, setConti] = useState();
    const [stati, setStati] = useState();
    const [id_stato, setId_Stato] = useState();
    const [aggiornamento,setAggiornamento]= useState(true)
    const history = useHistory();
    const [visibile,setVisibile] = useState(false)
    const [visibile2,setVisibile2] = useState(false)
    const [messaggio,setMessaggio]= useState("")
    const [importo,setImporto] = useState();
    
    useEffect(() => {

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


        listaConti(setConti,setId_Stato);

        listaStatiConto(setStati);

       

    }, [aggiornamento])

    function reindirizza(rotta) {
        if (rotta == INDEX_ADMIN){
            setPaginaTabelle("")
        }
        history.push(rotta)
    }  







    return (
        <>
        <div className="div">
        
        <div className="table-container">
        {errorBanner(messaggio,setMessaggio,setImporto,visibile,visibile2,setVisibile,setVisibile2)}
                    <div className="div-h1">
                        <h3 style={{ fontSize: 20, color: "white" }}><b>LISTA CONTI</b></h3>
                    </div>
                <table>
                    <thead>
                        <tr>
                            <th>Numero Conto</th>
                            <th>Saldo</th>
                            <th>Stato Conto</th>
                            <th>Codice cliente</th>
                            <th>Nome cliente</th>
                            <th>Cognome cliente</th>
                            <th>Codice Fiscale</th>
                            <th>Operazione</th>
                            <th>Conferma</th>
                        </tr>
                    </thead>
                    <tbody>

                        {conti ? (
                            conti.map((conto) => (
                                <tr key={conto.id}>
                                    <td>{conto.numeroConto}</td>
                                    <td>€ {conto.saldo}</td>
                                    <td>{conto.stato.statoContoCorrente}</td>
                                    <td>{conto.utente.id}</td>
                                    <td>{conto.utente.nome}</td>
                                    <td>{conto.utente.cognome}</td>
                                    <td>{conto.utente.codiceFiscale}</td>
                                    <td>
                                        <select
                                            onChange={(e) =>
                                                setId_Stato(e.target.value)} >
                                            <option >Seleziona uno stato</option>
                                            {stati ? (
                                                stati.map((stato) => (
                                                    <option key={stato.id} value={stato.id}>
                                                        {stato.statoContoCorrente}
                                                    </option>
                                                ))
                                            ) : (
                                                <>
                                                </>
                                            )}
                                        </select>
                                    </td>
                                    <td>
                                        <button type="button" style={{backgroundColor:"#1b2c79"}} onClick={() => modificaStato(conto,id_stato,setAggiornamento,setVisibile2,setMessaggio,setVisibile,aggiornamento)}>✓</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <>
                            </>
                        )}

                    </tbody>
                </table>
                <button className="button-1" style={{ marginLeft:650,height: 40 }}  type="button" onClick={(e) => reindirizza(INDEX_ADMIN)} >Vai al menu</button>
            </div>
        </div>
            

        </>
    )
}