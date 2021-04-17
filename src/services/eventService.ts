import { EventDto } from "../dtos/eventDto";
import { getKnexInstance } from "../utils/dbInjector";

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

    async getEventFeedForUser(userId: number) {
        const knex = getKnexInstance();
        return knex<EventDto>('event')
            .select(
                'event.*',
                knex.raw('COUNT(invite.id)')
            )
            .leftJoin('invite', function() {
                this.on('event.id', '=', 'invite.eventId')
            })
            .where(function () {
                this
                  .where('event.creatorId', userId)
                  .orWhere('invite.targetId', userId)
            })
            .groupByRaw('event.id');
    }
}

export default new EventService();