const HOST = "localhost";
const USER = "root";
const PASSWORD = "qwerty12345678";

var mysql = require('mysql');

class DataAccessor {
    _con;
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
}

module.exports = { DataAccessor };

//// сделать все в виде обьекта!!!!!!!!!!!!!