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

  async auth_command(command, data, error_text) {
    let auth_result = await qlQuery({
      query: `
        mutation {
            ${command}(login: "${data.login}", password: "${data.password}")
        }
      `
    })
    let token = auth_result.data[`${command}`]    
    if (!token) {      
      return error_text;
    }
    return null;    
  }

  async log_in(data) {
    const error_text = "Login or password is incorrect.";
    return this.auth_command("login", data, error_text);      
  }

  async sign_up(data) {
    const error_text = "Check the entered data. Perhaps a user with this login already exists.";
    return this.auth_command("signup", data, error_text);    
  }

  async get_tasks() { 
    let statusesProjectile = `
      id, 
      text, 
      status,
      file_name,
      name_on_server, 
      date
    `;
    let statusesQuery = `tasks`;

    let tasks = await qlQuery({
        query: ` {
            ${statusesQuery} {
                ${statusesProjectile}
            }
        }`
    })
    let result_tasks_list = [];
    for (let task_index in tasks.data.tasks) {
      result_tasks_list.push(tasks.data.tasks[task_index]);
    }      
    return {tasks: result_tasks_list};
    //   if (response.status == 401) {
    // //   alert(LOGIN_IS_NECESSARY);
    //     return {tasks: []};    
  }
  
  post_task(data) { ///////////////////////////////
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

 delete_task(task_id) { ///////////////////////////////
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

}

var sc = new ServerConnector(SITE_PATH);

module.exports = { sc };