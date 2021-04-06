import User from "../models/user";
import { getKnexInstance } from "../utils/dbInjector";

class UserService {

    async list() {
        return getKnexInstance()<User>('user').select('*');
    }
}

export default new UserService();