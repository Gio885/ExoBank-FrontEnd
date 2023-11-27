


export function modificaStato(conto){
    conto.stato.id = id_stato
    updateConto(conto).then( (response) => {
        if(response.data){
            setAggiornamento(!aggiornamento)
            setVisibile2(true)
            setMessaggio("Conto numero: "+conto.numeroConto+" aggiornato con successo")   
        }else{
            setAggiornamento(!aggiornamento)
            setVisibile(true)
            setMessaggio("C'è stato un errore durante l'operazione, contatta l'amministratore") 
        }
        
    })

}