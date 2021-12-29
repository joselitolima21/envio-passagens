const logger = require('../config/logger')
const axios = require('axios')

const envioDasPassagens = async (lista,id) => {
    let tamanhoDaLista = lista.length
    logger.info(`${id} - ${new Date().toLocaleString()} - 0 - tamanho da lista de dados obtida: ${tamanhoDaLista}`)
	
    let quant = parseInt(tamanhoDaLista/50)
	const resto = tamanhoDaLista - quant*50
	
	if(resto === 0){
        quant = quant
	} else {
        quant = quant + 1
	}
	
    for (var i = 1; i <= quant; i++) {
        if (i!==quant){

            // Chamada para a prf
            /*const listaDeEnvio = lista.slice(50*(i-1),50*i).map((pass) => {
                const formato = {
                    placa:pass.PlacaVeiculo,
                    dataHoraTz:pass.DataHoraPassagem,
                    camera: {
                        numero: pass.Equipamento
                    },
                    empresa: "LABOR",
                    key:"C08558B3E10008EFADAAA42839C2D0",
                }
                return formato
                
            })
            const response = await axios.post('http://erdsice2.prf.gov.br/wsocrspia/wsocrhomo/',listaDeEnvio,{
                headers: {
                "Content-Type": "application/json",
                "User-Agent": 'strans'
                },
            })*/
            
            const listaDeEnvio = lista.slice(50*(i-1),50*i).map((pass) => {
                const formato = {
                    placa:pass.PlacaVeiculo,
                    dataHoraLocal:pass.DataHoraPassagem,
                    codigoLocal: pass.Faixa.slice(0,7).replace('-','').replace('T',''),
                }
                return formato
            })
            
            
            const response = await axios.post('https://streammjsp4.servicebus.windows.net/teresina/messages',listaDeEnvio,{
                headers: {
                "Content-Type": "application/json",
                "Authorization": 'SharedAccessSignature sr=streammjsp4.servicebus.windows.net%2Fteresina&sig=tQBEAAGRpvHNRCzk6vmt8Iv7Tgnt90CpQLHtbptMzro%3D&se=1948804547&skn=sendevent'
                },
            })
            logger.info(`${id} - ${new Date().toLocaleString()} - 0 - enviada a lista numero: ${i} - [${50*(i-1)},${50*i}] status: ${response.status}`)

            // Logando os dados para ver o que sai
            //logger.info(`${JSON.stringify(listaDeEnvio)}`)
            

        } else {

            // Chamada para a prf
            /*const listaDeEnvio = lista.slice(50*(i-1),tamanhoDaLista).map((pass) => {
                const formato = {
                    placa:pass.PlacaVeiculo,
                    dataHoraTz:pass.DataHoraPassagem,
                    camera: {
                        numero:pass.Equipamento
                    },
                    empresa: "LABOR",
                    key:"C08558B3E10008EFADAAA42839C2D0",
                }
                return formato
            })
            const response = await axios.post('http://erdsice2.prf.gov.br/wsocrspia/wsocrhomo/',listaDeEnvio,{
                headers: {
                "Content-Type": "application/json",
                "User-Agent": 'strans'
                },
            })*/

            const listaDeEnvio = lista.slice(50*(i-1),tamanhoDaLista).map((pass) => {
                const formato = {
                    placa:pass.PlacaVeiculo,
                    dataHoraLocal:pass.DataHoraPassagem,
                    codigoLocal: pass.Faixa.slice(0,7).replace('-','').replace('T',''),
                }
                return formato
            })


            const response = await axios.post('https://streammjsp4.servicebus.windows.net/teresina/messages',listaDeEnvio,{
                headers: {
                "Content-Type": "application/json",
                "Authorization": 'SharedAccessSignature sr=streammjsp4.servicebus.windows.net%2Fteresina&sig=tQBEAAGRpvHNRCzk6vmt8Iv7Tgnt90CpQLHtbptMzro%3D&se=1948804547&skn=sendevent'
                },
            })
            logger.info(`${id} - ${new Date().toLocaleString()} - 0 - enviada a lista numero: ${i} - [${50*(i-1)},${tamanhoDaLista}] status: ${response.status}`)
          
            // Logando os dados para ver o que sai
            //logger.info(`${JSON.stringify(listaDeEnvio)}`) 
        }
	}
    logger.info(`${id} - ${new Date().toLocaleString()} - 0 - lista completamente enviada`)
}

module.exports = envioDasPassagens