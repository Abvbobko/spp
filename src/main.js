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
var data_manipulator = require("./data_manipulator").manipulator;

app.get("/", function(request, response){    
    db.get_statuses().then(function(statuses) {          
      // получаем список всех существующих задач в бд
      db.get_tasks().then(function(tasks) { 
        let status_map = data_manipulator.get_status_map(statuses);
        let status_names = Array.from(status_map.values());
        tasks = manipulator.status_id_to_name(tasks, status_map);
        console.log(tasks);
        response.render(path.resolve(__dirname, "../data/pages/main.ejs"), {"statuses": status_names, "tasks": tasks});
      });
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