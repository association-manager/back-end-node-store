const knex = require('knex')({
    client: 'mysql',
    version: '5.7',
    connection: {
        host : '127.0.0.1',
        port: '3306',
        user : 'root',
        password : 'root',
        database : 'asmaster'
    },
    pool: { min: 0, max: 7 }
});

export default knex;
