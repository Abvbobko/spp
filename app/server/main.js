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
app.use(express.static(__dirname + '/files'));
app.use(multer({dest:"./files"}).single("file"));
app.set('view engine', 'ejs');
//app.set('views', './static/pages')
var db = require("./db").db;
var data_manipulator = require("./data_manipulator").manipulator;

// NEW

app.get("/statuses", function(request, response) {
  db.get_statuses().then(function(statuses) {
    let status_map = data_manipulator.get_status_map(statuses);      
    response.status(200).send({statuses: Array.from(status_map.values())})
  }).catch((err) => {
    console.log(err);
  })
});

app.get("/tasks", function(request, response) {
  // получить все таски  
  db.get_statuses().then(function(statuses) {              
    db.get_tasks().then(function(tasks) { 
      let status_map = data_manipulator.get_status_map(statuses);      
      tasks = manipulator.status_id_to_name(tasks, status_map);        
      response.status(200).send({tasks: tasks})
    });
  }).catch((err) => {console.log(err)})
});

app.post("/tasks", function(request, response) {
    // добавить таску - возвращается в location /tasks/id
    // date - dd.mm.yyyy
    let text = request.query.task;
    let date = request.query.date;
    let filedata = request.query.file;
    let status = request.query.status;   
    if(!filedata)
      console.log("Не было передано файлов");
    else
      console.log("Файл загружен");

    db.insert_task(text, date, status, filedata).then(function(task_id) {
      response.status(201).location('/tasks/' + task_id).send()
    });
});

app.delete("/tasks/:task_id", function(request, response) {
  // удалить таску

  // ДОБАВИТЬ УДАЛЕНИЕ ФАЙЛА
  db.delete_task(request.params.task_id).then(function() {    
    response.status(204).send('Successfully deleted');
  }).catch((err) => {console.log(err)})
});

app.put("/tasks/:task_id", function(request, response) {
  // обновить таску  
});

app.get("/tasks/:task_id/file", function(request, response) {
  // можно получать файл по id таски и высылать его
  // получить файл  
  
  // проверить на существование файл
  // если есть, то последние две строчки, иначе 404
  db.get_file_name(request.params.task_id).then(function(file_info) {    
    let file_path = __dirname + `/files/${file_info.name_on_server}`;
    if ((Object.keys(file_info).length) || (fs.existsSync(file_path))) {
      console.log(file_info);  
      response.status(200).type("multipart/form-data").download(file_path, file_info.origin_name);
    } else {
      response.status(404).send();
    }
  }).catch((err) => {
    console.log("err");    
  });
});

// OLD

app.get("/", function(request, response){    
    db.get_statuses().then(function(statuses) {          
      // получаем список всех существующих задач в бд
      db.get_tasks().then(function(tasks) { 
        let status_map = data_manipulator.get_status_map(statuses);
        let status_names = Array.from(status_map.values());
        tasks = manipulator.status_id_to_name(tasks, status_map);        
        response.render("main.ejs", 
          {"statuses": status_names, 
          "selected_status_name": "",
          "tasks": tasks});
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

    db.insert_task(text, date, status, filedata).then(function() {
      response.redirect("/");
    });
});

app.post("/filter", function(request, response){
  let status_name;
  // проблема: не видит request.body
  console.log(`status:${request.body.status}`);
  if (request.body.status == "all") {
    response.redirect("/");
  } else {
    status_name = request.body.status;
    db.get_statuses().then(function(statuses) {          
      let status_map = data_manipulator.get_status_map(statuses);  
      db.get_tasks(status_name).then(function(tasks) {         
        let status_names = Array.from(status_map.values());        
        tasks = manipulator.status_id_to_name(tasks, status_map);                
        response.render("main.ejs", 
          {"statuses": status_names, 
          "selected_status_name": status_name, 
          "tasks": tasks
        });
      });
    }).catch((err) => {console.log(err)})
  }  
});

app.post("/delete", function(request, response) {  
  db.delete_task(request.body.task_id).then(function() {
    response.redirect("/");
  });
});

// начинаем прослушивать подключения на 3000 порту
app.listen(3000);