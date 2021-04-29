import { InviteDto, InviteStatus } from "../dtos/inviteDto";
import { getKnexInstance } from "../utils/dbInjector";


class InviteDao {
    async addInvite(invite: InviteDto) {
        return getKnexInstance()<InviteDto>('invite').insert(invite).first();
    }

    async findById(inviteId: number) {
        return getKnexInstance()<InviteDto>('invite').where('id', inviteId).first();
    }

    async findByEventId(eventId: number) {
        return getKnexInstance()<InviteDto>('invite').where('eventId', eventId);
    }

    async findAcceptedInvitesByEventIds(eventIds: number[]) {
        return getKnexInstance()<InviteDto>('invite')
            .whereIn('eventId', eventIds)
            .andWhere('status', InviteStatus.Accepted);
    }
}

export default new InviteDao();