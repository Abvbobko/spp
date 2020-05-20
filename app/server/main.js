var PORT = 8080    

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
    response.set({"Access-Control-Allow-Origin": "http://localhost:3000"});
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
      response.set({"Access-Control-Allow-Origin": "http://localhost:3000"});      
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
    console.log("post start");
    let text = request.body.task;    
    let date = request.body.date;
    let filedata = request.file;
    let status = request.body.status;  
    
    console.log(filedata);
    if(!filedata)
      console.log("Не было передано файлов");
    else
      console.log("Файл загружен");

      response.set({"Access-Control-Allow-Origin": "http://localhost:3000"});      
    db.insert_task(text, date, status, filedata).then(function(task_id) {
      let insert_result = {};
      insert_result.id = task_id;
      insert_result.text = text
      if (filedata) {
        insert_result.file_name = filedata.filename;
        insert_result.name_on_server = filedata.originalname;        
      }
      if (date) {
        insert_result.date = date;
      }
      insert_result.status = status;
      response.status(201).location('/tasks/' + task_id).json({tasks: insert_result}).send()
    }).catch((err) => {
      console.log(err)
      response.status(500).send();
    });
});

app.options("/tasks/:task_id", function(request, response){
  console.log("OPTIONS");
  //response.set({"Access-Control-Allow-Origin": "http://localhost:3000"});       
    response.header({"access-control-allow-methods": "DELETE"});
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    console.log(response);
    response.status(200).send();
});

app.delete("/tasks/:task_id", function(request, response) {
  // удалить таску
  
  // ДОБАВИТЬ УДАЛЕНИЕ ФАЙЛА
  db.get_file_name(request.params.task_id).then(function(file_info) {    
    let file_path = path.resolve(__dirname, `../static/files/${file_info.name_on_server}`);
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
    
    response.set({"Access-Control-Allow-Origin": "http://localhost:3000"});       
    response.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
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
  console.log("Try to send file");
  db.get_file_name(request.params.task_id).then(function(file_info) {    
    let file_path = path.resolve(__dirname, `../static/files/${file_info.name_on_server}`);//__dirname + `/files/${file_info.name_on_server}`;
    console.log(file_path);
    response.set({"Access-Control-Allow-Origin": "http://localhost:3000"});   
    if ((Object.keys(file_info).length) && (fs.existsSync(file_path))) {
      console.log(file_info);  
      //var file = fs.readFile(file_path, 'binary');
      response.status(200).type("multipart/form-data").download(file_path, file_info.origin_name);
    } else {  
      response.status(404).send();
    }
  }).catch((err) => {
    console.log("err", err);    
    response.status(500).send();
  });
});

// начинаем прослушивать подключения на 8080 порту
app.listen(PORT);