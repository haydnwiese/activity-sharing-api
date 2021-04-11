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

    async findById(resourceId: string) {
        return getKnexInstance()<UserDto>('user').select('*').where('authId', resourceId)
    }
}

export default new UserService();