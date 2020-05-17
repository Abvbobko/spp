var React = require('react');
var sc = require('../server_connector.jsx').sc;

class Task extends React.Component {
    render() {
        let file_block;        
        console.log(this.props);
        if (this.props.data.file_name) {
            let file_name = this.props.data.file_name.split(" ").join("_")
            file_block = <div className="task-item"><a href={`/tasks/${this.props.data.id}/file`} className="big-text" download={file_name}>{file_name}</a></div>                                                           
        } else {
            file_block = <div class="task-item">{"(No file)"}</div>                                                           
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
            <form id={this.props.data.id} method="POST" className="task">                            
                    <span className="task-item big-text">{this.props.data.text}</span>
                    {date_block}
                    <div className={`task-item ${this.props.data.status}`}></div>                     
                    {file_block}                    
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

    componentDidMount(){
        sc.get_tasks().then(tasks => this.setState({ tasks: tasks.tasks }));        
    }

    render() {
        return (
            <div> {
                this.state.tasks.map(function(task){                        
                    return <Task data={task} />
                })    
            } </div>
        );
    }
}

module.exports = TasksList;
