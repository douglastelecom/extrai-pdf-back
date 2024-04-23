import PdfParse from "pdf-parse";
import { MongodbService } from "./mongodbService";
import { OpenAIService } from "./openAIService";

export class ExtrAIService {

    openaiService = new OpenAIService()
    mongodbService = new MongodbService()

    async extractJsonFromPdfAndSave(reqBody: any, pdfBuffer: any) {
        const pdf = await PdfParse(pdfBuffer)
        if(pdf.text.length < 400){
            throw new Error("Impossível ler o artigo.")
        }
        const json = await this.openaiService.completion(reqBody, pdf.text)
        const mongoReturn = await this.mongodbService.saveJson(reqBody, json)
        return json
    }
}