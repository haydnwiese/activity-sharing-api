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

    private async listUsers(req: Request, res: Response) {
        const users = await UserService.list();
        res.send(users);
    }

    private async getUserById (req: Request, res: Response) {
        
    }

    private async getAllEventsOfUser (req: Request, res: Response) {
        
    }
    
    private async getEventFeedForUser (req: Request, res: Response) {
        
    }

    private async createUser(req: Request, res: Response) {
        req.body.id = null;
        const userId = await UserService.create(req.body);
        res.status(201).send({id: userId});
    }
}

export default UserController;