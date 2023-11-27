import { useSelector } from "react-redux"
import { ERRORE, INDEX_UTENTE } from "../utility/Route";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { downloadTransazioni, transazioniUtente } from "../service/utenteService";
import { URL_DOWNLOAD_LISTA_TRANSAZIONI_EXCEL, URL_DOWNLOAD_LISTA_TRANSAZIONI_PDF, URL_DOWNLOAD_LISTA_TRANSAZIONI_WORD } from "../utility/Endpoint";
import axios from "axios";
import wordPNG from "../wordPNG.png"
import excelPNG from "../excelPNG.png";
import pdfPNG from "../pdfPNG.png";


export default function ListaTransazioniUtente({ setErrore,setPaginaTabelle }) {



    const utente = useSelector(state => state.utente);
    const [listaTransazioni, setListaTransazioni] = useState();
    const conto = useSelector(state => state.conto);
    const history = useHistory()
    const { DateTime } = require('luxon');


    useEffect( () => {
        
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

        transazioniUtente(utente,setListaTransazioni);

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

      return () =>{
        setPaginaTabelle("");
      }


    },[] )

    function reindirizza(rotta) {
        setPaginaTabelle(false)
        history.push(rotta)
    }  

    function formattaData(dataLista) {
        const data = DateTime.fromISO(dataLista, { zone: 'utc' });
        if (!data.isValid) {
          return 'Data non valida';
        }
        
        return data.toFormat('dd/MM/yy HH:mm:ss');
      }

      
      function downloadWord(){
        axios.post(URL_DOWNLOAD_LISTA_TRANSAZIONI_WORD, utente, { responseType: 'blob' })
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const a = document.createElement('a');
          a.href = url;
          a.download = 'transazioni.docx';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        })
        .catch(error => {
          console.error('Errore nel download:', error);
        });
      }
    



      function downloadExcel(){
        axios.post(URL_DOWNLOAD_LISTA_TRANSAZIONI_EXCEL, utente, { responseType: 'blob' })
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const a = document.createElement('a');
          a.href = url;
          a.download = 'transazioni.xlsx';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        })
        .catch(error => {
          console.error('Errore nel download:', error);
        });
      }



      

      function downloadPdf(){
        axios.post(URL_DOWNLOAD_LISTA_TRANSAZIONI_PDF, utente, { responseType: 'blob' })
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const a = document.createElement('a');
          a.href = url;
          a.download = 'transazioni.pdf';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        })
        .catch(error => {
          console.error('Errore nel download:', error);
        });
      }


    

      /**

axios.post(URL_DOWNLOAD_LISTA_TRANSAZIONI, utente, { responseType: 'blob' }): Questa riga utilizza Axios per effettuare una richiesta HTTP POST al server. 
URL_DOWNLOAD_LISTA_TRANSAZIONI rappresenta l'URL a cui viene effettuata la richiesta. utente è il payload della richiesta, che sembra essere un oggetto contenente dati utente o parametri 
necessari per il download. { responseType: 'blob' } è una configurazione che dice ad Axios di trattare la risposta come dati binari ("blob").

.then(response => {: Questa parte del codice gestisce la risposta di successo dalla richiesta HTTP. response è l'oggetto che contiene la risposta HTTP restituita dal server.

const url = window.URL.createObjectURL(new Blob([response.data]));: Qui stai creando un URL temporaneo per il blob di dati ricevuti come risposta. Questo URL viene utilizzato 
per creare un collegamento per il download.

const a = document.createElement('a');: Stai creando un elemento a (ancora) nel documento HTML. Questo elemento sarà utilizzato per avviare il download.

a.href = url;: Stai impostando l'attributo href dell'elemento <a> con l'URL creato per il blob di dati. Questo collega l'elemento <a> al file che si desidera scaricare.

a.download = 'transazioni.xlsx';: Stai impostando l'attributo download dell'elemento <a> con il nome del file da suggerire al browser durante il download. In questo caso, il nome del file 
è "transazioni.xlsx".

document.body.appendChild(a);: Stai aggiungendo l'elemento <a> creato al corpo del documento HTML. Questo è necessario per consentire all'utente di fare clic su di esso e avviare il download.

a.click();: Stai simulando un clic sull'elemento `<a>. Questo avvia il processo di download del file.

window.URL.revokeObjectURL(url);: Stai liberando l'URL temporaneo creato precedentemente. Questa è una buona pratica per evitare eventuali problemi di memoria.

.catch(error => {: Questa parte del codice gestisce eventuali errori che si verificano durante la richiesta HTTP. L'errore è registrato nella console del browser con console.error.
       * 
       * 
       * 
       */



    function datiConto(conto) {
        if (!conto) {
            return <p>Non hai un conto</p>;
        } else {
            return (
                <>
                    <p style={{ marginBottom: 0 }}>
                        <b>Numero conto:</b> {conto.numeroConto}
                    </p>
                    <p style={{ marginBottom: 0 }}>
                        <b>Stato conto:</b> {(conto.stato) ? <>{conto.stato.statoContoCorrente}</> : <></>}
                    </p>
                    <p style={{ marginBottom: -10 }}>
                        <b>Saldo:</b> € {conto.saldo}
                    </p>
                </>
            );
        }


    }




    return (

        <>

            <div className="div">
            
                <div className="div-container" style={{zIndex:"-1"}}>
                    <h3><b>Benvenuto {utente.nome} {utente.cognome}</b> </h3>
                    <h6><b>Ruolo: {(utente.ruolo) ? <>{utente.ruolo.tipoRuolo} </> : <></>}</b> </h6>
                    <p><b>{datiConto(conto)}</b></p>
                    
                </div>
            
                <div className="table-container">
                    <div className="div-h2">
                        <div className="left">
                            <h3 style={{borderRadius:5,padding:8,backgroundColor:"#00035a",marginLeft:610, marginTop:15, fontSize:20, color: "white" }}><b>LISTA TRANSAZIONI</b></h3>
                        </div>
                        <div className="right" style={{marginLeft:100}}>
                            <button className="button-2" type="button" onClick={(e) => downloadPdf()} ><img src={pdfPNG} style={{width:30, height:30,marginRight:10}}/>PDF</button>
                            <button className="button-2"   type="button" onClick={(e) => downloadExcel()} ><img src={excelPNG} style={{width:30, height:30,marginRight:10}}/>EXCEL</button>
                            <button className="button-2"  type="button" onClick={(e) => downloadWord()} ><img src={wordPNG} style={{width:30, height:30,marginRight:10}}/>WORD</button>
                        </div>
                    </div>
                    <table>
                    <thead>
                        <tr>
                            <th>TIPO TRANSAZIONE</th>
                            <th>DATA TRANSAZIONE</th>
                            <th>IMPORTO TRANSAZIONE</th>
                            <th>STATO TRANSAZIONE</th>
                            <th>CONTO BENEFICIARIO</th>
                            <th>NOME BENEFICIARIO</th>
                            <th>COGNOME BENEFICIARIO</th>
                            <th>IBAN BENEFICIARIO ESTERNO</th>
                        </tr>
                    </thead>
                    <tbody>

                        {listaTransazioni ? (
                            <>
                                {listaTransazioni.map((transazione) => {
                                    if (transazione.statoTransazione.id !== 4) {
                                        return (
                                            <tr key={transazione.id}>
                                                <td>{transazione.tipo.tipoTransazione}</td>
                                                <td>{formattaData(transazione.dataTransazione)}</td>
                                                <td>{(transazione.tipo.tipoTransazione != "DEPOSITO") ? <>- € {transazione.importo.toFixed(2)}</>:<>€ {transazione.importo.toFixed(2)}</>} </td>
                                                <td>{transazione.statoTransazione.statoTransazione}</td>
                                                <td>{(transazione.contoBeneficiario)?<>{transazione.contoBeneficiario.numeroConto}</>:<>----------------</>}</td>
                                                <td>{(transazione.contoBeneficiario)?<>{transazione.contoBeneficiario.utente.nome}</>:<>----------------</>}</td>
                                                <td>{(transazione.contoBeneficiario)?<>{transazione.contoBeneficiario.utente.cognome}</>:<>----------------</>}</td>
                                                <td>{(transazione.contoBeneficiarioEsterno)?<>{transazione.contoBeneficiarioEsterno}</>:<>-----</>}</td>
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
                    <button className="button-1" style={{ marginLeft: 700, height: 40 }} type="button" onClick={(e) => reindirizza(INDEX_UTENTE)} >Vai al menu</button>
                </div>
                
            </div>





        </>
    )






}