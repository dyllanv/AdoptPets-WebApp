var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'adoptpets.c1kavdjp3aaq.us-east-2.rds.amazonaws.com',
  port            : '3306',
  user            : 'admin',
  password        : '*****',
  database        : 'adoptpets'
});

module.exports.pool = pool;
