const logger = require('../config/logger')
const crypto = require('crypto')
const api = require('../config/api')
const { passagens } = require('../models')
const axios = require("axios");
var payload = require('../config/atlanta') 

exports.post = async (req,res) => {
    // Criando número aleátorio para indentificar cada chamada
    const id = crypto.randomBytes(6).toString('hex')

    try {
        logger.info("--------------------------------------------------------------------------------------------------------")       
        const {data, horaInicial, horaFinal ,horaInicialNow , horaFinalNow, horaFinalAtlanta, horaInicialAtlanta} = req.body

        // Iniciando a chamada para a atlanta
        payload['periodoInicial'] = horaInicialAtlanta
        payload['periodoFinal'] = horaFinalAtlanta

        logger.info(`${id} - ${new Date().toLocaleString()} - 0 - iniciando a chamada (ATLANTA) para: ${data}, das ${horaInicialNow} até as ${horaFinalNow}`)
        const resultChamadaAtlanta = await axios.post( 'https://b2b.atlantatecnologia.com.br/api/evento/find', payload )
        logger.info(`${id} - ${new Date().toLocaleString()} - 1 - dados recebidos com sucesso, total de passagens: ${resultChamadaAtlanta.data.totalItens}`)

        // Lendo os resultados, salvando e enviando os mesmos
        await Promise.all( resultChamadaAtlanta.data.itens.map(async (pass)=>{
	 if(pass.placaVeiculo !== '0' && pass.placaVeiculo !== null && pass.placaVeiculo !== "") {

           try {
            // Salvando no DB
            await passagens.create({
                idOriginal: pass.id,
                placa:pass.placaVeiculo,
                dataHora: new Date(pass.dtHoraEvento).toISOString(),
                cameraNumero: pass.nomeEquipamento,
            })
            
            // Enviando para o MJ
            const resp = await axios.post('https://streammjsp4.servicebus.windows.net/teresina/messages',{
                placa:pass.placaVeiculo,
                dataHora: new Date(pass.dtHoraEvento).toISOString(),
                cameraNumero: pass.nomeEquipamento+(pass.faixa.nuFaixa).toString(), //nuSerieEquipamento
            },{
                headers: {
                "Content-Type": "application/json",
                "Authorization": 'SharedAccessSignature sr=streammjsp4.servicebus.windows.net%2Fteresina&sig=tQBEAAGRpvHNRCzk6vmt8Iv7Tgnt90CpQLHtbptMzro%3D&se=1948804547&skn=sendevent'
            },
            })

	    console.log({
                placa:pass.placaVeiculo,
                dataHora: new Date(pass.dtHoraEvento).toISOString(),
                cameraNumero: pass.nomeEquipamento+(pass.faixa.nuFaixa).toString(), //nuSerieEquipamento
            })
                } catch{err=> logger.info(`${id} - ${new Date().toLocaleString()} - 3 - erro ocorrido: ${err.message}`)}
            
            
            }}))
            
        

        logger.info(`${id} - ${new Date().toLocaleString()} - 0 - salvo no BD, os dados da atlanta`)

        // Iniciando a chamada para a labor
        logger.info(`${id} - ${new Date().toLocaleString()} - 0 - iniciando a chamada 1(LABOR) para: ${data}, das ${horaInicialNow} até as ${horaFinalNow}`)
        const resultChamada1 = await api(data,horaInicialNow,horaFinalNow,id,1)
        logger.info(`${id} - ${new Date().toLocaleString()} - 0 - iniciando a chamada 2(LABOR) para: ${data}, das ${horaInicialNow} até as ${horaFinalNow}`)
        const resultChamada2 = await api(data,horaInicialNow,horaFinalNow,id,2)          

        const dadosTotais = resultChamada1.Data.concat(resultChamada2.Data)
        
        // Lendo os resultados, salvando e enviando os mesmos
        await Promise.all( dadosTotais.map(async (pass)=>{
        if(pass.PlacaVeiculo !== '0' && pass.PlacaVeiculo !== null && pass.PlacaVeiculo !== "") {
          try {
            // Salvando no BD
            await passagens.create({
                idOriginal: pass.Id.toString(),
                placa:pass.PlacaVeiculo,
                dataHora:pass.DataHoraPassagem,
                cameraNumero: pass.Equipamento,
            }).then().catch(err=> logger.info(`${id} - ${new Date().toLocaleString()} - 3 - erro ocorrido no salvamendo dos dados no BD:${err}`))

            // Enviando para o MJ
           const resp = await axios.post('https://streammjsp4.servicebus.windows.net/teresina/messages', {   
                placa:pass.PlacaVeiculo,
                dataHora:pass.DataHoraPassagem,
                cameraNumero: pass.Equipamento,
            },{
            headers: {
            "Content-Type": "application/json",
            "Authorization": 'SharedAccessSignature sr=streammjsp4.servicebus.windows.net%2Fteresina&sig=tQBEAAGRpvHNRCzk6vmt8Iv7Tgnt90CpQLHtbptMzro%3D&se=1948804547&skn=sendevent'
            },}).then(console.log('enviou mjsp dados da labor novos')).catch(err=> logger.info(`${id} - ${new Date().toLocaleString()} - 3 - erro ocorrido no envio da labor novos para mjsp:${err}`))
           console.log(resp.status)
	   console,log({ placa:pass.PlacaVeiculo,
                dataHora:pass.DataHoraPassagem,
                cameraNumero: pass.Equipamento,
            })
        } catch{err=> logger.info(`${id} - ${new Date().toLocaleString()} - 3 - erro ocorrido aqui 1:${err}`)}
	   // Enviando para a PRF
            const formato = {
                    placa:pass.PlacaVeiculo,
                    dataHoraTz:pass.DataHoraPassagem + '-03:00',
                    camera: {
                        numero: pass.Faixa.slice(0,7).replace('-','').replace('T','')
                    },
                    empresa: "LABOR",
                    key:"C08558B3E10008EFADAAA42839C2D0",
                }
                const re = await axios.post('https://wsocrspia.prf.gov.br/wsocrspia/pi',formato,{
                headers: {
                     "Content-Type": "application/json",
                     "User-Agent": 'strans'
                },
            })
            console.log(re.data)//.then(console.log('enviou prf dados novos')).catch(err=> logger.info(`${id} - ${new Date().toLocaleString()} - 3 - erro ocorrido no envio da labor novos para prf:${err}`))

        }}))
       
        logger.info(`${id} - ${new Date().toLocaleString()} - 0 - salvo no BD, a chamada para os dados atuais da labor`)
 
        // Chamada para os dados antigos da labor
        logger.info(`${id} - ${new Date().toLocaleString()} - 0 - iniciando a chamada 1(LABOR) para: ${data}, das ${horaInicial} até as ${horaFinal}`)
        const resultChamada11 = await api(data,horaInicial,horaFinal,id,1)
        logger.info(`${id} - ${new Date().toLocaleString()} - 0 - iniciando a chamada 2(LABOR) para: ${data}, das ${horaInicial} até as ${horaFinal}`)
        const resultChamada21 = await api(data,horaInicial,horaFinal,id,2)          

        const dadosAntigos = resultChamada11.Data.concat(resultChamada21.Data)
        var i = 0;

        await Promise.all( dadosAntigos.map(async (pass)=>{
          if(pass.PlacaVeiculo !== '0' && pass.PlacaVeiculo !== null && pass.PlacaVeiculo !== "") {
            // Verificando se existe passagem já salva
            const passSaved = await passagens.findOne({ where: { idOriginal: pass.Id.toString() } });

            if(passSaved) {
                //logger.info(`${new Date().toLocaleString()} - 0 - não salvou, passagen igual: ${passSaved.idOriginal}`)
                i = i+1
            } else {
               try { 
                await passagens.create({
                    idOriginal: pass.Id.toString(),
                    placa:pass.PlacaVeiculo,
                    dataHora:pass.DataHoraPassagem,
                    cameraNumero: pass.Equipamento,
                    }).then().catch(err=> logger.info(`${id} - ${new Date().toLocaleString()} - 3 - erro ocorrido no salvalmento no bd: ${err}`))

                await axios.post('https://streammjsp4.servicebus.windows.net/teresina/messages',
                {   placa:pass.PlacaVeiculo,
                    dataHora:pass.DataHoraPassagem,
                    cameraNumero: pass.Equipamento,
                    },{
                headers: {
                "Content-Type": "application/json",
                "Authorization": 'SharedAccessSignature sr=streammjsp4.servicebus.windows.net%2Fteresina&sig=tQBEAAGRpvHNRCzk6vmt8Iv7Tgnt90CpQLHtbptMzro%3D&se=1948804547&skn=sendevent'
                },
                }).then(console.log('enviou mjsp')).catch(err=> logger.info(`${id} - ${new Date().toLocaleString()} - 3 - erro ocorrido no envio dos dados velhos para o mjsp:${err}`))

              } catch{err=> logger.info(`${id} - ${new Date().toLocaleString()} - 3 - erro ocorrido: ${err}`)}
            try { 
                const formato = {
                        placa:pass.PlacaVeiculo,
                        dataHoraTz:pass.DataHoraPassagem + '-03:00',
                        camera: {
                            numero: pass.Faixa.slice(0,7).replace('-','').replace('T','')
                        },
                        empresa: "LABOR",
                        key:"C08558B3E10008EFADAAA42839C2D0",
                    }
                await axios.post('https://wsocrspia.prf.gov.br/wsocrspia/pi',formato,{
                    headers: {
                        "Content-Type": "application/json",
                        "User-Agent": 'strans'
                    },
                }).then(console.log('enviou prf')).catch(err=> logger.info(`${id} - ${new Date().toLocaleString()} - 3 - erro ocorrido no envio dos dados velhos para a prf:${err}`))
            } catch{err=> logger.info(`${id} - ${new Date().toLocaleString()} - 3 - erro ocorrido: ${err}`)}
      
            }
        }}))

        logger.info(`${id} - ${new Date().toLocaleString()} - 0 - salvo no BD, a chamada para os dados antigos da labor`)
        logger.info(`${id} - ${new Date().toLocaleString()} - 0 - dados antigos: ${dadosAntigos.length}`)
        logger.info(`${id} - ${new Date().toLocaleString()} - 0 - Filtrados ${i}`)
        logger.info(`${id} - ${new Date().toLocaleString()} - 0 - Finalizadas todas as chamadas`)

        res.status(200).json({1: dadosTotais})
    } catch(err) {
        logger.info(`${id} - ${new Date().toLocaleString()} - 3 - erro ocorrido: ${err.message}`)        
        return res.status(200).json({erro: err.name, menssagem: err.message})
    }
};
