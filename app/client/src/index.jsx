import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { EnterForm } from './components/EnterForm';

var FilterForm = require('./components/FilterForm.jsx');
var TasksList = require('./components/TasksList.jsx');

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
      updateState: true
    };
      
    this.need_to_update = this.need_to_update.bind(this);
  }

  need_to_update() {        
    let update = !this.state.updateState;
    this.setState({
      updateState: update
    });        
  }

  render() {  
    return (
      <div>
          <EnterForm update={this.need_to_update} />
          <FilterForm update={this.state.updateState}/>
          <TasksList />
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

