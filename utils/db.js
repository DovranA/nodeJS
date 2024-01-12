import mysql from 'mysql2'

const connection = mysql.createConnection({
  host: '127.0.0.1',
  port: '3306',
  user: 'root',
  password: 'root',
  database: 'newsmart',
  multipleStatements: true,
})

connection.connect((err) => {
  if (err) {
    console.log('error connection to mysql')
  } else {
    console.log('connected to mysql')
  }
})

export default connection
