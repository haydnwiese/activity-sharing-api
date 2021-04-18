import { EventDto } from "../dtos/eventDto";
import { getKnexInstance } from "../utils/dbInjector";

class EventDao {
    async addEvent(event: EventDto) {
        return getKnexInstance()<EventDto>('event').insert(event);
    }

    async getEvents() {
        return getKnexInstance()<EventDto>('event').select('*');
    }

    async getEventById(eventId: number) {
        return getKnexInstance()<EventDto>('event').select('*').where('id', eventId).first;
    }

    async getEventsByCreatorId(creatorId: number) {
        return getKnexInstance()<EventDto>('event').select('*').where('creatorId', creatorId);
    }

    async getUpcomingEventsByUserId(userId: number): Promise<EventDto[]> {
        const knex = getKnexInstance();
        return knex('event')
            .select(
                'event.*',
                knex.raw('COUNT(invite.id) as attendeeCount')
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
    }
}

export default new EventDao();