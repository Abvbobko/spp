import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { EnterForm } from './components/EnterForm';

var FilterForm = require('./components/FilterForm.jsx');
var TasksList = require('./components/TasksList.jsx');
var sc = require('./server_connector.jsx').sc;

// function a(props) {
//   const [updateState, setUpdateState] = React.useState(true);
//   const need_to_update = React.useCallback(() => {
//     setUpdateState(!updateState);
//   }, [updateState]);
//   return (
//     <div>
//           <EnterForm update={this.need_to_update} />
//           <FilterForm update={this.state.updateState}/>
//           <TasksList />
//       </div>
//   );
// }

class AppPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      updateState: true,
      tasks: []
    };
    
    this.callTasksUpdate = this.callTasksUpdate.bind(this);        
  }

  componentDidMount() {
    this.callTasksUpdate();
  }

  callTasksUpdate() {
    // вставить проверки
    console.log("!!!");
    sc.get_tasks().then(tasks => this.setState({tasks: tasks.tasks}));                
   
  }

  render() {  
    
    return (
      <div>
          <EnterForm callTasksUpdate={this.callTasksUpdate} />
          <FilterForm />
          <TasksList tasks={this.state.tasks} callTasksUpdate={this.callTasksUpdate}/>
      </div>            
    );
  }
}

ReactDOM.render(
  <React.StrictMode>
    <AppPage />
  </React.StrictMode>,
  document.getElementById('root')
);

