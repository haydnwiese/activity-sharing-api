import inviteDao from '../daos/inviteDao';
import { InviteDto } from '../dtos/inviteDto'; 

class InviteService {
    async create(resource: InviteDto) {
        return inviteDao.addInvite(resource);
    }

    async findById(inviteId: number) {
        return inviteDao.findById(inviteId);
    }

    async findByEventId(eventId: number) {
        return inviteDao.findByEventId(eventId);
    }

    async findAcceptedInvitesByEventIds(eventIds: number[]) {
        return inviteDao.findAcceptedInvitesByEventIds(eventIds);
    }
}

export default new InviteService();