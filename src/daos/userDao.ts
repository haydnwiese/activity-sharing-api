import { UserDto } from "../dtos/userDto";
import { UserFriendDto, UserFriendStatus } from "../dtos/userFriendDto";
import { getKnexInstance } from "../utils/dbInjector";

class UserDao {
    async addUser(resource: UserDto) {
        return getKnexInstance()<UserDto>('user').insert(resource).first;
    }

    async getUsers() {
        return getKnexInstance()<UserDto>('user').select('*');
    }

    async getUserById(userId: number) {
        return getKnexInstance()<UserDto>('user').where('id', userId).first();
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
    
    async getFriendsForUser(userId: number) {
        return getKnexInstance()<UserFriendDto>('user_friend')
            .select('*')
            .where('status', UserFriendStatus.Accepted)
            .andWhere(function() {
                this
                    .where('sourceId', userId)
                    .orWhere('targetId', userId)
            })
    }
}

export default new UserDao();