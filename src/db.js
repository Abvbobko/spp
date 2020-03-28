const HOST = "localhost";
const USER = "root";
const PASSWORD = "qwerty12345678";

var mysql = require('mysql');

class DataAccessor {    
    constructor(host, user, password) {
        this._con = mysql.createConnection({
            host: host,
            user: user,
            password: password,
            database: "todo_db"
        });
          
        this._con.connect(function(err) {
            if (err) 
                throw err;
            console.log("Connected!");
        });
    }

    insert_task(task_text, task_date, task_status, task_file) {
        const user = [task_text, task_file.originalname, task_date, 1, task_file.filename];
        const sql = "INSERT INTO tasks(text, file_name, date, STATUSES_id, name_on_server) VALUES(?, ?, ?, ?, ?)";
 
        this._con.query(sql, user, function(err, results) {
            if(err) 
                console.log(err);
            else 
                console.log("Данные добавлены");   
        });
    }

    close_connection() {
        // закрытие подключения
        this._con.end(function(err) {
            if (err) {
                console.log("Ошибка: " + err.message);
            }
            console.log("Подключение закрыто.");
        });
    }
}

db = new DataAccessor(HOST, USER, PASSWORD);

module.exports = { db };