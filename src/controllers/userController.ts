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
            const eventIds: number[] = events.map(event => event.id);
            
            const invites = await inviteService.findByEventIds(eventIds);

            const attendingUserIdSet = new Set<number>();
            const eventIdToUserIdListMap = new Map<number, number[]>();
            invites.forEach(invite => {
                // Add to set of unique user ids to be used is selecting user display images
                attendingUserIdSet.add(invite.targetId)

                const userIdList = eventIdToUserIdListMap.get(invite.eventId);
                if (userIdList) {
                    if (userIdList.length < MAX_EVENT_ATTENDEE_IMAGE_URLS) {
                        userIdList.push(invite.targetId);
                    }
                } else {
                    eventIdToUserIdListMap.set(invite.eventId, [invite.targetId])
                }
            });
            
            const userImageIds = await userService.findDisplayImagesByIds(Array.from(attendingUserIdSet));
            const userIdToImageIdMap = new Map<number,string>();
            // TODO: create pre-signed urls for each image
            userImageIds.forEach(({ id, displayImageId }) => userIdToImageIdMap.set(id, displayImageId));

            const returnEvents: EventDto[] = [];
            events.forEach(event => {
                const userDisplayImageUrls: string[] = [];
                eventIdToUserIdListMap.get(event.id)?.forEach(userId => {
                    const displayImageUrl = userIdToImageIdMap.get(userId)
                    if (displayImageUrl)
                        userDisplayImageUrls.push(displayImageUrl);
                })

                returnEvents.push({
                    ...event,
                    userDisplayImageUrls
                })
            })
            
            res.send(returnEvents); 
        }
    }

    private async createUser(req: Request, res: Response) {
        req.body.id = null;
        const userId = await userService.create(req.body);
        res.status(201).send({id: userId});
    }
}

export default UserController;