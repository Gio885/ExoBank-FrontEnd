import { useSelector } from "react-redux"
import { ERRORE, INDEX_UTENTE } from "../utility/Route";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { useEffect, useState } from "react";
import { insertConto } from "../service/utenteService";



function ApriConto({setErrore}) {
    
    const utente = useSelector(state => state.utente);
    const history = useHistory();
    const [accettoCondizioni, setAccettoCondizioni] = useState(false);
    const [visibile,setVisibile] = useState(false)
    const [messaggio,setMessaggio]= useState("")
    const [visibile2,setVisibile2] = useState(false)

    useEffect(   ()=>{
         
  if(utente.ruolo){
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
    })

    const gestisciCheckbox = () => {
        setAccettoCondizioni(!accettoCondizioni);
    };

    function reindirizza(rotta) {
        history.push(rotta)
    }

    function inviaRichiesta(){
        insertConto(utente,setMessaggio,setVisibile,setVisibile2);
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
            reindirizza(INDEX_UTENTE)
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

                <div className="div-container">
                    <h2>Conferma i tuoi dati</h2>
                    <label style={{marginBottom:6}} for="nome">Nome:</label>
                    <input type="text" value={utente.nome} readOnly />
                    <label style={{marginBottom:6}} for="nome">Cognome:</label>
                    <input type="text" value={utente.cognome} readOnly />
                    <label style={{marginBottom:6}} for="nome">E-mail:</label>
                    <input type="text" value={utente.email} readOnly />
                    <label style={{marginBottom:6}} for="nome">Codice fiscale:</label>
                    <input type="text" value={utente.codiceFiscale} readOnly />
                    <label>
                        <input type="checkbox"
                            name="accettoCondizioni"
                            value={accettoCondizioni}
                            onChange={gestisciCheckbox} />
                            <p style={{marginLeft:0,display:"inline"}}> Accetto di conformarmi a tutte le condizioni e i termini previsti per l'apertura del conto bancario.
                            </p>
                        <a style={{ color: "blue", marginLeft: 10 }} href="">Condizioni e termini.</a>
                    </label>
                    <br />
                    <br />
                    <button type="button" onClick={ (e) => inviaRichiesta() }
                        style={{
                            backgroundColor: accettoCondizioni ? 'green' : 'red',
                            color: 'white',
                            cursor: accettoCondizioni ? 'pointer' : 'not-allowed',
                        }}
                        disabled={!accettoCondizioni} >
                        Conferma dati e invia richiesta apertura conto
                    </button>

                    <button type="button" onClick={() => reindirizza(INDEX_UTENTE)} >Torna al menu</button>
                    {errorBanner(messaggio)}

                </div>
            </div>


        </>
    )


} export default ApriConto