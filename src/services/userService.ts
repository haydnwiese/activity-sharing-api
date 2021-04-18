import { UserDto } from "../dtos/userDto";
import { getKnexInstance } from "../utils/dbInjector";

class UserService {
    async create(resource: UserDto) {
        const [ userId ] = await getKnexInstance()<UserDto>('user').insert(resource);
        return userId;
    }

    async list() {
        return getKnexInstance()<UserDto>('user').select('*');
    }

    async findByAuthId(resourceId: string) {
        return getKnexInstance()<UserDto>('user').where('authId', resourceId).first();
    }

    async findDisplayImagesByIds(userIds: number[]) {
        return getKnexInstance()<UserDto>('user')
            .select('id', 'displayImageId')
            .whereIn('id', userIds);
    }

    async getIdByAuthId(authId: string) {
        return getKnexInstance()<UserDto>('user').select('id').where('authId', authId).first();
    }
}

export default new UserService();