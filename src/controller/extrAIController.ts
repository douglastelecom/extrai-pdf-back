import { ExtrAIService } from './../service/extrAIService';
import { Request, Response } from 'express';
import { OpenAIService } from 'service/openAIService';
import { MongodbService } from 'service/mongodbService';
import "dotenv/config";

export class ExtrAIController {
    extrAIService = new ExtrAIService()
    openaiService = new OpenAIService()
    mongodbService = new MongodbService()

    async extractJsonFromPdf(req: Request, res: Response) {
        try {
            const pdfBuffer = req.file!.buffer
            const reqBody = JSON.parse(req.body.json)
            reqBody.openaiKey = process.env.OPENAI_KEY
            reqBody.model = process.env.MODEL
            reqBody.db = process.env.DB
            reqBody.mongoUrl = process.env.MONGO_URL
            console.log(reqBody)
            const resposta = await this.extrAIService.extractJsonFromPdfAndSave(reqBody, pdfBuffer)
            res.status(200).send(resposta)
        } catch (error: any) {
            console.log(error.message)
            console.log("erro na extração")
            res.status(500).send(error)
        }
    }

    async testConnections(req: Request, res: Response) {
        try {
            const reqBody = req.body
            reqBody.openaiKey = process.env.OPENAI_KEY
            reqBody.model = process.env.MODEL
            reqBody.db = process.env.DB
            reqBody.mongoUrl = process.env.MONGO_URL
            console.log(reqBody)
            await this.openaiService.testConnection(reqBody)
            await this.mongodbService.testConnection(reqBody.mongoUrl)
            res.status(200).send()
        } catch (error: any) {
            console.log(error)
            res.status(500).send(error)
        }
    }
}