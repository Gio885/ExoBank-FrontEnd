import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux"
import { HOME, INDEX_UTENTE } from "../utility/Route";
import { registrazione } from "../service/utenteService";
import { setUtente } from "../store/slice/utenteSlice";
function Registrazione() {

    // caratteri alfabetici, spazi, accenti e apostrofi.
    const nomeRegex = /^[A-Za-z0-9]+(?:[ ]?[A-Za-z0-9]+)*$/;
    const cognomeRegex = /^[A-Za-z0-9]+(?:[ ]?[A-Za-z0-9]+)*$/;
    const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
    const codiceFiscaleRegex = /^[A-Z]{6}\d{2}[ABCDEHLMPRST]{1}\d{2}[A-Z]{1}\d{3}[A-Z]{1}$/;
    const [utent,setUtent]=useState({
        nome:"",
        cognome:"",
        email:"",
        password:"",
        codiceFiscale:""
    })
    const history = useHistory();
    const [accettoCondizioni, setAccettoCondizioni] = useState(false);
    const [visibile,setVisibile] = useState(false)
    const [visibile2,setVisibile2] = useState(false)
    const [messaggio,setMessaggio]= useState("")
    const dispatch = useDispatch()
    const [nomeError,setNomeError] = useState("")
    const [cognomeError,setCognomeError] = useState("")
    const [emailError,setEmailError] = useState("")
    const [passwordError,setPasswordError] = useState("")
    const [codiceFiscaleError,setCodiceFiscaleError] = useState("")
    


    useEffect( ()=>{
      
    },[utent])


    const gestisciCheckbox = () => {
        setAccettoCondizioni(!accettoCondizioni);
    };

    function reindirizza(rotta) {
        history.push(rotta)
    }

    function setForm(valore,attributo){
        switch(attributo){
            case 'nome':
                setUtent({...utent,nome:valore})
                console.log(utent.nome)
                break;
            case 'cognome':
                    setUtent({...utent,cognome:valore})
                    break;
            case 'email':
                setUtent({...utent,email:valore})
                break;
            case 'password':
                    setUtent({...utent,password:valore})
                    break;
            case 'codiceFiscale':
                    setUtent({...utent,codiceFiscale:valore.toUpperCase()})
                    break;
        }
    }

    function validaForm() {
      let nomeOK = true;
      let cognomeOK = true;
      let emailOK = true;
      let passwordOK = true;
      let codiceFiscaleOK = true;
    
      if (utent.nome === "" || utent.cognome === "" || utent.email === "" || utent.password === "" || utent.codiceFiscale === "") {
        setMessaggio("Compila tutti i campi correttamente");
        setVisibile(true);
        nomeOK = false;
        cognomeOK = false;
        emailOK = false;
        passwordOK = false;
        codiceFiscaleOK = false;
      }
    
      if (!utent.nome.match(nomeRegex) || utent.nome.length < 4 || utent.nome.length > 20) {
        setNomeError("Il nome non può contenere caratteri numerici o speciali e deve avere una lunghezza minima di 4 caratteri e massima di 20");
        nomeOK = false;
      } else {
        setNomeError("");
      }
    
      if (!utent.cognome.match(cognomeRegex) || utent.cognome.length < 4 || utent.cognome.length > 20) {
        setCognomeError("Il cognome non può contenere caratteri numerici o speciali e deve avere una lunghezza minima di 4 caratteri e massima di 20");
        cognomeOK = false;
      } else {
        setCognomeError("");
      }
    
      if (!utent.email.match(emailRegex)) {
        setEmailError("Email non valida");
        emailOK = false;
      } else {
        setEmailError("")
      }
    
      if (!utent.password.match(passwordRegex)) {
        setPasswordError("Password non valida, la password deve contenere almeno 8 caratteri di cui un carattere maiuscolo, un carattere minuscolo ed un numero");
        passwordOK = false;
      } else {
        setPasswordError("");
      }
    
      if (utent.codiceFiscale.length != 16) {
        setCodiceFiscaleError("Codice fiscale non valido");
        codiceFiscaleOK = false;
        return;
      } else {
        setCodiceFiscaleError("");
      }
    
      if (nomeOK && cognomeOK && emailOK && passwordOK && codiceFiscaleOK) {
        registrazione(utent,dispatch,setUtente,setMessaggio,setVisibile,setVisibile2);
      }
    }

   
    function errorBanner(messaggio){

        if (visibile) {
          setTimeout(() => {
            setVisibile(false);
            setMessaggio("");
          }, 6000);   
          return (
            <div style={{color:"black"}} className="error-banner">
              {messaggio}
            </div>
          );
        } else {
          return null;
        }
      }

      function errorBanner2(messaggio){

        if (visibile2) {
          setTimeout(() => {
            setVisibile2(false);
            setMessaggio("");
            reindirizza(INDEX_UTENTE)
          }, 6000);   
          return (
            <div style={{color:"green"}} className="error-banner">
              {messaggio}
            </div>
          );
        } else {
          return null;
        }
      }
    

    return (

        <>
        <form>
            <div className="div">

                <div className="div-container">
                    <h2>Registrazione</h2>
                    <p><b>Inserisci i tuoi dati</b></p>
                    <label style={{ marginBottom: 6 }} for="nome">Nome:</label>
                    <input id="nome"type="text" placeholder="Inserisci il tuo nome" onChange={ (e) => setForm(e.target.value,"nome")} />
                    {nomeError && <div style={{ color: 'red' }}>{nomeError}</div>}
                    <label style={{ marginBottom: 6 }} for="nome">Cognome:</label>
                    <input id="cognome"type="text" placeholder="Inserisci il tuo cognome" onChange={ (e) => setForm(e.target.value,"cognome")} />
                    {cognomeError && <div style={{ color: 'red' }}>{cognomeError}</div>}
                    <label style={{ marginBottom: 6 }} for="nome">E-mail:</label>
                    <input id="email"type="text" placeholder="Inserisci la tua email"onChange={ (e) => setForm(e.target.value,"email")} />
                    {emailError && <div style={{ color: 'red' }}>{emailError}</div>}
                    <label style={{ marginBottom: 6 }} for="nome">Password:</label>
                    <input id="password"type="password" placeholder="Inserisci la password"onChange={ (e) => setForm(e.target.value,"password")} />
                    {passwordError && <div style={{ color: 'red' }}>{passwordError}</div>}
                    <label style={{ marginBottom: 6 }} for="nome">Codice fiscale:</label>
                    <input id="codiceFiscale"type="text" placeholder="Inserisci il tuo codice fiscale"onChange={ (e) => setForm(e.target.value,"codiceFiscale")} />
                    {codiceFiscaleError && <div style={{ color: 'red' }}>{codiceFiscaleError}</div>}
                    <label>
                        <input type="checkbox"
                            name="accettoCondizioni"
                            value={accettoCondizioni}
                            onChange={gestisciCheckbox} />
                        <p style={{ marginLeft: 0, display: "inline" }}> Ho letto e accetto termini e condizioni
                        </p>
                        <a style={{ color: "blue", marginLeft: 10 }} href="">Condizioni e termini.</a>
                    </label>
                    <br />
                    <br />
                    <button type="button" onClick={ ()=> validaForm() }
                        style={{
                            backgroundColor: accettoCondizioni ? 'green' : 'red',
                            color: 'white',
                            cursor: accettoCondizioni ? 'pointer' : 'not-allowed',
                        }}
                        disabled={!accettoCondizioni} >
                        Registrati
                    </button>
                    
                    <button type="button" onClick={() => reindirizza(HOME)} >Torna al menu</button>
                    {errorBanner(messaggio)}
                    {errorBanner2(messaggio)}





                </div>
            </div>

            </form>




        </>




    )




} export default Registrazione