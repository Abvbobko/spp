import io from "socket.io-client";

var SERVER_PORT = 3000;
var SITE_PATH = `http://localhost:${SERVER_PORT}`;
var LOGIN_IS_NECESSARY = "You must LogIn to the system";

const auth_socket = io("http://localhost:8080/users");
const status_socket = io("http://localhost:8080/statuses");

class ServerConnector {
  constructor(path) {
    this._path = path;
  }

  async get_statuses() {
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
  return fetch(this._path + '/tasks').then(function(response) { 
    if (response.status == 401) {
   //   alert(LOGIN_IS_NECESSARY);
      return {tasks: []};
    } else {
      return response.json();
    }    
    
  });
}
  
  post_task(data) {
    return fetch('/tasks', {
      method: 'POST',
      body: data
    }).then(function(response) {
      if (response.status == 401) {
        alert(LOGIN_IS_NECESSARY);                
      } else if ((response.status == 200) || (response.status == 201)) {
        return response.status;
      }
      return null;
    })
  }

 delete_task(task_id) {
   console.log("DELETE TASK SC");
    // добавить проверки всякие    
    return fetch(this._path + `/tasks/${task_id}`, {
        method: 'DELETE'        
    }).then(function(response) {     
      if (response.status == 401) {
        alert(LOGIN_IS_NECESSARY);        
      } 
      //return ;
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