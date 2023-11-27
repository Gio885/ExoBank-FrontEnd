import { useState } from "react";
import { insertTransazione } from "../service/utenteService";
import { updateConto } from "../service/adminService";
import { email, emailAggiornamentoConto, emailAggiornamentoStatoConto } from "../service/emailService";

export const DEPOSITO = "1";
export const PRELIEVO = "2"
export const  BONIFICO = "3"
export const  RICARICA = "4"
export const  BOLLETTINO = "5"





export function Operazione(tipoOperazione, conto, conti, importo, setImporto, ibanBeneficiario,setMessaggio,setVisibile,setVisibile2, setIbanBeneficiario,setAggiornamento,aggiornamento) {
    const contoAggiornato = { ...conto };
    const tipoDeposito = { id: 1, nome: "Deposito" };
    const tipoPrelievo = { id: 2, nome: "Prelievo" };
    const tipoBonifico = { id: 3, nome: "Bonifico" };
    const tipoRicarica = { id: 4, nome: "Ricarica" };
    const tipoBollettino = { id: 5, nome: "Bollettino" };
    let tipo;
    let statoTransazione;
    let contoBeneficiario = null;
    let contoBeneficiarioEsterno = null;

    /*"
    computed property name" o "computed property" di JavaScript, che è una caratteristica che consente di definire le chiavi degli oggetti in 
    modo dinamico. [DEPOSITO] è una chiave calcolata in base al valore della variabile DEPOSITO, e il valore associato a questa chiave sarà 
    tipoDeposito.nome. In altre parole, stai mappando il valore di DEPOSITO (che è una costante o variabile contenente il numero 1) al nome 
    dell'operazione associato, che è "Deposito" in questo caso.

     */
    const tipoNomi = {
        [DEPOSITO]: tipoDeposito.nome,
        [PRELIEVO]: tipoPrelievo.nome,
        [BONIFICO]: tipoBonifico.nome,
        [RICARICA]: tipoRicarica.nome,
        [BOLLETTINO]: tipoBollettino.nome,
    };

    /*HAI CASI GLI VIENE ASSOCIATO UN TIPO DEPOSITO.NOME QUINDI LA PROPRIETA DELL'OGGETTI TIPO DEPOSITO NOME */
    switch (tipoOperazione) {
        case DEPOSITO:
            tipo = tipoDeposito;
            statoTransazione = { id: 1 };
            break;
        case PRELIEVO:
            tipo = tipoPrelievo;
            statoTransazione = { id: 3 };
            break;
        case BONIFICO:
            tipo = tipoBonifico;
            statoTransazione = { id: 3 };
            contoBeneficiario = conti.find((conti) => conti.numeroConto === ibanBeneficiario);   //ESTRAE UN SINGOLO CONTO QUANDO LA COND. SI VER
            break;
        case RICARICA:
            tipo = tipoRicarica;
            statoTransazione = { id: 3 };
            break;
        case BOLLETTINO:
            tipo = tipoBollettino;
            statoTransazione = { id: 3 };
            contoBeneficiarioEsterno = ibanBeneficiario.toUpperCase();
            break;
        default:
            setMessaggio("Tipo di operazione non valido");
            setVisibile(true);
            return;
    }

    if (importo <= 0) {
        setMessaggio("Inserisci un importo positivo");
        setVisibile(true)
    } else if (importo >= 1000) {
        setMessaggio("Non è possibile effettuare un'operazione superiore a € 1000.00");
        setVisibile(true)
    } else if (tipo === tipoBonifico && (!ibanBeneficiario || ibanBeneficiario.length !== 27)) {
        setMessaggio("L'IBAN inserito non è valido");
        setVisibile(true)
    } else if (tipo === tipoBonifico && !contoBeneficiario) {
        setMessaggio("Operazione non consentita, inserisci un IBAN valido");
        setVisibile(true)
    } else if (importo > conto.saldo && !tipoDeposito) {
        setMessaggio("Operazione non consentita, importo superiore al saldo");
        setVisibile(true)
    }
    else if (tipo === tipoBollettino && (!contoBeneficiarioEsterno || contoBeneficiarioEsterno.length !==27 ) ){
        setMessaggio("L'IBAN inserito non è valido");
        setVisibile(true)
    } else {
        const transazione = {
            conto: { ...conto },
            importo: importo,
            tipo: tipo,
            statoTransazione: statoTransazione,
            contoBeneficiario: contoBeneficiario,
            contoBeneficiarioEsterno: contoBeneficiarioEsterno,
        };
        insertTransazione(transazione)
            .then((response) => {
                if (response.data) { 
                   if(response.data.data.tipo.id == 1 ){
                    setMessaggio("Hai depositato un importo di € "+transazione.importo+" sul tuo conto numero "+transazione.conto.numeroConto)
                    }else{
                        setMessaggio("La tua richiesta di "+tipoNomi[tipoOperazione]+ " è stata presa in carico");
                    }
                    setVisibile2(true);
                    setIbanBeneficiario("");
                    setImporto("");
                    setAggiornamento(!aggiornamento)
                }
            })
            .catch((error) => {
                if (error.response && error.response.data) {
                    setMessaggio(error.response.data);
                } else {
                    setMessaggio("Errore sconosciuto");
                }
                setVisibile(true);
                setIbanBeneficiario("");
                setImporto("");
                setAggiornamento(!aggiornamento)
            });
    }
}




