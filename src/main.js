// подключение express
const express = require("express");
var bodyParser = require("body-parser");
const ejs = require('ejs');
const multer  = require("multer");

// создаем объект приложения
const app = express();
// добавляет возможность доставать переменные из ответа
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer({dest:"../data/files"}).single("file"));

app.set('view engine', 'ejs');

db = require("./db").db;


app.get("/", function(request, response){
    // отправляем ответ
    let path = require('path'); 
    // path.resolve - concat path
    response.sendFile(path.resolve(__dirname, "../data/pages/main_template.html"));
    
});

const path = require('path');
app.post("/", function(request, response){
    // отправляем ответ
    // let status = request.body.status;
    let filedata = request.file;
    let status = request.body.status;
    console.log(status);
    console.log(filedata.originalname);
    if(!filedata)
      console.log("Ошибка при загрузке файла");
    else
      console.log("Файл загружен");
      
    //console.log('Got body:', request.body);
    //var fname = request.body.fname;
    //var lname = request.body.lname;
    //console.log(fname + " " + lname)
    //response.send(fname + " " + lname);
});

// начинаем прослушивать подключения на 3000 порту
app.listen(3000);