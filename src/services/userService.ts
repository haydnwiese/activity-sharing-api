import { UserDto } from "../dtos/userDto";
import { getKnexInstance } from "../utils/dbInjector";

class UserService {

    async list() {
        return getKnexInstance()<UserDto>('user').select('*');
    }
}

export default new UserService();