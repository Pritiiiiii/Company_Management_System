const { Client } = require('pg'); 

const db = new Client({
    host: 'localhost',
    user: 'postgres',  
    password: 'root1', 
    database: 'internship', 
    port: 5432,
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to the PostgreSQL database.');
    }
});

module.exports = db;
