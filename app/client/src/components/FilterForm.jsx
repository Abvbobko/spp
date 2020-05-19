var React = require('react');
var sc = require('../server_connector.jsx').sc;

class FilterForm extends React.Component {
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
            <div>
                <form action="/filter" method="POST" id="filter_form">     
                    <div className="task filter-form">
                        <div className="task-item filter-form-item">
                            <label htmlFor="status">Status filter:</label>
                            <select id="status" name="status" defaultValue="all" form="filter_form" className="task-item select-list enter-field">
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

module.exports = FilterForm;
