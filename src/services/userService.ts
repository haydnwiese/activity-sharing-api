import userDao from "../daos/userDao";
import { UserDto } from "../dtos/userDto";
import { getKnexInstance } from "../utils/dbInjector";

class UserService {
    async create(resource: UserDto) {
        return userDao.addUser(resource);
    }

    async list() {
        return userDao.getUsers();
    }

    async findByAuthId(resourceId: string) {
        return userDao.getUserByAuthId(resourceId);
    }

    async findDisplayImagesByIds(userIds: number[]) {
        return userDao.getDisplayImagesByIds(userIds);
    }

    async getIdByAuthId(authId: string) {
        return userDao.getIdByAuthId(authId);
    }
}

export default new UserService();