import OpenAI from "openai";
import { UtilService } from "./utilService";


export class OpenAIService {

    utilService: UtilService = new UtilService()
    async completion(reqBody: any, article: any) {
        try {
            const openai = await this.connect(reqBody.openaiKey)
            const responseCompletion = await openai.chat.completions.create({
                messages: [{ role: "system", content: "Você será minha ferramenta para extração de dados." },
                { role: "user", content: reqBody.instruction + "Extraia as informações em português (se não estiver em português, traduza) contidas no artigo abaixo respondendo com um json no formato: " + reqBody.json + " \n " + "Recupere apenas o que está no artigo, não coloque informações que não estão explicitamente no artigo." + " \n " + article }],
                model: reqBody.model,
                response_format: { type: "json_object" },
                seed: 123,
                temperature: 0.4
            });
            const response = JSON.parse(responseCompletion.choices[0].message.content!)
            return response
        } catch (error: any) {
            if (error.error.message.substring(0, 10) === "Rate limit") {
                const pause = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
                await pause(30000);
                const response: any = await this.completion(reqBody, article)
                return response
            } else if (error.error.message.substring(0, 20) === "This model's maximum") {
                var { maxContextLength, resultedTokens } = this.utilService.extractValuesFromErrorMaximumContent(error.message)
                    article = this.utilService.reduceTextLength(maxContextLength, resultedTokens, article)
                    const response: any = await this.completion(reqBody, article)
                    return response
                
            }
            console.log(error)
            throw error
        }
    }

    async connect(apiKey: string) {
        return new OpenAI({ apiKey: apiKey })
    }

    async testConnection(reqBody: any) {
        try {
            const openai = new OpenAI({ apiKey: reqBody.openaiKey });
            openai.apiKey = reqBody.openaiKey
            await openai.chat.completions.create({
                messages: [{ role: "system", content: "Isso é um teste." },
                { role: "user", content: "Isso é um teste de conexão. Responda apenas com um json {'resposta': 'ok'}" }],
                model: reqBody.model,
                response_format: { type: "json_object" }
            });
        } catch (error: any) {
            const errorResponse = {
                message: "Não foi possível se comunicar com a API da OpenAI. Verifique a Api Key e os demais parâmetros.",
                error: error.message
            };
            throw errorResponse
        }


    }
}