import { useHistory } from "react-router-dom/cjs/react-router-dom"
import { HOME, INDEX_ADMIN, INDEX_UTENTE } from "../utility/Route";
import { useSelector } from "react-redux";



export default function Errore({ errore }) {



    const history = useHistory();
    const utente = useSelector(state => state.utente);





    return (
        <>
            <div className="div">
                <div className="div-container">



                    <h1 ><b>{errore.titoloErrore}</b></h1>
                    <p><b>{errore.descrizioneErrore}</b></p>
                    {utente.ruolo ? (
                        <>
                            {utente.ruolo.id == 2 ? (
                                <button className="button" onClick={() => history.push(INDEX_UTENTE)}><b>TORNA AL MENU PRINCIPALE</b> </button>

                            ) : (
                                <button className="button" onClick={() => history.push(INDEX_ADMIN)}><b>TORNA AL MENU PRINCIPALE</b> </button>

                            )}

                        </>
                    ) : (
                        <>
                            <button className="button" onClick={() => history.push(HOME)}><b>TORNA ALLA HOME</b> </button>

                        </>
                    )}


                </div>
            </div>









        </>
    )





}