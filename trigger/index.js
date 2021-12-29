const axios = require("axios");

async function execute(){

    const date = new Date()
    const data = date.toISOString().split('T')[0] //Pegando data atual no formato AAAA/MM/DD e separando
    const horaInicial = new Date(date.getTime() - 180000 - 3600000).toLocaleTimeString('pt-BR', { timeZone: 'America/Fortaleza' }).slice(0,5)
    const horaFinal = new Date(date.getTime()- 3600000).toLocaleTimeString('pt-BR', { timeZone: 'America/Fortaleza' }).slice(0,5)

    const horaInicialNow = new Date(date.getTime() - 180000).toLocaleTimeString('pt-BR', { timeZone: 'America/Fortaleza' }).slice(0,5)
    const horaFinalNow = new Date(date.getTime()).toLocaleTimeString('pt-BR', { timeZone: 'America/Fortaleza' }).slice(0,5)

    const horaInicialAtlanta = new Date(date.getTime() - 180000).toISOString()
    const horaFinalAtlanta = new Date(date.getTime()).toISOString()


    //const data = '2021-10-13'
    //const horaInicial = '19:06'
    //const horaFinal = '19:07'
    //console.log(data,horaInicial,horaFinal,horaInicialNow,horaFinalNow,horaInicialAtlanta,horaFinalAtlanta)
    await axios.post('http://localhost:3333',{ 
            data,
            horaInicial, 
            horaFinal ,
            horaInicialNow , 
            horaFinalNow, 
            horaFinalAtlanta, 
            horaInicialAtlanta
        }
    )
}
setInterval(execute, 240000);
execute()
