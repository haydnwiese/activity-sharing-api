import express from 'express';

const PORT = 3000;

export default class App {
    private app: express.Application;

    constructor() {
        this.app = express();

        this.initializeMiddleware();
        this.initializeControllers();
    }

    public listen() {
        this.app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`)
        })
    }

    private initializeMiddleware() {
        this.app.use(express.json());
    }

    private initializeControllers() {

    }
}