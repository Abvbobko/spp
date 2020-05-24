var PORT = 8080    

// подключение express
const express = require("express");
const ejs = require('ejs');
const multer  = require("multer");
const cookieParser = require('cookie-parser');

var fs = require('fs');
const path = require('path'); 

// создаем объект приложения
const app = express();
// добавляет возможность доставать переменные из ответа (и загружать файлы)
// тут лежат файлы (статические данные)
app.use(cookieParser());
app.use(express.static(__dirname + '/app/static'));
app.use(multer({dest:"../static/files"}).single("file"));
app.set('view engine', 'ejs');
//app.set('views', './static/pages')
var db = require("./db").db;
var data_manipulator = require("./data_manipulator").manipulator;
var auth = require("./authentication.js").manipulator;

const middleware = () => {    
  return (request, response, next) => {      
    const token = request.cookies.token;
    console.log(request.cookies);
      if (token) {
        //const token = authHeader.split(' ')[1];        
        let user_info = auth.verify_token(token);
        console.log(user_info);
        if (user_info) {
          request.user_id = user_info.id;
          next();
        } else {          
          console.log("Invalid token");
          response.status(401).send("Invalid token");
        }
      } else {
        console.log("No token");
        response.status(401).send("No token");
      }  
  }
};

app.post("/test", function(request, response) {
  console.log("test");
  console.log(auth.create_token(100, "alexey"));
});

app.post("/login", function(request, response) {
  // вход юзера
  console.log("get user");
  let login = request.body.login;    
  let password = request.body.password;
  auth.verify_password(login, password).then(function(is_password_correct) {
    if (is_password_correct) {
      db.get_user_by_login(login).then(function(user_info) { 
        let token = auth.create_token(user_info.id, user_info.login);
        response.status(200).cookie('token', token, {httpOnly: true}).end();
      });
    } else {
      
      response.status(404).send();
    }
  });
});

app.post("/registration", function(request, response) {
  // регистрация юзера
  console.log("post user");
  let login = request.body.login;    
  let password = request.body.password;
  db.insert_user(login, password).then(function(result) {
    let token = auth.create_token(result.id, result.login);    
    response.status(200).cookie('token', token, {httpOnly: true}).end();
    //
  }).catch((err) => {
    console.log(err);
    response.status(403).send();
  }); 
});

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

app.get("/tasks", middleware(), function(request, response) {
  // получить все таски  
  console.log("Get tasks");
  db.get_statuses().then(function(statuses) {              
    db.get_tasks().then(function(tasks) { 
      let status_map = data_manipulator.get_status_map(statuses);   
      tasks = data_manipulator.status_id_to_name(tasks, status_map);  
      response.set({"Access-Control-Allow-Origin": "http://localhost:3000"});      
      response.status(200).json({tasks: tasks})
    
    }).catch((err) => {
      console.log(err)
      response.status(500).send();
    });

  }).catch((err) => {
    console.log(err)
    response.status(500).send();
  });
});

app.post("/tasks", middleware(), function(request, response) {
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

app.options("/tasks/:task_id", middleware(), function(request, response){
  console.log("OPTIONS");
  //response.set({"Access-Control-Allow-Origin": "http://localhost:3000"});       
    response.header({"access-control-allow-methods": "DELETE"});
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    console.log(response);
    response.status(200).send();
});

app.delete("/tasks/:task_id", middleware(), function(request, response) {
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

app.put("/tasks/:task_id", middleware(), function(request, response) {
  // обновить таску  

  // не тестировалось
  // date - dd.mm.yyyy
  console.log("put start");
  let text = request.body.task;    
  let date = request.body.date;
  let filedata = request.file;
  let status = request.body.status;  

  // удаляем старый файл, если нужно обновить
  if (request.body.update_file) {
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
    });
  }
  
  console.log(filedata);
  if(!filedata)
    console.log("Не было передано файлов");
  else
    console.log("Файл загружен");

    // response.set({"Access-Control-Allow-Origin": "http://localhost:3000"});      
  
  db.update_task(request.params.task_id, text, date, status, filedata).then(function(task_id) {    
    response.status(200).send()
  }).catch((err) => {
    console.log(err)
    response.status(500).send();
  });
});

app.get("/tasks/:task_id/file", middleware(), function(request, response) {  
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