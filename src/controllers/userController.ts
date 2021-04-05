import { NextFunction, Router, Request, Response } from "express";
import Controller from "./controller";
import { getKnexInstance } from '../utils/dbInjector'
import User from '../models/user';

const PATH = '/users';

class UserController implements Controller {
    public path = '/users';
    public router = Router();
    
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', this.getAllUsers)
        this.router.get('/:id', this.getUserById);
        this.router.get('/:id/events', this.getAllEventsOfUser);
        this.router.get('/:id/event-feed', this.getEventFeedForUser);
    }

    private getAllUsers = async (request: Request, response: Response, next: NextFunction) => {
        const users = await getKnexInstance()<User>('user').select('*');
        response.send(users);
    }

    private getUserById = async (request: Request, response: Response, next: NextFunction) => {
        
    }

    private getAllEventsOfUser = async (request: Request, response: Response, next: NextFunction) => {
        
    }
    
    private getEventFeedForUser = async (request: Request, response: Response, next: NextFunction) => {
        
    }
}

export default UserController;