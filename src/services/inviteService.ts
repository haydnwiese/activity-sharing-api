import { InviteDto } from '../dtos/inviteDto'; 
import { getKnexInstance } from "../utils/dbInjector";

class InviteService {
    async create(resource: InviteDto) {
        return await getKnexInstance()<InviteDto>('invite').insert(resource).first();
    }

    async findById(inviteId: string) {
        return getKnexInstance()<InviteDto>('user').where('id', inviteId).first();
    }
}