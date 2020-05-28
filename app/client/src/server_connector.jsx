var SERVER_PORT = 3000

var SITE_PATH = `http://localhost:${SERVER_PORT}`;
var LOGIN_IS_NECESSARY = "You must log in to the system";

async function qlQuery(obj) {
  console.log("Query" + obj.query)
  let req = new Request(`${SITE_PATH}/graphql`)
  return fetch(req, {
      credentials: "include",
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
      body: JSON.stringify(obj)
  }).then(
    (response) => response.json()
  );
}

class ServerConnector {
  constructor(path) {
    this._path = path;
  }

  async get_statuses() {
    let statusesProjectile = `name`;
    let statusesQuery = `statuses`;

    let statuses = await qlQuery({
        query: ` {
            ${statusesQuery} {
                ${statusesProjectile}
            }
        }`
    })
    let statuses_array = [];
    for (let status in statuses.data.statuses) {
      statuses_array.push(statuses.data.statuses[status].name);
    }    
    return {statuses: statuses_array}
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
    return fetch(this._path + '/login', {
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
    return fetch(this._path + '/registration', {
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