import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';

var EnterForm = require('./components/EnterForm.jsx');
var FilterForm = require('./components/FilterForm.jsx');
var TasksList = require('./components/TasksList.jsx');

class AppPage extends React.Component {
  render() {
      return (
          <div>
              <EnterForm />
              <FilterForm />
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

