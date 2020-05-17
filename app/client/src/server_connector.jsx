// var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
// var xhr = new XMLHttpRequest();

var SERVER_PORT = 8080

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

 async delete_task(task_id) {
    // добавить проверки всякие    
    
    let response = await fetch(this._path + `/tasks/${task_id}`, {method: 'DELETE'});            
    if (response.ok) {      
      let json_result = await response.json();
      console.log("Tasks: ", json_result);    
    } else {            
      console.log(response.status + ": " + response.statusText); // пример вывода: 404: Not Found
    }
  }

  get_task_file(task_id) {
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!________________________________тут еще подумать
    // добавить проверки всякие
    // xhr.open('GET', SITE_PATH + `/tasks/${task_id}/file`, false);
    // xhr.send();    
    // console.log(xhr.status);
    // if (xhr.status != 200) {      
    //   console.log( xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
    // } else {      
    //   console.log(1,  JSON.parse(xhr.responseText) ); // responseText -- текст ответа.
    // }
  }

}

var sc = new ServerConnector(SITE_PATH);

module.exports = { sc };