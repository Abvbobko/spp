var PORT = 8080    

const express = require("express");
const multer  = require("multer");
const cookieParser = require('cookie-parser');
const graphqlHTTP = require('express-graphql');

var fs = require('fs');
const path = require('path'); 

const app = express();

app.use(cookieParser());
app.use(express.static(__dirname + '/app/static'));
app.use(multer({dest:"../static/files"}).single("file"));

var db = require("./db").db;
var data_manipulator = require("./data_manipulator").manipulator;
var auth = require("./authentication.js").manipulator;

const schema = require("./schema.js").appSchema;

let root = {
  statuses: getStatuses,
  login: login,
  signup: registration,  
  tasks: getTasks,    
  deleteTask: deleteTask  
}

app.use('/graphql', (request, response) => 
    graphqlHTTP({
        schema: schema, 
        rootValue: root,
        context: {request, response},
        graphiql: true
    })(request, response)
    
)

// const middleware = () => {    
//   return (request, response, next) => {      
//     const token = request.cookies.token;
//     console.log(request.cookies);
//       if (token) {
//         let user_info = auth.verify_token(token);
//         console.log(user_info);
//         if (user_info) {
//           request.user_id = user_info.id;
//           next();
//         } else {          
//           console.log("Invalid token");
//           response.status(401).send("401 You must log in to the system");
//         }
//       } else {
//         console.log("No token");
//         response.status(401).send("401 You must log in to the system");
//       }  
//   }
// };

async function getStatuses(args, context) {
  console.log("Get statuses")
  // if (!context.request.currentUser) {
  //     return [];
  // }

  let result = await db.get_statuses().then(function(statuses) {
    let status_map = data_manipulator.get_status_map(statuses); 
    let result = [];
    status_map.forEach((status_name, status_id) => {    
      result.push({name: status_name});
    })    
    return result;
  }).catch((err) => {
    console.log(err);    
    return [];
  });
  console.log(result);
  return result;
}

async function login(args, context) {
  // вход юзера
  console.log("login");
  const {login, password} = args;
  let token = await auth.verify_password(login, password).then(function(is_password_correct) {
    if (is_password_correct) {
      return db.get_user_by_login(login).then(async function(user_info) { 
        let token = auth.create_token(user_info.id, user_info.login);        
        return token;        
      });
    } else {
      return ""
    }
  });
  return token;
}

async function registration(args, context) {
  console.log("registration");
  const {login, password} = args;
  
  let token = db.insert_user(login, password).then(function(result) {
    const token = auth.create_token(result.id, result.login);    
    return token;    
  }).catch((err) => {
    console.log(err);
    return "";
  });
  console.log(token);
  return token;
}

async function getTasks(args, context) {
  console.log("Get tasks");
  let tasks = db.get_statuses().then(function(statuses) {              
    return db.get_tasks().then(function(tasks) { 
      let status_map = data_manipulator.get_status_map(statuses);   
      tasks = data_manipulator.status_id_to_name(tasks, status_map);  
      return tasks;
    }).catch((err) => {
      console.log(err)
      return [];
    });

  }).catch((err) => {
    return [];
  });  
  return tasks;
}

async function deleteTask(args, context) {
  // удалить таску
  console.log("delete")
  let task_id = args.id;
  let is_deleted = db.get_file_name(task_id).then(function(file_info) {    
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
    
    return db.delete_task(task_id).then(function() {          
      return true;
    });
  }).catch((err) => {
    console.log(err);
    return false;
  });
  return is_deleted;
}

app.post("/tasks", /* middleware(),*/ function(request, response) {
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

app.get("/tasks/:task_id/file", /* middleware(),*/ function(request, response) {  
  // получить файл  
  console.log("Get file");
  db.get_file_name(request.params.task_id).then(function(file_info) {    
    let file_path = path.resolve(__dirname, `../static/files/${file_info.name_on_server}`);
    if ((Object.keys(file_info).length) && (fs.existsSync(file_path))) {      
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