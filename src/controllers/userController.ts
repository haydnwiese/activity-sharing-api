import { NextFunction, Request, Response, Router } from "express";
import UserService from "../services/userService";
import Controller from "./controller";

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
        const users = await UserService.list();
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