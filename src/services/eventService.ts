import { EventDto, ExtendedEventDto } from "../dtos/eventDto";
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

    async getExtendedEventsForUser(creatorId: number): Promise<ExtendedEventDto[]> {
        const events = await this.findByCreatorId(creatorId);
        return this.generateExtendedEventList(events);
    }

    async getEventFeedForUser(userId: number): Promise<ExtendedEventDto[]> {
        const events = await eventDao.getUpcomingEventsByUserId(userId);
        return this.generateExtendedEventList(events);
    }

    private async generateExtendedEventList(events: any[]): Promise<ExtendedEventDto[]> {
        const eventIds: number[] = events.map(event => event.id);
        
        const invites = await inviteService.findByEventIds(eventIds);
        const eventIdToUserIdListMap = this.generateEventIdToUserIdListMap(events, invites);
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

            event.attendeeCount = invites.filter(invite => invite.eventId == event.id && invite.status == 1).length + 1;
            
            return {
                ...event,
                userDisplayImageUrls
            }
        })
    }

    private generateEventIdToUserIdListMap(events: ExtendedEventDto[], invites: InviteDto[]) {
        const eventIdToUserIdListMap = new Map<number, number[]>();
        
        // Add the creator of each event as the first display image
        events.forEach(({ id, creatorId }) => {
            eventIdToUserIdListMap.set(id, [creatorId])
        });

        // Add additional display images for the attendees of each event
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