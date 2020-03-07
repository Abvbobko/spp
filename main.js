// подключение express
const express = require("express");
var bodyParser = require("body-parser");
const ejs = require('ejs');

// создаем объект приложения
const app = express();
// добавляет возможность доставать переменные из ответа
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

// определяем обработчик для маршрута "/"
/////////////////// work with data base
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "qwerty12345678"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
////////
app.get("/", function(request, response){
    // отправляем ответ
    var path = require('path'); 
    response.sendFile(__dirname + "/data/pages/main_template.html");
    
});

const path = require('path');
app.post("/", function(request, response){
    // отправляем ответ
    var status = request.body.status;
    console.log(request.body.date);
    //console.log('Got body:', request.body);
    //var fname = request.body.fname;
    //var lname = request.body.lname;
    //console.log(fname + " " + lname)
    //response.send(fname + " " + lname);
});

// начинаем прослушивать подключения на 3000 порту
app.listen(3000);