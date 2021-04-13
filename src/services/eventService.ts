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
}

export default new EventService();