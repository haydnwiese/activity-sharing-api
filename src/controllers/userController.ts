import { NextFunction, Request, Response, Router } from "express";
import { UserDto } from "../dtos/userDto";
import UserService from "../services/userService";
import Controller from "./controller";

class UserController implements Controller {
    public path = '/users';
    public router = Router();
    
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.route('/')
            .get(this.listUsers)
            .post(this.createUser);
        this.router.get('/:id', this.getUserById);
        this.router.get('/:id/events', this.getAllEventsOfUser);
        this.router.get('/:id/event-feed', this.getEventFeedForUser);
    }

    private listUsers = async (request: Request, response: Response, next: NextFunction) => {
        const users = await UserService.list();
        response.send(users);
    }

    private getUserById = async (request: Request, response: Response, next: NextFunction) => {
        
    }

    private getAllEventsOfUser = async (request: Request, response: Response, next: NextFunction) => {
        
    }
    
    private getEventFeedForUser = async (request: Request, response: Response, next: NextFunction) => {
        
    }

    private async createUser(req: Request, res: Response, next: NextFunction) {
        req.body.id = null;
        const userId = await UserService.create(req.body);
        res.status(201).send({id: userId});
    }
}

export default UserController;