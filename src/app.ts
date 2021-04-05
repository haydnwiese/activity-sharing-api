import express, {Application, Request, Response} from 'express';
import { Knex, knex } from 'knex';

const app: Application = express();
const port: number = 3000;

const config: Knex.Config = {
    client: 'mysql2',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        database: 'activity_sharing'
    }
}
const knexInstance = knex(config);

interface User {
    id: number;
    authId: string;
    firstName: string;
    lastName: string;
    email: string;
    registeredAt: string;
    lastLogin: string;
}

app.get('/', async (req: Request, res: Response) => {
    try {
        const users = await knexInstance<User>('user').select('*');
        res.send(users)
    } catch (err) {
        console.error(err)
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});
