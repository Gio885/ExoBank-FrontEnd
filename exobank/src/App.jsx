import {BrowserRouter} from "react-router-dom";
import { Route, Switch } from "react-router-dom";
import Home from './components/Home';
import "bootstrap/dist/css/bootstrap.css";
import "./App.css"
import { APRI_CONTO, BONIFICO, DEPOSITO, ERRORE, HOME, INDEX_ADMIN, INDEX_UTENTE, LISTA_CONTI, LISTA_TRANSAZIONI, LISTA_TRANSAZIONI_UTENTE, OPERAZIONI_UTENTE, PRELIEVO, REGISTRAZIONE } from "./utility/Route";
import IndexUtente from "./components/IndexUtente";
import ApriConto from "./components/ApriConto";
import Registrazione from "./components/Registrazione";
import IndexAdmin from "./components/IndexAdmin";
import ListaContiAdmin from "./components/ListaContiAdmin";
import Deposito from "./components/Deposito";
import ListaTransazioniAdmin from "./components/ListaTransazioniAdmin";
import Errore from "./components/Errore";
import { useState } from "react";
import Prelievo from "./components/Prelievo";
import ListaTransazioniUtente from "./components/ListaTransazioniUtente";
import Navbar from "./components/Navbar";
import OperazioniUtente from "./components/OperazioniUtente";
import Bonifico from "./components/Bonifico";


function App() {


      const [errore,setErrore]=useState({
            titoloErrore:"",
            descrizioneErrore:""
      });


      const [paginaCorrente,setPaginaCorrente] = useState("");
      const [paginaTabelle,setPaginaTabelle] = useState(false)

      return (
            <>

            <div className="background-image">
            

        <BrowserRouter>
        <Navbar paginaCorrente = {paginaCorrente} paginaTabelle = {paginaTabelle} setPaginaTabelle ={setPaginaTabelle} />
          <Switch>
                <Route exact path={HOME}>
                      <Home setErrore = {setErrore} setPaginaCorrente = {setPaginaCorrente}/>
                </Route>

                <Route exact path={ERRORE}>
                      <Errore errore = {errore}/>
                </Route>
      
                <Route exact path={INDEX_UTENTE}>
                      <IndexUtente setErrore = {setErrore} paginaTabelle = {paginaTabelle} setPaginaCorrente = {setPaginaCorrente} setPaginaTabelle ={setPaginaTabelle} />
                </Route>

                <Route exact path={DEPOSITO}>
                      <Deposito setErrore = {setErrore}/>
                </Route>
                <Route exact path={PRELIEVO}>
                      <Prelievo setErrore = {setErrore}/>
                </Route>
                <Route exact path={BONIFICO}>
                      <Bonifico setErrore = {setErrore}/>
                </Route>

                <Route exact path={OPERAZIONI_UTENTE}>
                      <OperazioniUtente setErrore = {setErrore} />
                </Route>

                <Route exact path={LISTA_TRANSAZIONI_UTENTE}>
                      <ListaTransazioniUtente setErrore = {setErrore} setPaginaTabelle ={setPaginaTabelle}  />
                </Route>

                <Route exact path={INDEX_ADMIN}>
                      <IndexAdmin setErrore = {setErrore} setPaginaCorrente = {setPaginaCorrente} setPaginaTabelle ={setPaginaTabelle}/>
                </Route>
                <Route exact path={LISTA_CONTI}>
                      <ListaContiAdmin setErrore = {setErrore} setPaginaTabelle ={setPaginaTabelle} />
                </Route>
                <Route exact path={LISTA_TRANSAZIONI}>
                      <ListaTransazioniAdmin setErrore = {setErrore} setPaginaTabelle ={setPaginaTabelle} />
                </Route>

                <Route exact path={REGISTRAZIONE}>
                      <Registrazione setErrore = {setErrore}/>
                </Route>

                <Route exact path={APRI_CONTO}>
                      <ApriConto setErrore = {setErrore}/>
                </Route>
      
      
          </Switch>
      </BrowserRouter>
            
      
        
      
      </div>
      </>
      )
     
}

export default App;


 
