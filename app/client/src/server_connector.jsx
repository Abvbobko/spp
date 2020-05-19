var SERVER_PORT = 3000//8080

var SITE_PATH = `http://localhost:${SERVER_PORT}`;

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
    return response.json();
  });
  }

 delete_task(task_id) {
   console.log("DELETE TASK SC");
    // добавить проверки всякие    
    return fetch(this._path + `/tasks/${task_id}`, {
        method: 'DELETE'        
    }).then(function(response) {     
      return ; //////////////////////
    });

    // let response = await fetch(this._path + `/tasks/${task_id}`, {method: 'DELETE'});            
    // if (response.ok) {      
    //   let json_result = await response.json();
    //   // console.log("Tasks: ", json_result);    
    // } else {            
    //   console.log(response.status + ": " + response.statusText); }// пример вывода: 404: Not Found
    
  }

  get_task_file(task_id) {
    /////////////////////////////////////// empty
  }

}

var sc = new ServerConnector(SITE_PATH);

module.exports = { sc };