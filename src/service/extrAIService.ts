import PdfParse from "pdf-parse";
import { MongodbService } from "./mongodbService";
import { OpenAIService } from "./openAIService";

export class ExtrAIService {

    openaiService = new OpenAIService()
    mongodbService = new MongodbService()

    async extractJsonFromPdfAndSave(reqBody: any, pdfBuffer: any) {
        const pdf = await PdfParse(pdfBuffer)
        const json = await this.openaiService.completion(reqBody, pdf.text)
        const mongoReturn = await this.mongodbService.saveJson(reqBody, json)
    }

    extractValuesFromErrorMessage(errorMessage: any) {
        const regex = /This model's maximum context length is (\d+) tokens\. However, your messages resulted in (\d+) tokens\./;
        const match = errorMessage.match(regex);
        if (!match || match.length < 3) {
            throw new Error('Erro ao extrair valores da mensagem de erro');
        }
        const maxContextLength = parseInt(match[1], 10);
        const resultedTokens = parseInt(match[2], 10);
        return { maxContextLength, resultedTokens };
    }

    reduceTextLength(maxToken: number, currentToken: number, text: string) {
        const ratioToken = (currentToken / maxToken) - 0.05
        return text.slice(0, Math.ceil(text.length * ratioToken))
    }

}