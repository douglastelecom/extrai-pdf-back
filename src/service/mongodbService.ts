import { MongoClient } from 'mongodb';

export class MongodbService {

    connect(mongoUrl: string) {
        return new MongoClient(mongoUrl)
    }

    async testConnection(mongoUrl: string) {
        try{
            const client = new MongoClient(mongoUrl)
            await client.connect()
        }catch(error: any){
            const errorResponse = {
                message: "Não foi possível se comunicar com o mongodb. Verifique a Url.",
                error: error.message
            };
            throw errorResponse
        }

    }

    async saveJson(reqBody: any, json: any) {
        const client = new MongoClient(reqBody.mongoUrl)
        const collection = client.db(reqBody.db).collection(reqBody.collection)
        const completionResp = await collection.insertOne(json)
        return completionResp
    }
}