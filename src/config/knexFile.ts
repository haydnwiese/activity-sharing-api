import moment from 'moment';

export default {
    client: 'mysql2',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        database: 'activity_sharing',
        typeCast: function (field: any, next: any) {
            if (field.type == 'DATETIME') {
                return moment(field.string()).format('YYYY-MM-DD[T]HH:mm:ss');
            }
            return next();
        }
    }
}