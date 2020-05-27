const PORT = 8080    

const crypto = require('crypto');
const express = require("express");
const http = require('http');
const socketio = require("socket.io");
const multer  = require("multer");
const multerHash = require('multer-hash');
const cookieParser = require('cookie-parser');

const fs = require('fs');
const path = require('path'); 

const app = express();

const static_path = "../static/files";

app.use(cookieParser());
app.use(express.static(__dirname + '/app/static'));
app.use(multer({dest: static_path}).single("file"));
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
      socket.emit("getStatuses", response);      
    }).catch((err) => {
      console.log(err.message);
      let response = {
        status: 500,
        message: err.message
      }      
      socket.emit("getStatuses", response);            
    })
  });
});

const usersNsp = io.of("/users");
usersNsp.on("connection", socket => {
  socket.on("login", data => {
    console.log("login");
    let login = data.login;    
    let password = data.password;
    console.log(`${login} - ${password}`);
    auth.verify_password(login, password).then(function(is_password_correct) {      
      if (is_password_correct) {        
        db.get_user_by_login(login).then(function(user_info) { 
          let token = auth.create_token(user_info.id, user_info.login);
          let response = {
            status: 200,
            token: token,
            message: "Successfully login"
          };                   
          socket.emit("login", response); 
        });
      } else {
        let response = {
          status: 404,
          message: "Not found"
        }
        socket.emit("login", response);                       
      }    
    });
  });

  socket.on("registration", data => {
    console.log("Registrate user");
    let login = data.login;    
    let password = data.password;
    db.insert_user(login, password).then(function(result) {      
      let token = auth.create_token(result.id, result.login);    
      let response = {
        status: 200,
        token: token,
        message: "Successfully register"
      };                   
      socket.emit("registration", response);
      //response.status(200).cookie('token', token, {httpOnly: true}).end();
    }).catch((err) => {
      console.log(err);
      let response = {
        status: 403,
        message: "Error in registration. Please, check your data and try again."
      }
      socket.emit("registration", response);             
    });
  });
});

const tasksNsp = io.of("/tasks");

tasksNsp.use((socket, next) => {
  // middleware
  console.log("Check user's token");        
  if (socket.handshake.query && socket.handshake.query.token) {
    let token = socket.handshake.query.token;         
    let user_info = auth.verify_token(token);      
    if (user_info) {
      socket.user_id = user_info.id; ///////////////////?????????????????     
      next();
    } else {          
      console.log("Invalid token");
      let response = {
        status: 401,
        message: "Invalid token. You must log in to the system"
      }      
      socket.send(response);       
    }
  } else {
    console.log("No token");
    let response = {
      status: 401,
      message: "No token. You must log in to the system"
    }      
    socket.send(response);     
  }  
});

tasksNsp.on("connection", socket => {
  socket.on("getTasks", () => {
    console.log("Get tasks");    
    db.get_statuses().then(function(statuses) {              
      db.get_tasks().then(function(tasks) { 
        let status_map = data_manipulator.get_status_map(statuses);   
        tasks = data_manipulator.status_id_to_name(tasks, status_map);                   
        let response = {
          status: 200,
          tasks: tasks
        }              
        socket.emit("getTasks", response);
      }).catch((err) => {        
        console.log(err)        
        let response = {
          status: 500,
          message: "Internal Server Error"
        }      
        socket.emit("getTasks", response);
      });

    }).catch((err) => {
      console.log(err)
      let response = {
        status: 500,
        message: "Internal Server Error"
      }      
      socket.emit("getTasks", response);
    });
  });

  socket.on("addTask", data => {
    console.log("Add new task");
    let text = data.task;    
    let date = data.date;
    let file_data = data.file;
    let file_name = data.file_name;
    let status = data.status;      

    let file_info = null;
    if (file_data && file_name) {      
      let name_on_server = Date.now().toString() + crypto.createHash('sha1').update(file_name).digest('hex');    
      let file_path = path.resolve(__dirname, static_path + `/${name_on_server}`);
      file_info = {
        filename: name_on_server, 
        originalname: file_name
      };
      fs.writeFile(file_path, file_data, function(err) {
        if(err) {
            return console.log(err);
        }        
        console.log("The file was saved!");
      }); 
    }

    db.insert_task(text, date, status, file_info).then(function(task_id) {
      let insert_result = {};
      insert_result.id = task_id;
      insert_result.text = text
      if (file_info) {
        insert_result.file_name = file_info.filename;
        insert_result.name_on_server = file_info.originalname;        
      }
      if (date) {
        insert_result.date = date;
      }
      insert_result.status = status;
      let response = {
        status: 200,
        tasks: insert_result
      }
      socket.emit("addTask", response);
    }).catch((err) => {
      console.log(err.message);
      let response = {
        status: 500,
        message: "Internal Server Error"
      }      
      socket.emit("addTask", response);
    });

  });

  socket.on("deleteTask", data => {

  });

  socket.on("getFile", data => {

  });
});

app.delete("/tasks/:task_id", /*middleware(),*/ function(request, response) { //////////////////////////////////////////////////
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

    db.delete_task(request.params.task_id).then(function() {          
      response.status(204).send('Successfully deleted');
    });
  }).catch((err) => {
    console.log(err);
    response.status(500).send();
  });
});

app.get("/tasks/:task_id/file", /*middleware(),*/ function(request, response) {    //////////////////////////////////////////////////
  // get file  
  console.log("Send file to client");
  db.get_file_name(request.params.task_id).then(function(file_info) {    
    let file_path = path.resolve(__dirname, `../static/files/${file_info.name_on_server}`);
    console.log(file_path);    
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