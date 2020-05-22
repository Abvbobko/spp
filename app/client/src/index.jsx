import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';

import { EnterForm } from './components/EnterForm';
import {FilterForm} from './components/FilterForm.jsx';
import {TasksList} from './components/TasksList.jsx';
import {AuthenticationButton} from './components/AuthenticationButton.jsx';
import {LogInForm} from './components/auth_components/LogInPage.jsx';
import {RegistrationForm} from './components/auth_components/RegistrationPage.jsx';

var sc = require('./server_connector.jsx').sc;
var ReactRouterDOM = require("react-router-dom");

const Router = ReactRouterDOM.BrowserRouter;
const Route = ReactRouterDOM.Route;
const Switch = ReactRouterDOM.Switch;

class AppPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      updateState: true,
      tasks: [],
      filterStatus: ''
    };
    
    this.callTasksUpdate = this.callTasksUpdate.bind(this);  
    this.setFilterStatus = this.setFilterStatus.bind(this);      
  }

  componentDidMount() {
    this.callTasksUpdate();
  }

  callTasksUpdate() {
    // вставить проверки
    sc.get_tasks().then(tasks => this.setState({tasks: tasks.tasks}));                
  }

  setFilterStatus(filter_status) {
    this.setState({filterStatus: filter_status});
  }

  render() {  
    
    return (
      <div>
          <div className="top">             
            <div class="input-block">            
              <EnterForm callTasksUpdate={this.callTasksUpdate} />
              <FilterForm setFilterStatus={this.setFilterStatus}/>
            </div>
            <AuthenticationButton />
          </div>
          <TasksList filterStatus={this.state.filterStatus} tasks={this.state.tasks} callTasksUpdate={this.callTasksUpdate}/>
      </div>            
    );
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route exact path="/" component={AppPage} />        
        <Route path="/login" component={LogInForm} />
        <Route path="/registration" component={RegistrationForm} />
      </Switch>
    </Router>
    {/* <AppPage /> */}
  </React.StrictMode>,
  document.getElementById('root')
);