export function modificaStato(conto,id_stato,setAggiornamento,setVisibile2,setMessaggio,setVisibile,aggiornamento){
    const utente = conto.utente
    conto.stato.id = id_stato
    updateConto(conto,setAggiornamento,setMessaggio,setVisibile,setVisibile2,aggiornamento)
}



export function returnOperazione(tipoOperazione,messaggio,setMessaggio,setImporto,visibile,visibile2,setVisibile,setVisibile2,setIbanBeneficiario,conti,importo,ibanBeneficiario,conto,setAggiornamento,aggiornamento) {
    switch (tipoOperazione) {
        case DEPOSITO:
            return (
                <>
                    <br />
                    <label style={{ marginRight: 10 }} for="importo"><b>INSERISCI L'IMPORTO: </b></label>
                    <input style={{ marginTop: 10, width: 255 }} onChange={(e) => setImporto(e.target.value)} value={importo} type="number" placeholder="Inserisci l'importo da depositare"></input>
                    <button style={{ marginTop: 20, marginLeft: 10, padding: 4, width: 160 }} onClick={() => Operazione(tipoOperazione, conto, conti, importo, setImporto, ibanBeneficiario,setMessaggio,setVisibile,setVisibile2, setIbanBeneficiario,setAggiornamento,aggiornamento)} type="button" className="">DEPOSITA</button>
                    {errorBanner(messaggio,setMessaggio,setImporto,visibile,visibile2,setVisibile,setVisibile2)}
                </>
            )
        case PRELIEVO:
            return (
                <>
                    <br />
                    <label style={{ marginRight: 10 }} for="importo"><b>INSERISCI L'IMPORTO: </b></label>
                    <input style={{ marginTop: 10, width: 255 }} onChange={(e) => setImporto(e.target.value)} value={importo} type="number" placeholder="Inserisci l'importo da prelevare"></input>
                    <button style={{ marginTop: 20, marginLeft: 10, padding: 4, width: 160 }} onClick={() => Operazione(tipoOperazione, conto, conti, importo, setImporto, ibanBeneficiario,setMessaggio,setVisibile,setVisibile2, setIbanBeneficiario,setAggiornamento,aggiornamento)} type="button" className="">PRELEVA</button>
                    {errorBanner(messaggio,setMessaggio,setImporto,visibile,visibile2,setVisibile,setVisibile2)}
                </>
            )
        case BONIFICO:
            return (
                <>
                    <br />
                    <br />
                    <label for="iban"><b>DIGITA IBAN BENEFICIARIO: </b></label>
                    <input style={{ marginTop: 10, width: 440 }} onChange={(e) => setIbanBeneficiario(e.target.value)} value={ibanBeneficiario} type="text" placeholder="Inserisci IBAN del beneficiario"></input>
                    <br />
                    <p><b>Oppure</b></p>
                    <label for="iban"><b>SELEZIONA IBAN BENEFICIARIO: </b></label>
                    <select
                        style={{ width: 440, height: 40, marginTop: 10, margin: 5 }}
                        onChange={(e) => setIbanBeneficiario(e.target.value)} value={ibanBeneficiario}
                    >
                        <option value=""> &nbsp;Seleziona un IBAN</option>
                        {conti
                            ? conti
                                .filter((conti) => conti.stato.id === 1)
                                .map((conti) => (
                                    <option key={conti.numeroConto} value={conti.numeroConto}>
                                        &nbsp;{conti.numeroConto} &nbsp;&nbsp; {conti.utente.nome} &nbsp;&nbsp; {conti.utente.cognome}
                                    </option>
                                ))
                            : null
                        }
                    </select>
                    <br />
                    <br />

                    <label for="importo"><b>INSERISCI L'IMPORTO: </b></label>
                    <input style={{ marginLeft: 10, marginTop: 0, width: 255 }} onChange={(e) => setImporto(e.target.value)} value={importo} type="number" placeholder="Inserisci l'importo del bonifico"></input>
                    <button style={{ marginTop: 20, marginLeft: 0, padding: 4, width: 160 }} onClick={() => Operazione(tipoOperazione, conto, conti, importo, setImporto, ibanBeneficiario,setMessaggio,setVisibile,setVisibile2, setIbanBeneficiario,setAggiornamento,aggiornamento)} type="button" className="">FAI UN BONIFICO</button>
                    {errorBanner(messaggio,setMessaggio,setImporto,visibile,visibile2,setVisibile,setVisibile2)}
                </>
            )
        case RICARICA:
            return (
                <>
                    <br />

                    <label style={{ marginTop: 10, marginRight: 10 }} for="importo"><b>INSERISCI IL NUMERO DI TELEFONO: </b></label>
                    <input style={{ marginTop: 10, width: 255 }} value={ibanBeneficiario} type="number" placeholder="Inserisci il numero di telefono"></input>
                    <br />
                    <br />
                    <label style={{ marginRight: 10 }} for="importo"><b>INSERISCI L'IMPORTO: </b></label>
                    <br />
                    <input style={{ marginTop: 10, width: 255 }} onChange={(e) => setImporto(e.target.value)} value={importo} type="number" placeholder="Inserisci l'importo della ricarica"></input>
                    <br />
                    <button style={{ marginTop: 20, marginLeft: 10, padding: 4, width: 160 }} onClick={() => Operazione(tipoOperazione, conto, conti, importo, setImporto, ibanBeneficiario,setMessaggio,setVisibile,setVisibile2, setIbanBeneficiario,setAggiornamento,aggiornamento)} type="button" className="">RICARICA</button>
                    {errorBanner(messaggio,setMessaggio,setImporto,visibile,visibile2,setVisibile,setVisibile2)}
                </>
            )
        case BOLLETTINO:
            return (
                <>
                    <br />
                    <br />
                    <label for="iban"><b>DIGITA IBAN BENEFICIARIO: </b></label>
                    <input style={{ marginTop: 10, width: 440 }} onChange={(e) => setIbanBeneficiario(e.target.value)} value={ibanBeneficiario} type="text" placeholder="Inserisci IBAN del beneficiario"></input>
                    <br />
                    <br />
                    <br />
                    <label for="importo"><b>INSERISCI L'IMPORTO: </b></label>
                    <input style={{ marginLeft: 10, marginTop: 0, width: 255 }} onChange={(e) => setImporto(e.target.value)} value={importo} type="number" placeholder="Inserisci l'importo del bonifico"></input>
                    <button style={{ marginTop: 20, marginLeft: 0, padding: 4, width: 160 }} onClick={() => Operazione(tipoOperazione, conto, conti, importo, setImporto, ibanBeneficiario,setMessaggio,setVisibile,setVisibile2, setIbanBeneficiario,setAggiornamento,aggiornamento)} type="button" className="">FAI UN BONIFICO</button>
                    {errorBanner(messaggio,setMessaggio,setImporto,visibile,visibile2,setVisibile,setVisibile2)}
                </>
            )

    }

}





export function errorBanner(messaggio,setMessaggio,setImporto,visibile,visibile2,setVisibile,setVisibile2) {
    if (visibile) {
        setTimeout(() => {
            setImporto("")
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
            setImporto("")
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




export function datiConto(conto) {
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
                    <b>Saldo:</b> € {(conto.saldo) ? <>{conto.saldo.toFixed(2)}</> : <></>}
                </p>
            </>
        );
    }
}




