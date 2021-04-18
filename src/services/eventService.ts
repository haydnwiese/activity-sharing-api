import { EventDto } from "../dtos/eventDto";
import { getKnexInstance } from "../utils/dbInjector";
import inviteService from "../services/inviteService";
import { InviteDto } from "../dtos/inviteDto";
import userService from "./userService";
import eventDao from "../daos/eventDao";

const MAX_EVENT_ATTENDEE_IMAGE_URLS = 3;

class EventService {
    async create(resource: EventDto) {
        const [ eventId ] = await eventDao.addEvent(resource);
        return eventId;
    }

    async list() {
        return eventDao.getEvents();
    }

    async findById(resourceId: number) {
        return eventDao.getEventById(resourceId);
    }

    async findByCreatorId(creatorId: number) {
        return eventDao.getEventsByCreatorId(creatorId);
    }

    async getEventFeedForUser(userId: number): Promise<EventDto[]> {
        const events = await eventDao.getUpcomingEventsByUserId(userId);
        const eventIds: number[] = events.map(event => event.id);
        
        const invites = await inviteService.findByEventIds(eventIds);
        const eventIdToUserIdListMap = this.generateEventIdToUserIdListMap(invites);
        const attendingUserIds = this.extractUniqueUserIdsFromMap(eventIdToUserIdListMap);

        const userImageIds = await userService.findDisplayImagesByIds(attendingUserIds);
        const userIdToImageIdMap = new Map<number,string>();
        // TODO: create pre-signed urls for each image
        userImageIds.forEach(({ id, displayImageId }) => userIdToImageIdMap.set(id, displayImageId));

        return events.map(event => {
            const userDisplayImageUrls: string[] = [];
            eventIdToUserIdListMap.get(event.id)?.forEach(userId => {
                const displayImageUrl = userIdToImageIdMap.get(userId)
                if (displayImageUrl)
                    userDisplayImageUrls.push(displayImageUrl);
            })

            return {
                ...event,
                userDisplayImageUrls
            }
        })
    }

    private generateEventIdToUserIdListMap(invites: InviteDto[]) {
        const eventIdToUserIdListMap = new Map<number, number[]>();
        invites.forEach(invite => {
            const userIdList = eventIdToUserIdListMap.get(invite.eventId);
            if (userIdList) {
                if (userIdList.length < MAX_EVENT_ATTENDEE_IMAGE_URLS) {
                    userIdList.push(invite.targetId);
                }
            } else {
                eventIdToUserIdListMap.set(invite.eventId, [invite.targetId])
            }
        });
        return eventIdToUserIdListMap;
    }

    private extractUniqueUserIdsFromMap(eventIdToUserIdListMap: Map<number, number[]>) {
        const attendingUserIdSet = new Set<number>();
        for (let value of eventIdToUserIdListMap.values()) {
            value.forEach(userId => attendingUserIdSet.add(userId));
        }
        return Array.from(attendingUserIdSet);
    }
}

export default new EventService();