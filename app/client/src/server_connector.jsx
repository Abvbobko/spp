var SERVER_PORT = 3000

var SITE_PATH = `http://localhost:${SERVER_PORT}`;
var LOGIN_IS_NECESSARY = "You must LogIn to the system";

class ServerConnector {
  constructor(path) {
    this._path = path;
  }

  async get_statuses() {
    return fetch(this._path + '/statuses').then(function(response) {     
      return response.json();
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

  log_in(data) {
    return fetch(this._path + '/users/login', {
      method: "POST",
      body: data
    }).then(function(response) {     
      if (response.status != 200) {
        //alert(response.statusText);        
        return "Login or password is incorrect.";     
      } else {
        return null;
      }    
      //return response.json();
    });
  }

  sign_up(data) {
    return fetch(this._path + '/users/registration', {
      method: "POST",
      body: data
    }).then(function(response) {     
      if (response.status != 200) {
        //alert(response.statusText);        
        return "Check the entered data. Perhaps a user with this login already exists.";     
      } else {
        return null;
      }    
      //return response.json();
    });
  }

}

var sc = new ServerConnector(SITE_PATH);

module.exports = { sc };