import { EventDto } from "../dtos/eventDto";
import { getKnexInstance } from "../utils/dbInjector";
import inviteService from "../services/inviteService";
import { InviteDto } from "../dtos/inviteDto";
import userService from "./userService";

const MAX_EVENT_ATTENDEE_IMAGE_URLS = 3;

class EventService {
    async create(resource: EventDto) {
        const [ eventId ] = await getKnexInstance()<EventDto>('event').insert(resource);
        return eventId;
    }

    async list() {
        return getKnexInstance()<EventDto>('event').select('*');
    }

    async findById(resourceId: string) {
        return getKnexInstance()<EventDto>('event').select('*').where('id', resourceId).first;
    }

    async findByCreatorId(creatorId: number) {
        return getKnexInstance()<EventDto>('event').select('*').where('creatorId', creatorId);
    }

    async getEventFeedForUser(userId: number): Promise<EventDto[]> {
        const knex = getKnexInstance();
        const events = await knex('event')
            .select(
                'event.*',
                knex.raw('COUNT(invite.id)')
            )
            .leftJoin('invite', function() {
                this.on('event.id', '=', 'invite.eventId')
            })
            .whereRaw('event.scheduledAt >= CURDATE()')
            .andWhere(function () {
                this
                  .where('event.creatorId', userId)
                  .orWhere(function() {
                      this
                        .where('invite.targetId', userId)
                        .andWhere('invite.status', 1)
                  })
            })
            .groupByRaw('event.id');

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