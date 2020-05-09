// подключение express
const express = require("express");
const ejs = require('ejs');
const multer  = require("multer");

var fs = require('fs');
const path = require('path'); 
    
// создаем объект приложения
const app = express();
// добавляет возможность доставать переменные из ответа (и загружать файлы)
// тут лежат файлы (статические данные)
app.use(express.static(__dirname + '/app/static'));
app.use(multer({dest:"../static/files"}).single("file"));
app.set('view engine', 'ejs');
//app.set('views', './static/pages')
var db = require("./db").db;
var data_manipulator = require("./data_manipulator").manipulator;

// NEW

app.get("/statuses", function(request, response) {
  db.get_statuses().then(function(statuses) {
    let status_map = data_manipulator.get_status_map(statuses);      
    response.status(200).json({statuses: Array.from(status_map.values())});
  }).catch((err) => {
    console.log(err);
    response.status(500).send();
  })
});

app.get("/tasks", function(request, response) {
  // получить все таски  
  db.get_statuses().then(function(statuses) {              
    db.get_tasks().then(function(tasks) { 
      let status_map = data_manipulator.get_status_map(statuses);      
      tasks = manipulator.status_id_to_name(tasks, status_map);        
      response.status(200).json({tasks: tasks})
    });
  }).catch((err) => {
    console.log(err)
    response.status(500).send();
  });
});

app.post("/tasks", function(request, response) {
    // добавить таску - возвращается в location /tasks/id
    // date - dd.mm.yyyy
    let text = request.body.task;    
    let date = request.body.date;
    let filedata = request.body.file;
    let status = request.body.status;   
    console.log(filedata);
    if(!filedata)
      console.log("Не было передано файлов");
    else
      console.log("Файл загружен");

    db.insert_task(text, date, status, filedata).then(function(task_id) {
      response.status(201).location('/tasks/' + task_id).send()
    }).catch((err) => {
      console.log(err)
      response.status(500).send();
    });
});

app.delete("/tasks/:task_id", function(request, response) {
  // удалить таску

  // ДОБАВИТЬ УДАЛЕНИЕ ФАЙЛА
  db.get_file_name(request.params.task_id).then(function(file_info) {    
    let file_path = __dirname + `/files/${file_info.name_on_server}`;
    //delete file

    if ((Object.keys(file_info).length) && (fs.existsSync(file_path))) {
      fs.unlink(file_path, function (err) {
        if (err) {
          console.log(err);
          throw err;
        }
        console.log('File deleted!');
      }); 
    }

    db.delete_task(request.params.task_id).then(function() {    
      response.status(204).send('Successfully deleted');
    });
  }).catch((err) => {
    console.log(err);
    response.status(500).send();
  });
});

app.put("/tasks/:task_id", function(request, response) {
  // обновить таску  
});

app.get("/tasks/:task_id/file", function(request, response) {  
  // получить файл  
  db.get_file_name(request.params.task_id).then(function(file_info) {    
    let file_path = __dirname + `/files/${file_info.name_on_server}`;
    if ((Object.keys(file_info).length) && (fs.existsSync(file_path))) {
      console.log(file_info);  
      response.status(200).type("multipart/form-data").download(file_path, file_info.origin_name);
    } else {
      response.status(404).send();
    }
  }).catch((err) => {
    console.log("err");    
    response.status(500).send();
  });
});

// начинаем прослушивать подключения на 3000 порту
app.listen(3000);