var SERVER_PORT = 3000

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
      return ; 
    });
  }

  get_task_file(task_id) {
    /////////////////////////////////////// empty
  }

}

var sc = new ServerConnector(SITE_PATH);

module.exports = { sc };