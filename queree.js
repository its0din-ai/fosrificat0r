import dotenv from 'dotenv';
import mysql from 'mysql';

const connection = mysql.createConnection({
    host: dotenv.config().parsed.DB_HOST,
    user: dotenv.config().parsed.DB_USER,
    password: dotenv.config().parsed.DB_PASS,
    database: dotenv.config().parsed.DB_NAME
});
connection.connect();

function test_select(){
    connection.query('SELECT * FROM auth_code', (err, rows) => {
        if (err) throw err;
        console.log('Data received from Db:');
        console.log(rows);
    }
    );
}

function test_insert($jsonData){
    connection.query('INSERT INTO auth_code SET ?', $jsonData, 
    (err) => {
        if (err) throw err;
    });
}

function checkCode($user_id, callback){
    const limaMenit = new Date(Date.now() - 30 * 60000);
    const query = 'SELECT * FROM auth_code WHERE user_id = ? AND time > ? ORDER BY time DESC LIMIT 1;';
    connection.query(query, [$user_id, limaMenit], (err, rows) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        return callback(err, null);
      }

      callback(null, rows);
    });
}

export { test_select, test_insert, checkCode };