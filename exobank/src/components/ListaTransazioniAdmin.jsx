import { useEffect, useState } from "react"
import { listaStatiTransazione, listaTransazioniAdmin, updateTransazione } from "../service/adminService"
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { ERRORE, INDEX_ADMIN } from "../utility/Route";
import { useSelector } from "react-redux";



export default function ListaTransazioniAdmin({ setErrore, setPaginaTabelle }) {

    const [statiTransazione, setStatiTransazione] = useState();
    const [listaTransazioni, setListaTransazioni] = useState();
    const [aggiornamento, setAggiornamento] = useState(true)
    const history = useHistory();
    const [stato, setStato] = useState();
    const utente = useSelector(state => state.utente);
    const { DateTime } = require('luxon');
    const [visibile,setVisibile] = useState(false)
    const [visibile2,setVisibile2] = useState(false)
    const [messaggio,setMessaggio]= useState("")


const [isModalVisible, setModalVisible] = useState(false);
const [dettagli, setDettagli] = useState(); 
const [tipo,setTipo]=useState();

function mostraDettagli(transazione,x) {
setDettagli(transazione);
setTipo(x)
setModalVisible(true); // Apri il modal
}

function closeModal() {
setModalVisible(false); // Chiudi il modal
}

    useEffect(() => {


        if (utente.ruolo) {
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

        listaStatiTransazione(setStatiTransazione);

        listaTransazioniAdmin(setListaTransazioni)

   
        
    }, [aggiornamento])

    function reindirizza(rotta) {
        if (rotta == INDEX_ADMIN){
            setPaginaTabelle("")
        }
        history.push(rotta)
    } 

    function modificaStato(transazione) {
        console.log(stato)
        transazione.statoTransazione.id = stato
        console.log(transazione.id)
        console.log(transazione.statoTransazione.id)

        updateTransazione(transazione,setAggiornamento,setVisibile,setVisibile2,setMessaggio,aggiornamento);
    }

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

    //NON FUNZIONA 

    function formattaData1(dataLista) {
        // Crea un oggetto Date dalla stringa della data di Workbench
        const data = new Date(dataLista);
        // Estrai giorno, mese e anno dalla data
        const giorno = String(data.getUTCDate()).padStart(2, '0');
        const mese = String(data.getUTCMonth() + 1).padStart(2, '0');
        const anno = data.getUTCFullYear();
        // Formatta la data nel formato "dd-MM-yyyy"
        const dataFormattata = `${giorno}-${mese}-${anno}`;
        return dataFormattata;
    }

    function formattaData(dataLista) {
        const data = DateTime.fromISO(dataLista, { zone: 'utc' });
        if (!data.isValid) {
          return 'Data non valida';
        }
        
        return data.toFormat('dd-MM-yyyy');
      }


    return (


        <>

            <div className="div">
            
                <div className="table-container" style={{ marginTop: 220 }}>
                {errorBanner(messaggio)}
                    <div className="div-h1">
                        <h3 style={{ fontSize: 20, color: "white" }}><b>LISTA TRANSAZIONI IN CORSO</b></h3>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>NUMERO CONTO</th>
                                <th>SALDO</th>
                                <th>TIPO TRANSAZIONE</th>
                                <th>DATA TRANSAZIONE</th>
                                <th>IMPORTO TRANSAZIONE</th>
                                <th>NUMERO CONTO BENEFICIARIO</th>
                                <th>IBAN BENEFICIARIO ESTERNO</th>
                                <th>DETTAGLI ORDINANTE</th>
                                <th>DETTAGLI BENEFICIARIO</th>
                                <th>OPERAZIONE</th>
                                <th>CONFERMA</th>
                            </tr>
                        </thead>
                        <tbody>

                            {listaTransazioni ? (
                                <>
                                    {listaTransazioni.map((transazione) => {
                                        if (transazione.statoTransazione.id === 3) {
                                            return (
                                                <tr key={transazione.id}>
                                                    <td>{transazione.conto.numeroConto}</td>
                                                    <td>€ {transazione.conto.saldo.toFixed(2)}</td>
                                                    <td>{transazione.tipo.tipoTransazione}</td>
                                                    <td>{formattaData(transazione.dataTransazione)}</td>
                                                    <td>{(transazione.tipo.tipoTransazione != "DEPOSITO") ? <>- € {transazione.importo.toFixed(2)}</>:<>€ {transazione.importo.toFixed(2)}</>} </td>
                                                    <td>{(transazione.contoBeneficiario)?<>{transazione.contoBeneficiario.numeroConto}</>:<>-----</>}</td>
                                                    <td>{(transazione.contoBeneficiarioEsterno)?<>{transazione.contoBeneficiarioEsterno}</>:<>-----</>}</td>
                                                    <td>
                                                    <button type="button" style={{ backgroundColor: "#1b2c79" }} onClick={()=>mostraDettagli(transazione,1)}>DETTAGLI</button>
                                                    </td>
                                                    <td>
                                                    <button type="button" style={{ backgroundColor: "#1b2c79" }} onClick={()=>mostraDettagli(transazione,2)}>DETTAGLI</button>
                                                    </td>
                                                    <td>
                                                        <select
                                                            style={{ marginTop: 10, margin: 5 }}
                                                            onChange={(e) => setStato(e.target.value)}
                                                        >
                                                            <option value="" >Seleziona uno stato</option>
                                                            {statiTransazione ? (
                                                                <>
                                                                    {statiTransazione.map((s) => (
                                                                        <option key={s.id} value={s.id}>
                                                                            {s.statoTransazione}
                                                                        </option>
                                                                    ))}
                                                                </>
                                                            ) : (
                                                                <>
                                                                </>
                                                            )}
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <button type="button" style={{ backgroundColor: "#1b2c79" }} onClick={() => modificaStato(transazione)}>✓</button>
                                                    </td>
                                                </tr>
                                            );
                                        } else {
                                            return null;
                                        }
                                    })}
                                </>
                            ) : (
                                <>
                                </>
                            )}

                        </tbody>
                    </table>

                </div>
                <div className="table-container">
                    <div className="div-h1">
                        <h3 style={{ fontSize: 20, color: "white" }}><b>LISTA TRANSAZIONI</b></h3>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>NUMERO CONTO</th>
                                <th>SALDO</th>
                                <th>TIPO TRANSAZIONE</th>
                                <th>DATA TRANSAZIONE</th>
                                <th>IMPORTO TRANSAZIONE</th>
                                <th>NUMERO CONTO BENEFICIARIO</th>
                                <th>IBAN BENEFICIARIO ESTERNO</th>
                                <th>STATO TRANSAZIONE</th>
                                <th>DETTAGLI ORDINANTE</th>
                                <th>DETTAGLI BENEFICIARIO</th>
                            </tr>
                        </thead>
                        <tbody>

                            {listaTransazioni ? (
                                <>
                                    {listaTransazioni.map((transazione) => {
                                        if (transazione.statoTransazione.id !== 3) {
                                            return (
                                                <tr key={transazione.id}>
                                                    <td>{transazione.conto.numeroConto}</td>
                                                    <td>€ {transazione.conto.saldo.toFixed(2)}</td>
                                                    <td>{transazione.tipo.tipoTransazione}</td>
                                                    <td>{formattaData(transazione.dataTransazione)}</td>
                                                    <td>{(transazione.tipo.tipoTransazione != "DEPOSITO") ? <>- € {transazione.importo.toFixed(2)}</>:<>€ {transazione.importo.toFixed(2)}</>} </td>
                                                    <td>{(transazione.contoBeneficiario)?<>{transazione.contoBeneficiario.numeroConto}</>:<>-----</>}</td>
                                                    <td>{(transazione.contoBeneficiarioEsterno)?<>{transazione.contoBeneficiarioEsterno}</>:<>-----</>}</td>
                                                    <td>{transazione.statoTransazione.statoTransazione}</td>
                                                    <td>
                                                    <button type="button" style={{ backgroundColor: "#1b2c79" }} onClick={()=>mostraDettagli(transazione,1)}>DETTAGLI</button>
                                                    </td>
                                                    <td>
                                                    <button type="button" style={{ backgroundColor: "#1b2c79" }} onClick={()=>mostraDettagli(transazione,2)}>DETTAGLI</button>
                                                    </td>
                                                </tr>
                                            );
                                        } else {
                                            return null;
                                        }
                                    })}
                                </>
                            ) : (
                                <>
                                </>
                            )}

                        </tbody>
                    </table>         
                    <button className="button-1" style={{ marginLeft:700, height: 40 }} type="button" onClick={(e) => reindirizza(INDEX_ADMIN)} >Vai al menu</button>
                </div>
            </div>





                                

            {isModalVisible && 
            (tipo==1 ? (
                <>
                <div className="modal">
                    <div className="modal-content">
                        <h2>Dettagli ordinante</h2>
                        <p><b>Nome:</b> {dettagli.conto.utente.nome}</p>
                        <p><b>Cognome:</b> {dettagli.conto.utente.cognome}</p>
                        <p><b>Codice Fiscale:</b> {dettagli.conto.utente.codiceFiscale}</p>
                        <p><b>Conto numero:</b> {dettagli.conto.numeroConto}</p>
                        <p><b>Saldo conto:</b> € {dettagli.conto.saldo}</p>
                        <p><b>Stato conto:</b> {dettagli.conto.stato.statoContoCorrente}</p>


                        <button onClick={closeModal}>Chiudi</button>
                    </div>
                </div>
                </>
            ):(
                <>
                <div className="modal">
                    <div className="modal-content">
                        <h2>Dettagli Beneficiario</h2>
                        {console.log(dettagli)}
                        <p><b>Nome:</b> {(dettagli.contoBeneficiario)?<>{dettagli.contoBeneficiario.utente.nome}</>:<></>}</p>
                        <p><b>Cognome:</b> {(dettagli.contoBeneficiario)?<>{dettagli.contoBeneficiario.utente.cognome}</>:<></>}</p>
                        <p><b>Codice Fiscale:</b> {(dettagli.contoBeneficiario)?<>{dettagli.contoBeneficiario.utente.codiceFiscale}</>:<></>}</p>
                        <p><b>Conto numero:</b> {(dettagli.contoBeneficiario)?<>{dettagli.contoBeneficiario.numeroConto}</>:<></>}</p>
                        <p><b>Saldo conto:</b> € {(dettagli.contoBeneficiario)?<>{dettagli.contoBeneficiario.saldo}</>:<></>}</p>
                        <p><b>Stato conto:</b> {(dettagli.contoBeneficiario)?<>{dettagli.contoBeneficiario.stato.statoContoCorrente}</>:<></>}</p>


                        <button onClick={closeModal}>Chiudi</button>
                    </div>
                </div>
                </>
            )
                
            )}


        </>
    )
}