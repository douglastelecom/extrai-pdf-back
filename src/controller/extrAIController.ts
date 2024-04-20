import { ExtrAIService } from './../service/extrAIService';
import { Request, Response } from 'express';
import { OpenAIService } from 'service/openAIService';
import { MongodbService } from 'service/mongodbService';

export class ExtrAIController {
    extrAIService = new ExtrAIService()
    openaiService = new OpenAIService()
    mongodbService = new MongodbService()

    async extractJsonFromPdf(req: Request, res: Response) {
        try {
            const pdfBuffer = req.file!.buffer
            const reqBody = JSON.parse(req.body.json)
            await this.extrAIService.extractJsonFromPdfAndSave(reqBody, pdfBuffer)
            res.status(200).send()
        } catch (error: any) {
            console.log(error.message)
            console.log("erro na extração")
            res.status(500).send(error)
        }
    }

    async testConnections(req: Request, res: Response) {
        try {
            const reqBody = req.body
            await this.openaiService.testConnection(reqBody)
            await this.mongodbService.testConnection(reqBody.mongoUrl)
            res.status(200).send()
        } catch (error: any) {
            console.log(error)
            res.status(500).send(error)
        }
    }
}