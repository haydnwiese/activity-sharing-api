import express from 'express';
import Controller from './controllers/controller';

const PORT = 3000;

export default class App {
    private app: express.Application;

    constructor(controllers: Controller[]) {
        this.app = express();

        this.initializeMiddleware();
        this.initializeControllers(controllers);
    }

    public listen() {
        this.app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`)
        })
    }

    private initializeMiddleware() {
        this.app.use(express.json());
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach(controller => {
            this.app.use(controller.path, controller.router);
        })
    }
}