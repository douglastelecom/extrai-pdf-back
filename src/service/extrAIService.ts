import PdfParse from "pdf-parse";
import { MongodbService } from "./mongodbService";
import { OpenAIService } from "./openAIService";

export class ExtrAIService {

    openaiService = new OpenAIService()
    mongodbService = new MongodbService()

    async extractJsonFromPdfAndSave(reqBody: any, pdfFile: Express.Multer.File) {
        const pdfBuffer = pdfFile.buffer
        const pdf = await PdfParse(pdfBuffer)
        if(pdf.text.length < 400){
            throw new Error("Impossível ler o artigo.")
        }
        const json = await this.openaiService.completion(reqBody, pdf.text)
        json.filename = pdfFile.originalname
        json.dateCreated = new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"});
        const mongoReturn = await this.mongodbService.saveJson(reqBody, json)
        return json
    }
}