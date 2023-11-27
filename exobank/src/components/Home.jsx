import { useState } from "react"
import { utenteLogin } from "../service/utenteService";
import { useDispatch } from 'react-redux';
import { INDEX_ADMIN, INDEX_UTENTE, REGISTRAZIONE } from "../utility/Route";
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import { setUtente } from "../store/slice/utenteSlice";
import { useEffect } from "react";


function Home({setPaginaCorrente}) {

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const dispatch = useDispatch()
  const history = useHistory();
  const [visibile,setVisibile] = useState(false)
  const [messaggio,setMessaggio]= useState("")
  const [aggiornamento,setAggiornamento] = useState(false)

  useEffect ( ()=>{
    setEmail(null)
    setPassword(null)
    setMessaggio("");
  },[aggiornamento])

  function login() {
      const utente = {
        email: email,
        password: password
      }
      utenteLogin(utente,dispatch,setUtente,setPaginaCorrente,history,setMessaggio,setVisibile)
  }

  function errorBanner(messaggio){

    if (visibile) {
      setTimeout(() => {
        setVisibile(false);
        setMessaggio("");
        setEmail("")
        setPassword("")
        setAggiornamento(!aggiornamento)
      }, 5000);   
      return (
        <div className="error-banner">
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
          <h2>Login</h2>
          <input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} value={email} />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password} />
          <button type="button" onClick={() => login()}>Entra</button>
          <button type="submit" onClick={(e) => history.push(REGISTRAZIONE)} >Registrati</button>
            {errorBanner(messaggio)}
        </div>
      </div>


    </>




  )



} export default Home