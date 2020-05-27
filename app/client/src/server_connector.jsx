import io from "socket.io-client";

var SERVER_PORT = 3000;
var SITE_PATH = `http://localhost:${SERVER_PORT}`;
var LOGIN_IS_NECESSARY = "You must LogIn to the system";

const auth_socket = io("http://localhost:8080/users");
const status_socket = io("http://localhost:8080/statuses");
let tasks_socket = io("http://localhost:8080/tasks");

class ServerConnector {
  constructor(path) {
    this._path = path;
  }

  get_statuses() {
    status_socket.emit("getStatuses");
    return new Promise(function(resolve, reject) {  
      status_socket.on("getStatuses", response => {
        if (response.status == 200) {           
          resolve({statuses: response.statuses});
        } else {
          resolve({statuses: []});
        }
      });
    });
  }

  get_tasks() {
    let token = localStorage.getItem("token"); 
    if (token) {  
      tasks_socket = io(`http://localhost:8080/tasks?token=${token}`)    
      tasks_socket.emit("getTasks");
    }
    return new Promise(function(resolve, reject) {      
      tasks_socket.on("getTasks", response => {      
        if (response.status == 401) {             
          resolve({tasks: []});
        } else {                
          resolve({tasks: response.tasks});
        }
      });

      tasks_socket.on("error", function(msg) {
        alert(msg);
        resolve({tasks: []});
      });

    });
}
  
  post_task(data) {
    let token = localStorage.getItem("token"); 
    if (token) {  
      tasks_socket = io(`http://localhost:8080/tasks?token=${token}`)    
      tasks_socket.emit("addTask", data);
    }
    return new Promise(function(resolve, reject) {      
      tasks_socket.on("addTask", response => {      
        if (response.status == 401) {             
          alert(LOGIN_IS_NECESSARY); 
        } else {        
          resolve(response.status);
        }
        resolve(null);
      });

      tasks_socket.on("error", function(msg) {
        alert(msg);
        resolve(null);
      });
    });
  }

  delete_task(task_id) { 
    let token = localStorage.getItem("token"); 
    if (token) {  
      tasks_socket = io(`http://localhost:8080/tasks?token=${token}`)    
      tasks_socket.emit("deleteTask", {task_id: task_id});
    }
    return new Promise(function(resolve, reject) {      
      tasks_socket.on("deleteTask", response => {      
        if (response.status != 204) {             
          alert(LOGIN_IS_NECESSARY); 
        } else {        
          resolve(response.status);
        }
        resolve(null);
      });

      tasks_socket.on("error", function(msg) {
        alert(msg);
        resolve(null);
      });
    });
  }

  get_task_file(task_id) {
    /////////////////////////////////////// empty
  }

  auth_command(command, data) {
    console.log(data.login)
    auth_socket.emit(command, data);
    return new Promise(function(resolve, reject) {  
      auth_socket.on(command, response => {
        if (response.status == 200) { 
          console.log(response.token);
          localStorage.setItem("token", response.token);
          resolve(null);
        } else {
          resolve(`${response.status}. ${response.message}`);
        }
      });
    });
  }

  log_in(data) {
    return this.auth_command("login", data);    
  }

  sign_up(data) {
    return this.auth_command("registration", data);
  }

}

var sc = new ServerConnector(SITE_PATH);

//module.exports = { sc };
export default sc;