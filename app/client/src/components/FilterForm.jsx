var React = require('react');
var sc = require('../server_connector.jsx').sc;

export class FilterForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            statuses: [],
            filterValue: ""
        };          
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        sc.get_statuses().then(
            statuses => this.setState({ 
                statuses: statuses.statuses 
            })
        );        
    }

    onChangeHandler(e) {       
        let value = e.target.value;
        if (value == "all") {
            value = "";
        }
        this.setState({
            filterValue: value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.setFilterStatus(this.state.filterValue);        
    }

    onSubmit(e) {
        this.props.setFilterStatus(this.state.filterValue);
    }

    render() {
        return (
            <div>
                <form id="filter_form" onSubmit={this.handleSubmit}>     
                    <div className="task filter-form">
                        <div className="task-item filter-form-item">
                            <label htmlFor="status">Status filter:</label>
                            <select id="status" name="status" onChange={this.onChangeHandler} defaultValue="all" form="filter_form" className="task-item select-list enter-field">
                                <option value="all">all</option> 
                                {
                                    this.state.statuses.map(function(status){                        
                                        return <option value={status}>{status}</option>
                                    })    
                                }
                            </select>
                        </div>
                        <input type="submit" value="Show" className="task-item filter-form-item button" />
                    </div>
                </form>
            </div>
        );
    }
}