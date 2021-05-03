import { response } from "express";
import userDao from "../daos/userDao";
import { ProfileDto, UserDto } from "../dtos/userDto";
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

    async getUserProfile(userId: number): Promise<ProfileDto> {
        const userDetails = await userDao.getUserById(userId);
        const userFriendCount = (await userDao.getFriendsForUser(userId)).length;

        if (userDetails) {
            const { firstName, lastName, displayImageId } = userDetails;
            return new ProfileDto(
                firstName,
                lastName,
                displayImageId,
                userFriendCount
            );
        } else {
            throw new Error("Could not get profile data");
        }
    }
}

export default new UserService();