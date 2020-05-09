var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();

var SITE_PATH = 'http://localhost:3000';

class ServerConnector {
  constructor(path) {
    this._path = path;
  }

  get_statuses() {
    xhr.open('GET', SITE_PATH + '/statuses', false);
    xhr.send();    
    console.log(xhr.status);
    if (xhr.status != 200) {      
      console.log( xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
    } else {      
      console.log(1,  JSON.parse(xhr.responseText) ); // responseText -- текст ответа.
    }
  }

  get_tasks() {
    xhr.open('GET', SITE_PATH + '/tasks', false);
    xhr.send();    
    console.log(xhr.status);
    if (xhr.status != 200) {      
      console.log( xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
    } else {      
      console.log(1,  JSON.parse(xhr.responseText) ); // responseText -- текст ответа.
    }
  }

  delete_task(task_id) {
    // добавить проверки всякие
    xhr.open('DELETE', SITE_PATH + `/tasks/${task_id}`, false);
    xhr.send();    
    console.log(xhr.status);
    if (xhr.status != 200) {      
      console.log( xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
    } else {      
      console.log(1,  JSON.parse(xhr.responseText) ); // responseText -- текст ответа.
    }
  }

}

sc = new ServerConnector(SITE_PATH);

sc.get_tasks();

module.exports = { sc };