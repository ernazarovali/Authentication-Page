const { Pool, Client } = require('pg');
var connection = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT
});

connection.connect();

// connection.query('SELECT 1 + 1 AS solution', function(error, results, fields) {
// 	if(error) throw error;
// 	console.log('The solution is: ', results[0].solution);
// });

module.exports = connection;