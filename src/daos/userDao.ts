import { UserDto } from "../dtos/userDto";
import { getKnexInstance } from "../utils/dbInjector";

class UserDao {
    async addUser(resource: UserDto) {
        return getKnexInstance()<UserDto>('user').insert(resource).first;
    }

    async getUsers() {
        return getKnexInstance()<UserDto>('user').select('*');
    }

    async getUserByAuthId(resourceId: string) {
        return getKnexInstance()<UserDto>('user').where('authId', resourceId).first();
    }

    async getDisplayImagesByIds(userIds: number[]) {
        return getKnexInstance()<UserDto>('user')
            .select('id', 'displayImageId')
            .whereIn('id', userIds);
    }

    async getIdByAuthId(authId: string) {
        return getKnexInstance()<UserDto>('user').select('id').where('authId', authId).first();
    }
}

export default new UserDao();