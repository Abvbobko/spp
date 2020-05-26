const PORT = 8080    

const express = require("express");
const http = require('http');
const socketio = require("socket.io");
const multer  = require("multer");
const cookieParser = require('cookie-parser');

const fs = require('fs');
const path = require('path'); 

const app = express();

app.use(cookieParser());
app.use(express.static(__dirname + '/app/static'));
app.use(multer({dest:"../static/files"}).single("file"));
// app.set('view engine', 'ejs');

const db = require("./db").db;
const data_manipulator = require("./data_manipulator").manipulator;
const auth = require("./authentication.js").manipulator;

const server = http.createServer(app);
const io = socketio(server); // если не будет рабоать, то попробовать добавить app port 

io.on("connection", socket => {
  console.log("client is connected");

  socket.on("disconnect", () => {
    console.log("client is disconnected");
  });
});

const statusesNsp = io.of("/statuses");
statusesNsp.on("connection", socket => {
  socket.on("getStatuses", () => {
    console.log("Get statuses");
    db.get_statuses().then(function(statuses) {
      let status_map = data_manipulator.get_status_map(statuses);      
      let response = {
        status: 200, 
        statuses: Array.from(status_map.values())
      }
      socket.emit("statuses", response);      
    }).catch((err) => {
      console.log(err.message);
      let response = {
        status: 500,
        message: err.message
      }      
      socket.emit("statuses", response);            
    })
  });
});

const middleware = () => {    //////////////////////////////////////////////////
  console.log("Check user's token");
  return (request, response, next) => {      
    const token = request.cookies.token;    
      if (token) {        
        let user_info = auth.verify_token(token);      
        if (user_info) {
          request.user_id = user_info.id;
          next();
        } else {          
          console.log("Invalid token");
          response.status(401).send("401 You must log in to the system");
        }
      } else {
        console.log("No token");
        response.status(401).send("401 You must log in to the system");
      }  
  }
};

app.post("/users/login", function(request, response) {  //////////////////////////////////////////////////
  // user login  
  console.log("LogIn");
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

app.post("/users/registration", function(request, response) {  //////////////////////////////////////////////////
  // user registration
  console.log("Registrate user");
  let login = request.body.login;    
  let password = request.body.password;
  db.insert_user(login, password).then(function(result) {
    let token = auth.create_token(result.id, result.login);    
    response.status(200).cookie('token', token, {httpOnly: true}).end();
  }).catch((err) => {
    console.log(err);
    response.status(403).send();
  }); 
});

app.get("/tasks", middleware(), function(request, response) {  //////////////////////////////////////////////////
  // get all tasks  
  console.log("Get tasks");
  db.get_statuses().then(function(statuses) {              
    db.get_tasks().then(function(tasks) { 
      let status_map = data_manipulator.get_status_map(statuses);   
      tasks = data_manipulator.status_id_to_name(tasks, status_map);  
      //response.set({"Access-Control-Allow-Origin": "http://localhost:3000"});      
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

app.post("/tasks", middleware(), function(request, response) {  //////////////////////////////////////////////////
    // add new task    
    console.log("Add new task");
    let text = request.body.task;    
    let date = request.body.date;
    let filedata = request.file;
    let status = request.body.status;  
    
    console.log(filedata);
    if(!filedata)
      console.log("Не было передано файлов");
    else
      console.log("Файл загружен");

      //response.set({"Access-Control-Allow-Origin": "http://localhost:3000"});      
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

app.delete("/tasks/:task_id", middleware(), function(request, response) { //////////////////////////////////////////////////
  // delete task 
  console.log("Delete task");
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
    
    // response.set({"Access-Control-Allow-Origin": "http://localhost:3000"});       
    // response.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    // response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
    db.delete_task(request.params.task_id).then(function() {          
      response.status(204).send('Successfully deleted');
    });
  }).catch((err) => {
    console.log(err);
    response.status(500).send();
  });
});

app.get("/tasks/:task_id/file", middleware(), function(request, response) {    //////////////////////////////////////////////////
  // get file  
  console.log("Send file to client");
  db.get_file_name(request.params.task_id).then(function(file_info) {    
    let file_path = path.resolve(__dirname, `../static/files/${file_info.name_on_server}`);
    console.log(file_path);
    //response.set({"Access-Control-Allow-Origin": "http://localhost:3000"});   
    if ((Object.keys(file_info).length) && (fs.existsSync(file_path))) {
      console.log(file_info);        
      response.status(200).type("multipart/form-data").download(file_path, file_info.origin_name);
    } else {  
      response.status(404).send();
    }
  }).catch((err) => {
    console.log("err", err);    
    response.status(500).send();
  });
});

server.listen(PORT);