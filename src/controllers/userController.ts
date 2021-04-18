import { NextFunction, Request, Response, Router } from "express";
import { UserDto } from "../dtos/userDto";
import eventService from "../services/eventService";
import userService from "../services/userService";
import inviteService from "../services/inviteService";
import Controller from "./controller";
import { EventDto } from "../dtos/eventDto";

const MAX_EVENT_ATTENDEE_IMAGE_URLS = 3;

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
        const users = await userService.list();
        res.send(users);
    }

    private async getUserById (req: Request, res: Response) {
        const user = await userService.findByAuthId(req.params.id);
        res.send(user);
    }

    private async getAllEventsOfUser (req: Request, res: Response) {
        // TODO: Error handling
        const dbUserId = (await userService.getIdByAuthId(req.params.id))?.id;
        if (dbUserId) {
            const events = await eventService.findByCreatorId(dbUserId);   
            res.send(events);
        }
    }
    
    private async getEventFeedForUser (req: Request, res: Response) {
        const dbUserId = (await userService.getIdByAuthId(req.params.id))?.id;
        if (dbUserId) {
            const events = await eventService.getEventFeedForUser(dbUserId);
            res.send(events);
        }
    }

    private async createUser(req: Request, res: Response) {
        req.body.id = null;
        const userId = await userService.create(req.body);
        res.status(201).send({id: userId});
    }
}

export default UserController;