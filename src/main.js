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

var db = require("./db").db;

app.get("/", function(request, response){    
    db.get_statuses().then(function(statuses) {      
      statuses.forEach(element => {
        console.log(element)
      });      
      response.render(path.resolve(__dirname, "../data/pages/main.ejs"), {"statuses": statuses});
      db.get_tasks().then(function(tasks) { console.log(tasks)});
    }).catch((err) => {console.log(err)})
});

app.post("/", function(request, response){
    // отправляем ответ
    // let status = request.body.status;
    let text = request.body.task;
    let date = request.body.date;
    let filedata = request.file;
    let status = request.body.status;   
    if(!filedata)
      console.log("Не было передано файлов");
    else
      console.log("Файл загружен");

    db.insert_task(text, date, status, filedata);
});

// начинаем прослушивать подключения на 3000 порту
app.listen(3000);