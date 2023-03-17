var mysql = require('mysql2');
var fs = require('fs');

var db_config = {
  "host": "hostname",
  "port": 3306,
  "user": "username",
  "password" : "password",
};
const db_name = 'urlshortener';

var db = mysql.createConnection(db_config);

db.connect((err) => {
  if (err) {
    console.log('Error connecting to mysql: ' + err);
    setTimeout(init_db, 2000);
    return;
  }
  console.log('Connected to mysql');

  // Create the database
  db.query('CREATE DATABASE IF NOT EXISTS ??', [db_name], (err, result) => {
    if (err) {
      console.log('Error creating database: ' + err);
      return;
    }
    console.log('Database created');

    // Use the database
    db.query('USE ??', [db_name], (err, result) => {
      if (err) {
        console.log('Error using database: ' + err);
        return;
      }
      console.log('Using database');

      // // Create the tables
      // const sqlScript = fs.readFileSync('./database/create_tables.sql').toString();

      // db.query(sqlScript, (err, result) => {
      //   if (err) {
      //     console.log('Error creating tables: ' + err);
      //     return;
      //   }
      //   console.log('Tables created');
      // });
    });
  });
});


module.exports = db;