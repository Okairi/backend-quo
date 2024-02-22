const mysql = require("mysql");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});
db.getConnection((err) => {
  if (err) {
    throw err;
  }
  console.log("Conexión exitosa a la base de datos MySQL");
});

const executeDB = (query, values) => {
  return new Promise((resolve, reject) => {
    db.query(query, values, (error, result) => {
      if (error) {
        console.error("Error in database", error);
        reject(error);
      }

      resolve(result);
    });
  });
};

module.exports = {
  executeDB,
};
