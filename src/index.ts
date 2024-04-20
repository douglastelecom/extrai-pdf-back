import { ExtrAIController } from 'controller/extrAIController';
import express, { Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import multer from 'multer';


const app = express();
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

const server = createServer(app);
const port = 8080;
const upload = multer();
const extraAIController = new ExtrAIController()

app.use(express.json())

server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});

app.post("/completion", upload.single('file'), async (req: Request, res: Response) => {
    await extraAIController.extractJsonFromPdf(req, res);
})

app.post("/test", async (req: Request, res: Response) => {
    await extraAIController.testConnections(req, res)
})


