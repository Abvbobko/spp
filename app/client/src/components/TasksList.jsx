var React = require('react');
var sc = require('../server_connector.jsx').sc;

class Task extends React.Component {
    render() {
        return (
            <form id={this.props.data.id} method="POST" className="task">                            
                    <span className="task-item big-text">{this.props.data.text}</span>
                    <div className="task-item">{this.props.data.date}</div>                
                    <div className={`task-item ${this.props.data.status}`}></div> 
                    <div className="task-item">{this.props.data.file_name}</div>                                                           
                    <div className="task task-buttons">
                        <button className="task-item fa fa-edit button" ></button>  
                        <button className="task-item fa fa-trash-o button" name="task_id"></button>                                                            
                    </div>
            </form>     
        );
    }
}

class TasksList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
          };          
    }


    validate_tasks(tasks) {
        
    }

    componentDidMount(){
        sc.get_tasks().then(
            tasks => this.setState({ tasks: tasks.tasks })
        );
        // sc.get_tasks().then(data => this.setState({tasks: data }));
    }

    render() {
        return (
            <div>
                
                    {
                        this.state.tasks.map(function(task){                        
                            return <Task data={task} />
                        })    
                    }
                                                       
                                    
            </div>
        );
    }
}

module.exports = TasksList;
