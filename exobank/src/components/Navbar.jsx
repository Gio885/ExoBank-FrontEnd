
import { useDispatch, useSelector } from "react-redux";
import "../navbar.css";
import { APRI_CONTO, BONIFICO, DEPOSITO, HOME, INDEX_ADMIN, INDEX_UTENTE, LISTA_CONTI, LISTA_TRANSAZIONI, LISTA_TRANSAZIONI_UTENTE, OPERAZIONI_UTENTE, PRELIEVO } from "../utility/Route";
import { resetConto } from "../store/slice/contoSlice";
import { resetUtente } from "../store/slice/utenteSlice";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { useEffect, useState } from "react";
import { URL_LISTA_CONTI, URL_LISTA_TRANSAZIONI_ADMIN } from "../utility/Endpoint";


export default function Navbar({ paginaCorrente , paginaTabelle, setPaginaTabelle }) {

    const utente = useSelector(state => state.utente);
    const conto = useSelector(state => state.conto);
    const dispatch = useDispatch();
    const history = useHistory();
    const [visibile, setVisibile] = useState(false)
    const [messaggio, setMessaggio] = useState("")

    function apriConto(rotta) {
        if (!conto) {
            history.push(rotta)
        } else {
            setMessaggio("Hai gia un conto")
            setVisibile(true)
        }
    }

    function logout() {
        dispatch(resetUtente())
        dispatch(resetConto())
        history.push(HOME)
    }


    function errorBanner(messaggio) {

        if (visibile) {
            setTimeout(() => {
                setVisibile(false);
                setMessaggio("");
            }, 5000);
            return (
                <div className="error-banner">
                    {messaggio}
                </div>
            );
        } else {
            // Altrimenti, non renderizzare nulla
            return null;
        }
    }




    function reindirizza(rotta) {
        if (conto) {
            if (rotta === LISTA_TRANSAZIONI_UTENTE || rotta === LISTA_CONTI || rotta === LISTA_TRANSAZIONI) {
                setPaginaTabelle(true);
            } else if (rotta == INDEX_ADMIN) {
                setPaginaTabelle("");
            }
            history.push(rotta);
        } else {
            setMessaggio("Non possiedi ancora un conto");
            setVisibile(true);
        }
    }

    function navBar() {    
        return (
            (utente.ruolo) ? (
                (utente.ruolo.id == 1) ? (
                    <>
                        <p style={{ fontSize: 25, display: "inline-block", marginLeft: 100 }}>{utente.nome} {utente.cognome}</p>
                        <button style={{ marginTop: 10, marginLeft: 150, display: "inline-block", width: 100 }} type="button" id="logout" onClick={() => logout()}><b>Logout</b></button>
                    </>
                ) : (
                    <>
                        <p style={{ fontSize: 30, display: "inline-block", marginLeft: 100 }}>{utente.nome} {utente.cognome}</p>
                        <button style={{ marginTop: 10, marginLeft: 150, display: "inline-block", width: 100 }} type="button" id="logout" onClick={() => logout()}><b>Logout</b></button>
                    </>
                )

            ) : null


        )

    }


    function visualSideBar() {
        const pagina = paginaCorrente
        if (pagina == "indexUtente" || pagina == "indexAdmin") {
            return null;
        }

        return (
            (utente.ruolo) ?

                (utente.ruolo.id == 1) ? (
                    <div class="sidebar">
                        <p><b>Operazioni disponibili</b></p>
                        <button type="button" onClick={() => reindirizza(LISTA_TRANSAZIONI)}>LISTA TRANSAZIONI</button>
                        <button type="button" onClick={() => reindirizza(LISTA_CONTI)}>LISTA CONTI</button>
                        <button type="button">LISTA UTENTI</button>
                        <button type="button" onClick={() => reindirizza(INDEX_ADMIN)}>VAI AL MENU</button>
                    </div>
                ) : (
                    <div class="sidebar">
                        <p><b>Operazioni disponibili</b></p>
                        
                        
                        {(conto)?<> 
                        <button type="button" onClick={() => reindirizza(DEPOSITO)}>Fai un deposito</button>
                        <button type="button" onClick={() => reindirizza(PRELIEVO)}>Effettua un prelievo</button>
                        <button type="button" onClick={() => reindirizza(BONIFICO)}>Effettua un bonifico</button>
                        <button type="button" onClick={() => reindirizza(OPERAZIONI_UTENTE)}>Operazione veloce</button>
                        <button type="button" onClick={() => reindirizza(LISTA_TRANSAZIONI_UTENTE)}>Lista transazioni</button>
                        </>:
                        <><button type="button" onClick={() => apriConto(APRI_CONTO)}>Apri conto</button>
                        </>}
                        
                        <button type="button" onClick={() => history.push(INDEX_UTENTE)}>Vai al menu</button>
                        {errorBanner(messaggio)}
                    </div>
                ) : null
        )

    }


    return (
        <>



            {(paginaTabelle) ? (
                <>
                    <nav style={{marginLeft:170}} class="navbar">
                        <h1 className="h1-navbar">Benvenuto in ExoBank</h1>{navBar()}
                    </nav>

                    {visualSideBar()}
                </>

            ) : (
                <>
                    <nav class="navbar">
                        <h1 className="h1-navbar">Benvenuto in ExoBank</h1>{navBar()}
                    </nav>

                    {visualSideBar()}
                </>
            )}








        </>
    )





}