// подключение express
const express = require("express");
const ejs = require('ejs');
const multer  = require("multer");

const path = require('path'); 
    
// создаем объект приложения
const app = express();
// добавляет возможность доставать переменные из ответа (и загружать файлы)
app.use(multer({dest:"../data/files"}).single("file"));
app.set('view engine', 'ejs');

db = require("./db").db;

app.get("/", function(request, response){    
    let statuses = db.get_statuses();
    console.log(1, statuses)
    // path.resolve - concat path    
    response.render(path.resolve(__dirname, "../data/pages/main.ejs"), {statuses: statuses});

});

app.post("/", function(request, response){
    // отправляем ответ
    // let status = request.body.status;
    let text = request.body.task;
    let date = request.body.date;
    let filedata = request.file;
    let status = request.body.status;    
    db.insert_task(text, date, status, filedata);
    if(!filedata)
      console.log("Ошибка при загрузке файла");
    else
      console.log("Файл загружен");
});

// начинаем прослушивать подключения на 3000 порту
app.listen(3000);