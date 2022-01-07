const logger = require('../config/logger');
const path = require('path');
const axios = require('axios')
const fs = require('fs');
const newCookie = require('../scraping/newCookie')
const { cookieStrings } = require('../models')

module.exports = async function (data,horaInicial,horaFinal,id,order) {

    // Parametros para a requisição
    const params = new URLSearchParams()
    params.append('sort', "DataHoraPassagem-desc")
    params.append('page', '1')
    params.append('pageSize','')
    params.append('group', "")
    params.append('filter', "")
    params.append('dataInicial', data)
    params.append('dataFinal', data)

    if(order===1){
        params.append('equipamentosIds[0]', "11c5b822-9109-421b-adbf-7629a3185c7f")
        params.append('equipamentosIds[1]', "de0777b3-dbff-4b4a-97c1-d86ce0ae63d3")
        params.append('equipamentosIds[2]', "02491c6d-25b2-4c14-ade1-a84a167d8f7a")
        params.append('equipamentosIds[3]', "044552c6-a853-48f9-9643-ddd55e5e8d74")
        params.append('equipamentosIds[4]', "bf5c9405-2d8d-415e-88e8-ab81174f6de9")
        params.append('equipamentosIds[5]', "5622a9a5-8f0f-43f3-a882-e9eb9461fa85")
        params.append('equipamentosIds[6]', "eac8c1ac-6a26-47ce-9732-a4137bdb3469")
        params.append('equipamentosIds[7]', "67615e13-47f9-4c20-9abc-6cf888b1fde8")
        params.append('equipamentosIds[8]', "bd69552b-e770-4a48-9612-1ea1cd67e9f7")
        params.append('equipamentosIds[9]', "b4399300-85cc-4d18-ae15-978b059e2aae")
        params.append('equipamentosIds[10]', "12275e6c-e966-4cb6-959e-0b0138ce8519")
        params.append('equipamentosIds[11]', "bc722a0f-4b23-4bd3-b802-2b40a444b009")
        params.append('equipamentosIds[12]', "6582a06d-ab23-4f4c-aef6-a4f4ba4d708f")
        params.append('equipamentosIds[13]', "7d00f09b-ecbf-4437-92db-11ca00e4ecae")
        params.append('equipamentosIds[14]', "e070198a-5634-40dd-8812-cc1e3ba7e681")
    } else if(order===2){
        params.append('equipamentosIds[0]', "e2e5f6a4-f97c-453a-84c1-28c6c8adc9df")
        params.append('equipamentosIds[1]', "3738bcce-8427-44af-8983-387a0f6b85f1")
        params.append('equipamentosIds[2]', "f9bf2ef7-551c-463e-bdeb-51ffa65f1bc7")
        params.append('equipamentosIds[3]', "6820eb28-b0bd-433b-ab75-8bd9dfbeeabe")
        params.append('equipamentosIds[4]', "be0efa7f-e939-492b-ae86-8d0f365152b6")
        params.append('equipamentosIds[5]', "b43c6b57-d9ad-4a76-833a-9593ffec7868")
        params.append('equipamentosIds[6]', "b87aaff1-8bbf-4693-af18-610b985c7640")
        params.append('equipamentosIds[7]', "878aac00-e692-4b20-9ccf-ae6ae288ed6b")
        params.append('equipamentosIds[8]', "6ec04556-90ee-4a24-9559-4577cf38175c")
        params.append('equipamentosIds[9]', "927060f5-1e03-4600-8902-c21831a6e744")
        params.append('equipamentosIds[10]', "ff243f31-7522-450f-af25-37e2a091273e")
        params.append('equipamentosIds[11]', "11ed6e89-33a0-4dc5-ac56-cac2caf06ca6")
        params.append('equipamentosIds[12]', "a5d8d846-e44d-4222-a4f1-e1cbc53d2ae6")
        params.append('equipamentosIds[13]', "c7a0f5f2-5c4c-4bc6-bb19-15a7690218ba")
    }
    params.append('faixasIds', "")
    params.append('horaInicio', horaInicial)
    params.append('horaFim', horaFinal)

    // Função de chamada para o endpoint dos dados
    const chamada = async (cookieString) => {
        const response = await axios.post("https://strans.codtran.ws/relatorio/datahandlerfilterpassagem", params, 
            {
                headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "cookie": cookieString
                },
            })
        return response
    }
    // Fazendo a chamada com o cookieString do json
    const cookies = await JSON.parse(fs.readFileSync(path.resolve(__dirname,'../cookies/cookies.json'), 'utf8'))
    const cookieString = cookies[4].name+"="+cookies[4].value+"; "+cookies[3].name+"="+cookies[3].value+"; "+cookies[2].name+"="+cookies[2].value+"; "+cookies[0].name+"="+cookies[0].value

    logger.info(`${id} - ${new Date().toLocaleString()} - 0 - leu o arquivo cookies.json com sucesso`)
    const resultCookie = await chamada(cookieString)

    // Testando se precisa autenticar novamente
    if(resultCookie.data.Data) {

        logger.info(`${id} - ${new Date().toLocaleString()} - 1 - dados recebidos com sucesso, total de passagens: ${resultCookie.data.Total}`)
        return resultCookie.data

    } else {

        logger.info(`${id} - ${new Date().toLocaleString()} - 2 - criando novo cookie`)            
        
        // Fazendo login e salvando o cookie
        const cookies = await newCookie()
        const cookieString = cookies[4].name+"="+cookies[4].value+"; "+cookies[3].name+"="+cookies[3].value+"; "+cookies[2].name+"="+cookies[2].value+"; "+cookies[0].name+"="+cookies[0].value  
        logger.info(`${id} - ${new Date().toLocaleString()} - 2 - arquivo de cookies criado com sucesso`)                 
        await cookieStrings.create({valor: cookies[0].expires})
        // Fazendo a chamada com o novo cookie
        const resultCookie = await chamada(cookieString)
        logger.info(`${id} - ${new Date().toLocaleString()} - 2 - dados recebidos com sucesso, total de passagens: ${resultCookie.data.Total}`)            
        
        return resultCookie.data
    }
}

