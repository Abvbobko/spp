var React = require('react');
var sc = require('../server_connector.jsx').sc;
//var SearchPlugin = require('./SearchPlugin.jsx');
 
class TextField extends React.Component {
    render() {
        return (
            <div className="task-item task-text-input task-form-item">
                <label htmlFor="task">Task:</label><br/>
                <textarea type="text" id="task" name="task" required maxLength="255" className="enter-field" />
            </div>
        );
    }    
}

class DateField extends React.Component {
    render() {
        return (
            <div className="task-item task-form-item">
                <label htmlFor="date">Date:</label>
                <input type="date" id="date" name="date" className="enter-field" />
            </div>
        );
    }
}

class StatusField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            statuses: [],
          };          
    }

    componentDidMount(){
        sc.get_statuses().then(
            statuses => this.setState({ statuses: statuses.statuses })
        );        
    }

    render() {
        return (
            <div className="task-item task-form-item">
                <label htmlFor="status">Status:</label><br />
                <select id="status" name="status" className="task-item select-list enter-field">
                {
                    this.state.statuses.map(function(status){                        
                        return <option value={status}>{status}</option>
                    })    
                }
                </select>
            </div>   
        );
    }
}

class FileField extends React.Component {
    render() {
        return (
            <div className="task-item task-form-item"> 
                <label htmlFor="file">File:</label>
                <input type="file" id="file" name="file"/>
            </div>
        );
    }
}

export class EnterForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        const data = new FormData(e.target);
    
        fetch('/tasks', {
            method: 'POST',
            body: data,
        }).then(this.props.callTasksUpdate);
        
    }

    render() {
        return (
            <div className="task-form"> 
                <form action="/tasks" method="POST" onSubmit={this.handleSubmit} encType="multipart/form-data">
                    <TextField />
                    <DateField />
                    <StatusField />
                    <FileField />                    
                    <input type="submit" id="add-button" value="Отправить" className="task-item task-form-item button" />
                </form>
            </div>
        );
    }
}
