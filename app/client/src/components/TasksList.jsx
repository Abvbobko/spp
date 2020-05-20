var React = require('react');
var sc = require('../server_connector.jsx').sc;

class Task extends React.Component {
    constructor(props) {
        super(props);
        
        this.delete_button_click = this.delete_button_click.bind(this);
    }

    

    delete_button_click() {
        console.log(this.props.data.id);
        sc.delete_task(this.props.data.id).then(this.props.callTasksUpdate);
    }

    render() {
        // тут мб в <a> нужно полное название
        let file_block;                
        if (this.props.data.file_name) {
            let file_name = this.props.data.file_name.split(" ").join("_")
            file_block = <div className="task-item">
                            <a href={`http://localhost:8080/tasks/${this.props.data.id}/file`} className="big-text" download={file_name}> 
                                {file_name}
                            </a>
                        </div>                                                           
        } else {
            file_block = <div className="task-item">{"(No file)"}</div>                                                           
        }
    
        let date_block;
        if (this.props.data.date) {
            let date = new Date(this.props.data.date);

            let date_str = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
            date_block = <div className="task-item">{date_str}</div>                
        } else {
            date_block = <div className="task-item">{"(No date)"}</div>             
        } 

        return (
            <div id={this.props.data.id} className="task">                            
                    <span className="task-item big-text">{this.props.data.text}</span>
                    {date_block}
                    <div className={`task-item ${this.props.data.status}`}></div>                     
                    {file_block}                    
                    <div className="task task-buttons">
                        <button className="task-item fa fa-edit button" ></button>  
                        <button onClick={this.delete_button_click} className="task-item fa fa-trash-o button" name="task_id"></button>                                                            
                    </div>
            </div>     
        );
    }
}

class TasksList extends React.Component {

    constructor(props) {
        super(props);
        // this.state = {
        //     tasks: [],
        // };
                         
    }

    // componentDidMount() {
    //     sc.get_tasks().then(tasks => this.setState({ tasks: tasks.tasks }));        
    // }

    // componentDidUpdate() {
    //     sc.get_tasks().then(tasks => this.setState({ tasks: tasks.tasks }));        
    // }

    render() {        
        let callTasksUpdateFunc = this.props.callTasksUpdate;
        let filter_status = this.props.filterStatus;
        return (
            <div> {                
                this.props.tasks.map(function(task){             
                    if ((!filter_status) || (task.status == filter_status)) {           
                        return <Task data={task} callTasksUpdate={callTasksUpdateFunc}/>
                    }
                })    
            } </div>
        );
    }
}

module.exports = TasksList;
