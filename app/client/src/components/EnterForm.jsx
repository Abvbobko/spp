import sc from '../server_connector.jsx';
var React = require('react');
 
class TextField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        }
        this.onChangeHandler = this.onChangeHandler.bind(this);
    }

    componentDidUpdate(prevProps) {    
        if (this.props.isSubmit && prevProps.isSubmit !== this.props.isSubmit) {
            this.setState({
                value: ''
            })
        }
    }

    onChangeHandler(e) {       
        const value = e.target.value;
        this.props.setInputState();
        this.setState({
            value: value
        })
    }

    render() {
        return (
            <div className="task-item task-text-input task-form-item">
                <label htmlFor="task">Task:</label><br/>
                <textarea value={this.state.value} onChange={this.onChangeHandler} type="text" id="task" name="task" required maxLength="255" className="enter-field" />
            </div>
        );
    }    
}

class DateField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        }
        this.onChangeHandler = this.onChangeHandler.bind(this);
    }

    componentDidUpdate(prevProps) {    
        if (this.props.isSubmit && prevProps.isSubmit !== this.props.isSubmit) {
            this.setState({
                value: ''
            })
        }
    }

    onChangeHandler(e) {       
        const value = e.target.value;
        this.props.setInputState();
        this.setState({
            value: value
        })
    }

    render() {
        return (
            <div className="task-item task-form-item">
                <label htmlFor="date">Date:</label>
                <input value={this.state.value} onChange={this.onChangeHandler} type="date" id="date" name="date" className="enter-field" />
            </div>
        );
    }
}

class StatusField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            statuses: [],   
            value: ""         
        };       
        this.onChangeHandler = this.onChangeHandler.bind(this);           
    }    

    componentDidMount(){
        sc.get_statuses().then(
            statuses => this.setState({ statuses: statuses.statuses })
        );        
    }

    componentDidUpdate(prevProps) {    
        if (this.props.isSubmit && prevProps.isSubmit !== this.props.isSubmit) {
            this.setState({
                value: ''
            })
        }
    }

    onChangeHandler(e) {       
        const value = e.target.value;
        this.props.setInputState();
        this.setState({
            value: value
        })
    }

    render() {
    
        return (
            <div className="task-item task-form-item">
                <label htmlFor="status">Status:</label><br/>
                <select id="status" name="status" value={this.state.value} onChange={this.onChangeHandler} className="task-item select-list enter-field">
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
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        }
        this.onChangeHandler = this.onChangeHandler.bind(this);
    }

    componentDidUpdate(prevProps) {    
        if (this.props.isSubmit && prevProps.isSubmit !== this.props.isSubmit) {
            this.setState({
                value: ''
            })
        }
    }

    onChangeHandler(e) {       
        const value = e.target.value;
        this.props.setInputState();
        this.setState({
            value: value
        })
    }

    render() {
        return (
            <div className="task-item task-form-item"> 
                <label htmlFor="file">File:</label>
                <input value={this.state.value}  onChange={this.onChangeHandler} type="file" id="file" name="file"/>
            </div>
        );
    }
}

export class EnterForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSubmit: false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setInputState = this.setInputState.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        const data = new FormData(e.target);
        
        sc.post_task(data).then(this.props.callTasksUpdate);
        
        this.setState({
            isSubmit: true
        });
        
    }

    setInputState(){
        this.setState({            
            isSubmit: false
        })
    }

    render() {
        return (
            <div className="task-form"> 
                <form action="/tasks" method="POST" onSubmit={this.handleSubmit} encType="multipart/form-data">
                    <TextField isSubmit={this.state.isSubmit} setInputState={this.setInputState}/>
                    <DateField isSubmit={this.state.isSubmit} setInputState={this.setInputState}/>
                    <StatusField isSubmit={this.state.isSubmit} setInputState={this.setInputState}/>
                    <FileField isSubmit={this.state.isSubmit} setInputState={this.setInputState}/>                    
                    <input type="submit" id="add-button" value="Отправить" className="task-item task-form-item button" />
                </form>
            </div>
        );
    }
}
