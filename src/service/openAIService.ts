import OpenAI from "openai";
import { UtilService } from "./utilService";


export class OpenAIService {

    utilService: UtilService = new UtilService()
    async completion(reqBody: any, article: any) {
        try{
            const openai = await this.connect(reqBody.openaiKey)
            const responseCompletion = await openai.chat.completions.create({
                messages: [{ role: "system", content: "Você será minha ferramenta para extração de dados." },
                { role: "user", content: reqBody.instruction + "Extraia as informações em português do artigo abaixo respondendo com um json no formato: " + reqBody.json + "/n " + article }],
                model: reqBody.model,
                response_format: { type: "json_object" }
            });
            const response = JSON.parse(responseCompletion.choices[0].message.content!)
            return response
        } catch(error: any){
            if(error.error.message.substring(0,10) === "Rate limit"){
                console.log(error + "Foi no rate limit")
                const pause = (ms :number) => new Promise(resolve => setTimeout(resolve, ms)); 
                await pause(60000);
                const response:any = await this.completion(reqBody, article)
                return response
            } else if(error.error.message.substring(0,20) === "This model's maximum"){
                var {maxContextLength, resultedTokens} =  this.utilService.extractValuesFromErrorMaximumContent(error.message)
                console.log(error + "Foi no macontent")
                console.log(maxContextLength + "__" + resultedTokens)
                article = this.utilService.reduceTextLength(maxContextLength, resultedTokens, article)
                console.log("Tamanho do article: "+ article.length)
                const response:any = await this.completion(reqBody, article)
                return response
            } console.log(error.error.message)
        }
    }

    async connect(apiKey: string) {
        return new OpenAI({ apiKey: apiKey })
    }

    async testConnection(reqBody: any) {
        try{
            const openai = new OpenAI({ apiKey: reqBody.openaiKey });
            openai.apiKey = reqBody.openaiKey
            await openai.chat.completions.create({
                messages: [{ role: "system", content: "Isso é um teste." },
                { role: "user", content: "Isso é um teste de conexão. Responda apenas com um json {'resposta': 'ok'}" }],
                model: reqBody.model,
                response_format: { type: "json_object" }
            });
        } catch(error: any){
            const errorResponse = {
                message: "Não foi possível se comunicar com a API da OpenAI. Verifique a Api Key e os demais parâmetros.",
                error: error.message
            };
            throw errorResponse
        }


    }
}