const HOST = "localhost";
const USER = "root";
const PASSWORD = "qwerty12345678";

var mysql = require('mysql');

class DataAccessor {    
    constructor(host, user, password) {
        this._con = mysql.createConnection({
            host: host,
            user: user,
            password: password
        });
          
        this._con.connect(function(err) {
            if (err) 
                throw err;
            console.log("Connected!");
        });
    }

    insert_task(task_text, task_date, task_status, task_file) {
        
    }
}

db = new DataAccessor(HOST, USER, PASSWORD);

module.exports = { db };