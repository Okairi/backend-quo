const mysql = require("mysql");

const db = mysql.createPool({
  host: "quo.cheuuoo0eeln.us-east-1.rds.amazonaws.com",
  user: "root",
  password: "Alessandro123!",
  database: "quo",
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
